import {Inject, Injectable, LoggerService} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import { FindOptions, Sequelize, Transaction, UpdateOptions } from 'sequelize';
import {Event} from "./models/event.model";
import DbUpdateResponse, {toDbUpdateResponse} from "../shared-types/db-update-response";
import DbDeleteResponse, {toDbDeleteResponse} from "../shared-types/db-delete-response";
import {v4 as uuidv4} from 'uuid';
import {CreateEventRequest} from "./dto/create-event-request";
import {UpdateEventRequest} from "./dto/update-event-request";
import BitlyService from "./bitly.service";
import getSlug from "../utils/get-slug";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { DatetimeVenueModel } from './models/datetime-venue.model';
import { isNullOrUndefined } from '../utils';
import { StartEndTimePairs } from '../shared-types/start-end-time-pairs';

const INFINITE_WEB_PORTAL_BASE_URL = process.env.APP_URL || 'https://infinite.industries'

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event) private eventModel: typeof Event,
        @InjectModel(DatetimeVenueModel) private dateTimeVenueModel: typeof DatetimeVenueModel,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
        private readonly bitlyService: BitlyService,
        private sequelize: Sequelize
    ) {}

    findById(id: string, findOptions?: FindOptions): Promise<Event> {
        let options = { where: { id }}

        if (findOptions) {
           options = { ...findOptions, ...options }
        }

        return this.eventModel.findOne(options)
    }

    findAll(findOptions?: FindOptions): Promise<Event []> {
        return this.eventModel.findAll(findOptions)
    }

    update(id: string, values: Partial<UpdateEventRequest>): Promise<DbUpdateResponse<Event>> {
        const updateQueryOptions: UpdateOptions = {
            where: {id},
            returning: true
        }

        return this.eventModel.update(values, updateQueryOptions)
            .then(toDbUpdateResponse)
    }

    async create(newEvent: CreateEventRequest): Promise<Event> {
        return this.sequelize.transaction(async (transaction) => {
            const transactionHost = { transaction };

            const eventWithServerSideGeneratedAttributes = await this.fillInServerSideGeneratedAttributes(newEvent)

            const event = await this.eventModel.create(eventWithServerSideGeneratedAttributes, transactionHost)

            console.log('!!! event: ' + event.id);

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

        const requests = dateTimes.map(( async ({ start_time, end_time, optional_title}) => {
            const id = uuidv4()

            return this.dateTimeVenueModel.create({
                id,
                event_id: eventId,
                venue_id: venueId,
                start_time,
                end_time,
                optional_title
            }, transactionHost)
        }))

        return Promise.all(requests)
    }

    async delete(id: string): Promise<DbDeleteResponse> {
        return this.eventModel.destroy({ where: { id }})
            .then(toDbDeleteResponse)
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
}
