import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {VenueModel} from "./models/venue.model";
import {v4 as uuidv4} from 'uuid';
import {CreateVenueRequest} from "./dto/create-venue-request";
import {FindOptions} from "sequelize";

@Injectable()
export class VenuesService {
    constructor(@InjectModel(VenueModel) private venueModel: typeof VenueModel) {
    }

    findById(id: string): Promise<VenueModel> {
        const options: FindOptions = {
            where: { id }
        }

        return this.venueModel.findOne(options)
    }

    findAll(): Promise<VenueModel[]> {
        return this.venueModel.findAll();
    }

    create(newVenue: CreateVenueRequest): Promise<VenueModel> {
        const id = uuidv4();

        return this.venueModel.create({ ...newVenue, id });
    }
}
