import {
  Inject,
  Injectable,
  LoggerService,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  FindOptions,
  Op,
  QueryTypes,
  Transaction,
  UpdateOptions,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { EventModel } from './models/event.model';
import DbUpdateResponse from '../shared-types/db-update-response';
import DbDeleteResponse, {
  toDbDeleteResponse,
} from '../shared-types/db-delete-response';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventRequest } from './dto/create-event-request';
import { UpdateEventRequest } from './dto/update-event-request';
import BitlyService from './bitly.service';
import getSlug from '../utils/get-slug';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DatetimeVenueModel } from './models/datetime-venue.model';
import { isNullOrUndefined } from '../utils';
import { StartEndTimePairs } from '../shared-types/start-end-time-pairs';
import { VenueModel } from '../venues/models/venue.model';
import { INFINITE_WEB_PORTAL_BASE_URL } from '../constants';
import { EventAdminMetadataModel } from './models/event-admin-metadata.model';
import UpsertEventAdminMetadataRequest from './dto/upsert-event-admin-metadata-request';
import { ensureEmbedQueryStringIsArray } from '../utils/get-options-for-events-service-from-embeds-query-param';
import { Nullable } from '../utils/NullableOrUndefinable';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
import { PartnerModel } from '../users/models/partner.model';
import { RequestWithUserInfo } from '../users/dto/RequestWithUserInfo';
import {
  isOwner,
  removeSensitiveDataForSingleEvent,
} from '../authentication/filters/remove-sensitive-data-for-non-admins';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventModel) private eventModel: typeof EventModel,
    @InjectModel(EventAdminMetadataModel)
    private eventAdminMetadataModel: typeof EventAdminMetadataModel,
    @InjectModel(DatetimeVenueModel)
    private dateTimeVenueModel: typeof DatetimeVenueModel,
    @InjectModel(VenueModel)
    private venueModel: typeof VenueModel,
    @InjectModel(PartnerModel)
    private partnerModel: typeof PartnerModel,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly bitlyService: BitlyService,
    private sequelize: Sequelize,
  ) {}

  async findById(
    request: RequestWithUserInfo,
    id: string,
    findOptions?: FindOptions,
  ): Promise<EventModel> {
    let options = {
      where: { id },
    };

    if (findOptions) {
      options = { ...findOptions, ...options };
    }

    // findOne will add the include option with all the necessary embedded models
    return await this.findOneWithRelated(options)
      .then((event) => {
        if (isNullOrUndefined(event)) {
          throw new NotFoundException('Could not find event: ' + id);
        } else {
          return event;
        }
      })
      .then((event) => removeSensitiveDataForSingleEvent(request, event));
  }

  // just a private utility with no auth checks for use internally,
  // it automatically applies includes
  private async findOneWithRelated(
    findOptions: FindOptions,
  ): Promise<EventModel> {
    const event = await this.eventModel.findOne({
      include: [DatetimeVenueModel, VenueModel, PartnerModel],
      ...findOptions,
    });

    if (event) {
      await this.populateVenuePartners([event]);
    }

    return event;
  }

  async findAll(
    request: RequestWithUserInfo,
    findOptions?: FindOptions,
  ): Promise<EventModel[]> {
    const isInfiniteAdmin = request.userInformation?.isInfiniteAdmin;
    const isPartnerAdmin = request.userInformation?.isPartnerAdmin;

    const include =
      isInfiniteAdmin || isPartnerAdmin
        ? [
            DatetimeVenueModel,
            VenueModel,
            PartnerModel,
            EventAdminMetadataModel,
          ]
        : [DatetimeVenueModel, VenueModel, PartnerModel];

    const defaultOptions = { include };

    const mergedOptions = findOptions
      ? { ...defaultOptions, ...findOptions }
      : defaultOptions;

    const results = await this.eventModel.findAll(mergedOptions);

    await this.populateVenuePartners(results);

    return results;
  }

  async findAllPaginated({
    request,
    tags = [],
    category,
    owningPartnerIds = [],
    verifiedOnly = true,
    pageSize,
    requestedPage,
    startDate,
    endDate,
  }: FindAllPaginatedArgs): Promise<{ count: number; rows: EventModel[] }> {
    const isInfiniteAdmin = request.userInformation?.isInfiniteAdmin;
    const isPartnerAdmin = request.userInformation?.isPartnerAdmin;

    // Validate that both startDate and endDate are provided together
    if (
      (!isNullOrUndefined(startDate) && isNullOrUndefined(endDate)) ||
      (isNullOrUndefined(startDate) && !isNullOrUndefined(endDate))
    ) {
      throw new BadRequestException(
        'Both startDate and endDate must be provided together',
      );
    }
    return this.sequelize.transaction(async () => {
      const tagClauseParams = this.getTagsClauseParams(tags);
      const whereClause = this.getWhereClause(
        tagClauseParams,
        category,
        owningPartnerIds,
        verifiedOnly,
        startDate,
        endDate,
      );

      // Sort events by the first start_time and apply pagination
      // Note, we have to sort by first_start_time in our common table expression to apply pagination correctly, but we
      // also have to sort again over our page in the final join with events, because the order after joining is not
      // guaranteed to stay the same.
      // We've also added a secondary order by on created_at to ensure that events without start_time like
      // online resources at least sort consistently
      const paginatedRows: EventModel[] = await this.sequelize.query(
        `
              with compressed_event as (
                SELECT
                  events.*,
                  min(dv.start_time) as first_start_time,
                  max(dv.end_time) as last_end_time
                FROM events
                LEFT OUTER JOIN datetime_venue dv on events.id = dv.event_id
                  ${whereClause}
              GROUP BY (events.id)
              ORDER BY first_start_time DESC, "createdAt" DESC
              OFFSET ${(requestedPage - 1) * pageSize} LIMIT ${pageSize} )
              SELECT events.*
              FROM compressed_event
                       JOIN events ON events.id = compressed_event.id
                       ORDER BY compressed_event.first_start_time DESC, "createdAt" DESC
          `,
        {
          type: QueryTypes.SELECT,
          model: EventModel,
          replacements: {
            tagFilter: tagClauseParams,
            categoryFilter: category,
            startDate,
            endDate,
          },
        },
      );

      // Fill back in nested models date_times and venues
      const dateTimes = await this.dateTimeVenueModel.findAll({
        where: {
          event_id: {
            [Op.or]: paginatedRows.map(({ id }) => id),
          },
        },
        include: [VenueModel],
      });

      // Only fetch event_admin_metadata if user is infinite-admin or possibe
      // owner
      let eventAdminMetadata: any[] = [];
      if (isInfiniteAdmin || isPartnerAdmin) {
        eventAdminMetadata = await this.eventAdminMetadataModel.findAll({
          where: {
            event_id: {
              [Op.or]: paginatedRows.map(({ id }) => id),
            },
          },
        });
      }

      // Fetch partners for events that have owning_partner_id
      const partnerIds = paginatedRows
        .map(({ owning_partner_id }) => owning_partner_id)
        .filter(isNotNullOrUndefined);

      const partners =
        partnerIds.length > 0
          ? await this.partnerModel.findAll({
              where: {
                id: {
                  [Op.or]: partnerIds,
                },
              },
            })
          : [];

      // Derive venues and populate venue partners before the ownership check
      // so that venue-partner associations are available when isOwner runs
      paginatedRows.forEach((event) => {
        const dateTimesForEvent = dateTimes.filter(
          ({ event_id }) => event_id === event.id,
        );
        event.date_times = dateTimesForEvent;

        const uniqueVenues = new Map<string, VenueModel>();
        dateTimesForEvent.forEach((dt) => {
          if (dt.venue && !uniqueVenues.has(dt.venue.id)) {
            uniqueVenues.set(dt.venue.id, dt.venue);
          }
        });
        event.venues = [...uniqueVenues.values()];
      });

      await this.populateVenuePartners(paginatedRows);

      paginatedRows.forEach((event) => {
        // Find and assign the corresponding partner
        const partnerForEvent = event.owning_partner_id
          ? partners.find(({ id }) => id === event.owning_partner_id)
          : undefined;

        // will always be true for infinite-admin, otherwise depends on the
        // users partner associations
        if (isOwner(event, request)) {
          // Find and assign the corresponding admin metadata only if user is admin
          // This is where we store information such as whether the event has been
          // flagged as have problems in the admin UI
          event.event_admin_metadata = eventAdminMetadata.find(
            ({ event_id }) => event_id === event.id,
          );
        } else {
          // they do not own this even so we should filter sensitive data
          event.organizer_contact = undefined;
        }

        event.owning_partner = partnerForEvent;
      });

      const totalCount = await this.getEventCountWithFilters(
        tagClauseParams,
        whereClause,
        startDate,
        endDate,
      );

      return { count: totalCount, rows: paginatedRows };
    });
  }

  async update(
    request: RequestWithUserInfo,
    id: string,
    values: Partial<UpdateEventRequest>,
  ): Promise<DbUpdateResponse<EventModel>> {
    return this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction };
      const updateQueryOptions: UpdateOptions = {
        where: { id },
        returning: true,
        transaction,
      };

      // validate ownership before updating (infinite admins own anything and everything)
      const event = await this.findOneWithRelated({ where: { id } });
      if (isNullOrUndefined(event)) {
        throw new NotFoundException('Could not find event: ' + id);
      }

      if (!isOwner(event, request)) {
        throw new ForbiddenException(
          'You do not have access to edit this event',
        );
      }

      const [numberOfAffectedEntities] = await this.eventModel.update(
        values as Partial<EventModel>,
        updateQueryOptions,
      );

      await this.updateDatetimeVenueEntries(
        id,
        values.venue_id,
        values.date_times,
        transactionHost,
      );

      // refetching the event makes sure we get back all related models, since this is all inside a transaction it
      // should be safe
      const updatedEvent = await this.findOneWithRelated({
        where: { id },
        transaction,
      });

      return {
        numberOfAffectedEntities,
        updatedEntities: [updatedEvent],
      } as DbUpdateResponse<EventModel>;
    });
  }

  private async updateDatetimeVenueEntries(
    eventId: string,
    venueId: string,
    dateTimes: StartEndTimePairs[],
    transactionHost: { transaction: Transaction },
  ) {
    if (isNullOrUndefined(dateTimes)) return;

    await this.dateTimeVenueModel.destroy({
      where: { event_id: eventId },
      transaction: transactionHost.transaction,
    });

    return this.createDatetimeVenueEntries(
      eventId,
      venueId,
      dateTimes,
      transactionHost,
    );
  }

  async create(newEvent: CreateEventRequest): Promise<EventModel> {
    return this.sequelize.transaction(async (transaction) => {
      const transactionHost = { transaction };

      const eventWithServerSideGeneratedAttributes =
        await this.fillInServerSideGeneratedAttributes(newEvent);

      const event = await this.eventModel.create(
        eventWithServerSideGeneratedAttributes as Partial<EventModel>,
        transactionHost,
      );

      await this.createDatetimeVenueEntries(
        event.id,
        event.venue_id,
        eventWithServerSideGeneratedAttributes.date_times,
        transactionHost,
      );

      return event;
    });
  }

  private async createDatetimeVenueEntries(
    eventId: string,
    venueId: string,
    dateTimes: StartEndTimePairs[],
    transactionHost: { transaction: Transaction },
  ) {
    if (isNullOrUndefined(dateTimes)) return;

    const requests = dateTimes.map(
      async ({ start_time, end_time, timezone, optional_title }) => {
        const startTimeDt =
          typeof start_time === 'string' ? new Date(start_time) : start_time;
        const endTimeDt =
          typeof end_time === 'string' ? new Date(end_time) : end_time;

        const id = uuidv4();

        return this.dateTimeVenueModel.create(
          {
            id,
            event_id: eventId,
            venue_id: venueId,
            start_time: startTimeDt,
            end_time: endTimeDt,
            timezone,
            optional_title,
          },
          transactionHost,
        );
      },
    );

    return Promise.all(requests);
  }

  async delete(
    id: string,
    request: RequestWithUserInfo,
  ): Promise<DbDeleteResponse> {
    if (
      request?.userInformation?.isInfiniteAdmin ||
      request?.userInformation?.isPartnerAdmin
    ) {
      // Check that we own the event
      //   Note: There is an optimization oportunity here I'm fetching the whole model to verify this.
      //     It's probably fast enough we don't delete often but if ever it's a problem we can definitly
      //     improve this
      const event = await this.findOneWithRelated({ where: { id } });
      if (!isOwner(event, request)) {
        this.logger
          .warn(`Event "${id}" could not be deleted because the user is not the owner:
          ${JSON.stringify(request?.userInformation, null, 4)}`);
        throw new ForbiddenException();
      }

      // success
      return this.eventModel
        .destroy({ where: { id } })
        .then(toDbDeleteResponse);
    } else {
      this.logger.warn(
        `Event "${id}" could not be deleted because the user is not a partner-admin or an admin`,
      );
      throw new ForbiddenException();
    }
  }

  async getAllEventMetaData(): Promise<EventAdminMetadataModel[]> {
    return this.eventAdminMetadataModel.findAll();
  }

  async upsertEventMetadata(
    request: RequestWithUserInfo,
    eventId: string,
    updatedState: UpsertEventAdminMetadataRequest,
  ): Promise<EventAdminMetadataModel> {
    // Validate that the event exists
    const event = await this.findOneWithRelated({ where: { id: eventId } });
    if (isNullOrUndefined(event)) {
      throw new NotFoundException('Could not find event: ' + eventId);
    }

    // Validate ownership: user must be infiniteAdmin or partner admin that owns the event
    if (!isOwner(event, request)) {
      throw new ForbiddenException(
        'You do not have access to update metadata for this event',
      );
    }

    return this.eventAdminMetadataModel
      .upsert(
        { is_problem: updatedState.isProblem, event_id: eventId },
        { returning: true },
      )
      .then((resp) => {
        return resp[0];
      });
  }

  private async fillInServerSideGeneratedAttributes(
    submittedEvent: CreateEventRequest,
  ): Promise<CreateEventRequest> {
    const id = uuidv4();
    const slug = getSlug(submittedEvent.title);

    const eventWithSlugAndId = {
      ...submittedEvent,
      id,
      slug,
    };

    return this.fillBitlyLink(eventWithSlugAndId);
  }

  private async fillBitlyLink(
    submittedEvent: CreateEventRequest,
  ): Promise<CreateEventRequest> {
    if (this.bitlyService.isBitlyTokenSet()) {
      const id = submittedEvent.id;

      const bitlyLink = await this.bitlyService.createLink(
        `${INFINITE_WEB_PORTAL_BASE_URL}/events/${id}`,
      );

      return {
        ...submittedEvent,
        bitly_link: bitlyLink,
      };
    } else {
      this.logger.warn(
        `bitly token not set, no bitly url will be generated, please set BITLY_TOKEN for production`,
      );

      return submittedEvent;
    }
  }

  private async buildVenuePartnerMap(
    venueIds: string[],
  ): Promise<Map<string, PartnerModel[]>> {
    if (venueIds.length === 0) {
      return new Map();
    }

    const mappings = await this.sequelize.query<{
      venue_id: string;
      partner_id: string;
    }>(
      `SELECT vpm.venue_id, vpm.partner_id
       FROM venues_partners_mappings vpm
       WHERE vpm.venue_id IN (:venueIds)`,
      { replacements: { venueIds }, type: QueryTypes.SELECT },
    );

    const partnerIds = [
      ...new Set(mappings.map(({ partner_id }) => partner_id)),
    ];

    const partners =
      partnerIds.length > 0
        ? await this.partnerModel.findAll({
            where: { id: { [Op.in]: partnerIds } },
          })
        : [];

    const partnerMap = new Map(partners.map((p) => [p.id, p]));

    const venueMap = new Map<string, PartnerModel[]>();
    mappings.forEach(({ venue_id, partner_id }) => {
      const partner = partnerMap.get(partner_id);
      if (!partner) return;

      if (!venueMap.has(venue_id)) {
        venueMap.set(venue_id, []);
      }
      venueMap.get(venue_id).push(partner);
    });

    return venueMap;
  }

  private async populateVenuePartners(events: EventModel[]): Promise<void> {
    const venueIds = [
      ...new Set(
        events
          .flatMap(({ venues }) => (venues ?? []).map(({ id }) => id))
          .filter(isNotNullOrUndefined),
      ),
    ];

    const venueMap = await this.buildVenuePartnerMap(venueIds);

    events.forEach((event) => {
      (event.venues ?? []).forEach((venue) => {
        venue.partners = venueMap.get(venue.id) ?? [];
      });
    });
  }

  private getTagsClauseParams(tags: string[] | string): Nullable<string> {
    const tagList = ensureEmbedQueryStringIsArray(tags);

    if (tagList.length === 0) {
      return null;
    }

    const firstTag = tagList.pop();

    if (tagList.length === 0) {
      return `{"${firstTag}"}`;
    }

    const sqlArray = tagList.reduce((result, tag) => {
      return `${result}, "${tag}" `;
    }, `{"${firstTag}"`);

    return sqlArray + '}';
  }

  private getWhereClause(
    tagClauseParams: Nullable<string>,
    category: Nullable<string>,
    owningPartnerIds: string[] | string,
    verifiedOnly: boolean,
    startDate?: Date,
    endDate?: Date,
  ): string {
    const tagClause = isNotNullOrUndefined(tagClauseParams)
      ? `:tagFilter && events.tags`
      : null;

    const categoryClause = isNotNullOrUndefined(category)
      ? `events.category = '${category}'`
      : null;

    const partnerIdsArray = ensureEmbedQueryStringIsArray(owningPartnerIds);
    const partnerIdsClause =
      partnerIdsArray.length > 0
        ? `events.owning_partner_id IN (${partnerIdsArray
            .map((id) => `'${id}'`)
            .join(', ')})`
        : null;

    const verifiedOnlyClause = verifiedOnly ? 'verified = true' : null;

    const dateRangeFilter =
      startDate && endDate
        ? 'start_time >= :startDate AND start_time < :endDate'
        : null;

    const clauses = [
      tagClause,
      categoryClause,
      partnerIdsClause,
      verifiedOnlyClause,
      dateRangeFilter,
    ].filter((clause) => isNotNullOrUndefined(clause));

    if (clauses.length === 0) {
      return '';
    } else {
      return `WHERE ${clauses.join(' AND ')}`;
    }
  }

  private async getEventCountWithFilters(
    tagClauseParams: string,
    whereClause: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const results: { count: string }[] = await this.sequelize.query(
      `
      with compressed_event as (
        SELECT
          events.*,
          min(dv.start_time) as first_start_time,
          max(dv.end_time) as last_end_time
        FROM events
        LEFT OUTER JOIN datetime_venue dv on events.id = dv.event_id
        ${whereClause}
        GROUP BY (events.id)
      )
      SELECT COUNT(compressed_event.id)
      FROM compressed_event
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          tagFilter: tagClauseParams,
          startDate,
          endDate,
        },
      },
    );

    return Number(results[0].count);
  }
}

interface FindAllPaginatedArgs {
  request: RequestWithUserInfo;
  tags: string[] | string;
  category?: string;
  owningPartnerIds?: string[] | string;
  verifiedOnly?: boolean;
  pageSize: number;
  requestedPage: number;
  startDate?: Date;
  endDate?: Date;
}
