import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {VenueModel} from "./models/venue.model";
import {v4 as uuidv4} from 'uuid';
import {CreateVenueRequest} from "./dto/create-venue-request";

@Injectable()
export class VenuesService {
    constructor(@InjectModel(VenueModel) private venueModel: typeof VenueModel) {
    }

    findAll(): Promise<VenueModel[]> {
        return this.venueModel.findAll();
    }

    create(newVenue: CreateVenueRequest): Promise<VenueModel> {
        const id = uuidv4();

        return this.venueModel.create({ ...newVenue, id });
    }
}
