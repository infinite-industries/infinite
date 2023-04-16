import {Inject, Injectable, LoggerService} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {FindOptions, QueryTypes, Sequelize, Transaction, UpdateOptions} from 'sequelize';
import {EventModel} from "./models/event.model";
import DbUpdateResponse, {toDbUpdateResponse} from "../shared-types/db-update-response";
import DbDeleteResponse, {toDbDeleteResponse} from "../shared-types/db-delete-response";
import {v4 as uuidv4} from 'uuid';
import {CreateEventRequest} from "./dto/create-event-request";
import {UpdateEventRequest} from "./dto/update-event-request";
import BitlyService from "./bitly.service";
import getSlug from "../utils/get-slug";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {DatetimeVenueModel} from './models/datetime-venue.model';
import {isNullOrUndefined} from '../utils';
import {StartEndTimePairs} from '../shared-types/start-end-time-pairs';
import {VenueModel} from "../venues/models/venue.model";
import {INFINITE_WEB_PORTAL_BASE_URL} from "../constants";
import {EventAdminMetadataModel} from "./models/event-admin-metadata.model";
import UpsertEventAdminMetadataRequest from "./dto/upsert-event-admin-metadata-request";
import isNotNullOrUndefined from "../utils/is-not-null-or-undefined";
import {ensureEmbedQueryStringIsArray} from "../utils/get-options-for-events-service-from-embeds-query-param";

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(EventModel) private eventModel: typeof EventModel,
        @InjectModel(EventAdminMetadataModel) private eventAdminMetadataModel: typeof EventAdminMetadataModel,
        @InjectModel(DatetimeVenueModel) private dateTimeVenueModel: typeof DatetimeVenueModel,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
        private readonly bitlyService: BitlyService,
        private sequelize: Sequelize
    ) {}

    async findById(id: string, findOptions?: FindOptions): Promise<EventModel> {
        let options = {
            where: { id },
            include: [DatetimeVenueModel, VenueModel] // TODO -- This should be determined by embed flags
        }

        if (findOptions) {
           options = { ...findOptions, ...options }
        }

        return this.eventModel.findOne(options)
            .then(result => {
                return result;
            })
    }

    findAll(findOptions?: FindOptions): Promise<EventModel []> {
        return this.eventModel.findAll(findOptions)
    }

    // findAllPaginated(
    //     { findOptions = {}, pageSize, requestedPage }: {findOptions?: FindOptions, pageSize: number, requestedPage: number }
    // ): Promise<{ count: number, rows: EventModel [] }> {
    //     return this.eventModel.findAndCountAll({
    //         ...findOptions,
    //         limit: pageSize,
    //         offset: requestedPage * pageSize,
    //         include: [ DatetimeVenueModel ],
    //         order: [ [ {model: DatetimeVenueModel, as: 'date_times' }, 'start_time' ] ],
    //     })
    // }

    async findAllPaginated(
        { tags = [], pageSize, requestedPage }: {tags: string[] | string, pageSize: number, requestedPage: number }
    ): Promise<{ count: number, rows: EventModel [] }> {
        const tagClause = this.getTagsClause(tags);

        const paginatedRows: EventModel [] = await this.sequelize.query(`
            with compressed_event as (
                SELECT events.*, min(dv.start_time) as first_start_time
                FROM events
                JOIN datetime_venue dv on events.id = dv.event_id
                GROUP BY (events.id)
                ORDER BY first_start_time DESC
                OFFSET ${ (requestedPage - 1) * pageSize }
                LIMIT ${pageSize}
            )
            SELECT
                   events.*,
                   date_times.id AS "date_times.id",
                   date_times.event_id AS "date_times.event_id",
                   date_times.venue_id AS "date_times.venue_id",
                   date_times.start_time AS "date_times.start_time",
                   date_times.end_time AS "date_times.end_time",
                   date_times.optional_title AS "date_times.optional_title",
                   date_times.timezone AS "date_times.timezone",
                   date_times."createdAt"      AS "date_times.createdAt",
                   date_times."updatedAt" AS "date_times.updatedAt",
                   venues.id AS "venue.id",
                   venues.name AS "venue.name",
                   venues.slug AS "venue.slug",
                   venues.address AS "venue.address",
                   venues.g_map_link AS "venue.g_map_link",
                   venues."createdAt" AS "venue.createdAt",
                   venues."updatedAt" AS "venue.updatedAt",
                   venues.is_soft_deleted AS "venue.is_soft_deleted",
                   venues.gps_lat AS "venue.gps_lat",
                   venues.gps_long AS "venue.gps_long",
                   venues.gps_alt AS "venue.gps_alt",
                   venues.street AS "venue.street",
                   venues.city AS "venue.city",
                   venues.state AS "venue.state",
                   venues.zip AS "venue.zip",
                   venues.neighborhood AS "venue.neighborhood"
            FROM compressed_event
            JOIN events ON events.id = compressed_event.id
            JOIN datetime_venue date_times on events.id = date_times.event_id
            JOIN venues ON venues.id = date_times.venue_id;
        `, { type: QueryTypes.SELECT, model: EventModel, mapToModel: true, nest: true })


        const totalCount: number = await EventModel.count()

        return { count: totalCount, rows: paginatedRows }
    }

    async update(id: string, values: Partial<UpdateEventRequest>): Promise<DbUpdateResponse<EventModel>> {
        return this.sequelize.transaction(async (transaction) => {
            const transactionHost = { transaction };
            const updateQueryOptions: UpdateOptions = {
                where: {id},
                returning: true,
                transaction
            }

            const updatedEvent = await this.eventModel.update(values, updateQueryOptions)

            await this.updateDatetimeVenueEntries(
                id,
                values.venue_id,
                values.date_times,
                transactionHost);

            return updatedEvent;

        }).then(toDbUpdateResponse)

    }

    private async updateDatetimeVenueEntries(
        eventId: string, venueId: string, dateTimes: StartEndTimePairs [], transactionHost: { transaction: Transaction }
    ) {
        if (isNullOrUndefined(dateTimes))
            return;

            await this.dateTimeVenueModel.destroy(
            {
                where: {event_id: eventId},
                transaction: transactionHost.transaction
            })

            return this.createDatetimeVenueEntries(
                eventId,
                venueId,
                dateTimes,
                transactionHost)
    }

    async create(newEvent: CreateEventRequest): Promise<EventModel> {
        return this.sequelize.transaction(async (transaction) => {
            const transactionHost = { transaction };

            const eventWithServerSideGeneratedAttributes = await this.fillInServerSideGeneratedAttributes(newEvent)

            const event = await this.eventModel.create(eventWithServerSideGeneratedAttributes, transactionHost)

            await this.createDatetimeVenueEntries(
                event.id,
                event.venue_id,
                eventWithServerSideGeneratedAttributes.date_times,
                transactionHost);

            return event;
        });
    }

    private async createDatetimeVenueEntries(
        eventId: string, venueId: string, dateTimes: StartEndTimePairs [], transactionHost: { transaction: Transaction }
    ) {
        if (isNullOrUndefined(dateTimes))
            return;

        const requests = dateTimes.map(( async ({ start_time, end_time, timezone, optional_title}) => {
            const id = uuidv4()

            return this.dateTimeVenueModel.create({
                id,
                event_id: eventId,
                venue_id: venueId,
                start_time,
                end_time,
                timezone,
                optional_title
            }, transactionHost)
        }))

        return Promise.all(requests)
    }

    async delete(id: string): Promise<DbDeleteResponse> {
        return this.eventModel.destroy({ where: { id }})
            .then(toDbDeleteResponse)
    }

    async getEventMetadata(id: string): Promise<EventAdminMetadataModel> {
        return this.eventAdminMetadataModel.findOne({ where: { id }})
    }

    async getAllEventMetaData(): Promise<EventAdminMetadataModel []> {
        return this.eventAdminMetadataModel.findAll()
    }

    async upsertEventMetadata(
        eventId: string,
        updatedState: UpsertEventAdminMetadataRequest
    ): Promise<EventAdminMetadataModel> {
        return this.eventAdminMetadataModel
            .upsert({ is_problem: updatedState.isProblem, event_id: eventId }, { returning: true})
            .then(resp => {
                return resp[0][0]
            })
    }

    private async fillInServerSideGeneratedAttributes(submittedEvent: CreateEventRequest): Promise<CreateEventRequest> {
        const id = uuidv4()
        const slug = getSlug(submittedEvent.title)

        const eventWithSlugAndId = {
            ...submittedEvent,
            id,
            slug
        }

        return this.fillBitlyLink(eventWithSlugAndId)
    }

    private async fillBitlyLink(submittedEvent: CreateEventRequest): Promise<CreateEventRequest> {
        if (this.bitlyService.isBitlyTokenSet()) {
            const id = submittedEvent.id

            const bitlyLink = await this.bitlyService.createLink(`${INFINITE_WEB_PORTAL_BASE_URL}/events/${id}`)

            return {
                ...submittedEvent,
                bitly_link: bitlyLink
            }
        } else {
            this.logger.warn(
                `bitly token not set, no bitly url will be generated, please set BITLY_TOKEN for production`
            )

            return submittedEvent
        }
    }

    private getTagsClause(tags: string [] | string): string {
        const tagList = ensureEmbedQueryStringIsArray(tags)

        if (tags.length === 0) {
            return ''
        }

        const lastTag = tagList.pop()

        if (tags.length === 0) {
            return `'{"${lastTag}"}' && event.tags`
        }

        const sqlArray = tagList.reduce((result, tag) => {
            return `"${tag}", `
        }, "'{")

        return sqlArray + `, "${lastTag}"}' && event.tags`;
    }
}
