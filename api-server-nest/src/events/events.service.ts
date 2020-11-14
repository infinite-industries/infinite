import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {FindOptions, UpdateOptions} from "sequelize";
import {Event} from "./models/event.model";
import DbUpdateResponse, {toDbUpdateResponse} from "../shared-types/db-update-response";
import {v4 as uuidv4} from 'uuid';
import {CreateEventRequest} from "./dto/create-event-request";
import {UpdateEventRequest} from "./dto/update-event-request";

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event) private eventModel: typeof Event) {}

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

    create(newEvent: CreateEventRequest): Promise<Event> {
        const id = uuidv4();
        return this.eventModel.create({ ...newEvent, id })
    }
}
