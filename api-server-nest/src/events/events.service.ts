import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {FindOptions, UpdateOptions} from "sequelize";
import {Event} from "./models/event.model";
import DbUpdateResponse, {toDbUpdateResponse} from "../shared-types/db-update-response";
import {v4 as uuidv4} from 'uuid';
import {CreateEventRequest} from "./dto/create-event-request";
import {UpdateEventRequest} from "./dto/update-event-request";
import BitlyService from "./bitly.service";

const INFINITE_WEB_PORTAL_BASE_URL = process.env.APP_URL || 'https://infinite.industries'

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event) private eventModel: typeof Event,
        private readonly bitlyService: BitlyService
    ) {}

    findById(id: string): Promise<Event> {
        return this.eventModel.findOne({ where: { id }})
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
        const eventWithServerSideGeneratedAttributes = await this.fillInServerSideGeneratedAttributes(newEvent)

        return this.eventModel.create(eventWithServerSideGeneratedAttributes)
    }

    private async fillInServerSideGeneratedAttributes(submittedEvent: CreateEventRequest): Promise<CreateEventRequest> {
        const id = uuidv4()
        const slug = this.getSlug(submittedEvent.title)

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
            console
                .warn( `bitly token not set, no bitly url will be generated, please set BITLY_TOKEN for production`)

            return submittedEvent
        }
    }

    private getSlug(title: string): string {
        if (!title) {
            return 'missing-title'
        }

        return title.toLowerCase().replace(/ /g,'-')
    }
}
