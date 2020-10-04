import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {FindOptions} from "sequelize";
import {Event} from "./dto/event.model";
import {DbUpdateResponse} from "../shared-types/db-update-response";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event) private eventModel: typeof Event) {}

    findAll(findOptions?: FindOptions): Promise<Event []> {
        return this.eventModel.findAll(findOptions)
    }

    update(id: string, values: Partial<Event>): Promise<DbUpdateResponse<Event>> {
        return this.eventModel.update(values, {where: {id}})
            .then((response: [number, Event []]) => {
                const numberOfAffectedEntities = response[0]
                const updatedEntities = response[1]

                return {
                    numberOfAffectedEntities,
                    updatedEntities
                }
            })
    }

    create(event: Event): Promise<Event> {
        console.log('!!! create ' + JSON.stringify(event, null, 4))
        const id = uuidv4();

        return this.eventModel.create({ ...event.get(), id })
    }
}
