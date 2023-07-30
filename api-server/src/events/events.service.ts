import { Inject, Injectable, LoggerService } from '@nestjs/common';
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
import DbUpdateResponse, {
  toDbUpdateResponse,
} from '../shared-types/db-update-response';
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
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly bitlyService: BitlyService,
    private sequelize: Sequelize,
  ) {}

  async findById(id: string, findOptions?: FindOptions): Promise<EventModel> {
    let options = {
      where: { id },
      include: [DatetimeVenueModel, VenueModel], // TODO -- This should be determined by embed flags
    };

    if (findOptions) {
      options = { ...findOptions, ...options };
    }

    return this.eventModel.findOne(options).then((result) => {
      return result;
    });
  }

  findAll(findOptions?: FindOptions): Promise<EventModel[]> {
    return this.eventModel.findAll(findOptions);
  }

  async findAllPaginated({
    tags = [],
    verifiedOnly = true,
    pageSize,
    requestedPage,
  }: {
    tags: string[] | string;
    verifiedOnly?: boolean;
    pageSize: number;
    requestedPage: number;
  }): Promise<{ count: number; rows: EventModel[] }> {
    // TODO (DO THIS INSIDE TRANSACTION)
    const tagClauseParams = this.getTagsClauseParams(tags);
    const whereClause = this.getWhereClause(tagClauseParams, verifiedOnly);

    // Sort events by the first start_time and apply pagination
    const paginatedRows: EventModel[] = await this.sequelize.query(
      `
            with compressed_event as (
                SELECT events.*, min(dv.start_time) as first_start_time
                FROM events
                LEFT OUTER JOIN datetime_venue dv on events.id = dv.event_id
                ${whereClause}
                GROUP BY (events.id)
                ORDER BY first_start_time DESC
                OFFSET ${(requestedPage - 1) * pageSize}
                LIMIT ${pageSize}
            )
            SELECT
                   events.*
            FROM compressed_event
            JOIN events ON events.id = compressed_event.id
        `,
      {
        type: QueryTypes.SELECT,
        model: EventModel,
        replacements: {
          tagFilter: tagClauseParams,
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
      include: VenueModel,
    });

    paginatedRows.forEach((event) => {
      const dateTimesForEvent = dateTimes.filter(
        ({ event_id }) => event_id === event.id,
      );

      event.date_times = dateTimesForEvent;
    });

    const totalCount = await this.getEventCountWithFilters(
      tagClauseParams,
      whereClause,
    );

    return { count: totalCount, rows: paginatedRows };
  }

  async update(
    id: string,
    values: Partial<UpdateEventRequest>,
  ): Promise<DbUpdateResponse<EventModel>> {
    return this.sequelize
      .transaction(async (transaction) => {
        const transactionHost = { transaction };
        const updateQueryOptions: UpdateOptions = {
          where: { id },
          returning: true,
          transaction,
        };

        const updatedEvent = await this.eventModel.update(
          values as Partial<EventModel>,
          updateQueryOptions,
        );

        await this.updateDatetimeVenueEntries(
          id,
          values.venue_id,
          values.date_times,
          transactionHost,
        );

        return updatedEvent;
      })
      .then((resp) =>
        toDbUpdateResponse(resp as unknown as [number, EventModel[]]),
      );
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

  async delete(id: string): Promise<DbDeleteResponse> {
    return this.eventModel.destroy({ where: { id } }).then(toDbDeleteResponse);
  }

  async getAllEventMetaData(): Promise<EventAdminMetadataModel[]> {
    return this.eventAdminMetadataModel.findAll();
  }

  async upsertEventMetadata(
    eventId: string,
    updatedState: UpsertEventAdminMetadataRequest,
  ): Promise<EventAdminMetadataModel> {
    return this.eventAdminMetadataModel
      .upsert(
        { is_problem: updatedState.isProblem, event_id: eventId },
        { returning: true },
      )
      .then((resp) => {
        return resp[0][0];
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
    verifiedOnly: boolean,
  ): string {
    const tagClause = isNotNullOrUndefined(tagClauseParams)
      ? `:tagFilter && events.tags`
      : null;

    const verifiedOnlyClause = verifiedOnly ? 'verified = true' : null;

    const clauses = [tagClause, verifiedOnlyClause].filter((clause) =>
      isNotNullOrUndefined(clause),
    );

    if (clauses.length === 0) {
      return '';
    } else {
      return `WHERE ${clauses.join(' AND ')}`;
    }
  }

  private async getEventCountWithFilters(
    tagClauseParams: string,
    whereClause: string,
  ): Promise<number> {
    const results: { count: string }[] = await this.sequelize.query(
      `SELECT COUNT(id)
       FROM events ${whereClause}`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          tagFilter: tagClauseParams,
        },
      },
    );

    return Number(results[0].count);
  }
}
