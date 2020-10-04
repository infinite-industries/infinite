import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Venue} from "./models/venue.model";
import {v4 as uuidv4} from 'uuid';
import {CreateVenueRequest} from "./dto/create-venue-request";

@Injectable()
export class VenuesService {
    constructor(@InjectModel(Venue) private venueModel: typeof Venue) {
    }

    findAll(): Promise<Venue[]> {
        return this.venueModel.findAll();
    }

    create(newVenue: CreateVenueRequest): Promise<Venue> {
        const id = uuidv4();

        return this.venueModel.create({ ...newVenue, id });
    }
}
