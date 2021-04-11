import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {CurrentEvent} from "./models/current-event.model";
import sequelize, {FindOptions} from "sequelize";

const DEFAULT_FIND_OPTIONS: FindOptions = {
    order: sequelize.literal('first_day_start_time ASC')
}

@Injectable()
export class CurrentEventsService {
    constructor(@InjectModel(CurrentEvent) private currentEventModel: typeof CurrentEvent) {
    }

    findAll(findOptions?: FindOptions): Promise<CurrentEvent []> {
        findOptions = findOptions || {}
        findOptions = {
            ...DEFAULT_FIND_OPTIONS,
            ...findOptions
        }

        return this.currentEventModel.findAll(findOptions);
    }
}
