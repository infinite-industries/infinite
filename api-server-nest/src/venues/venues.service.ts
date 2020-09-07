import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Venue} from "./dto/venue.model";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class VenuesService {
    constructor(@InjectModel(Venue) private venueModel: typeof Venue) {
    }

    findAll(): Promise<Venue[]> {
        return this.venueModel.findAll();
    }

    create(newVenue: Venue): Promise<Venue> {
        newVenue.id = uuidv4();
        return this.venueModel.create(newVenue);
    }
}
