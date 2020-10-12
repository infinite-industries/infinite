import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {CurrentEvent} from "./dto/current-event.model";
import {FindOptions} from "sequelize";
import {Model} from "sequelize-typescript";

@Injectable()
export class CurrentEventsService {
    constructor(@InjectModel(CurrentEvent) private currentEventModel: typeof CurrentEvent) {
    }

    findAll(findOptions?: FindOptions): Promise<CurrentEvent []> {
        findOptions = findOptions || {};
        return this.currentEventModel.findAll(findOptions);
    }
}
