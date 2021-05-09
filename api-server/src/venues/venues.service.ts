import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {VenueModel} from "./models/venue.model";
import {v4 as uuidv4} from 'uuid';
import {CreateVenueRequest, UpdateVenueRequest} from "./dto/create-update-venue-request";
import {FindOptions} from "sequelize";
import getSlug from "../utils/get-slug";

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

    findWhereNotSoftDeleted(): Promise<VenueModel[]> {
        return this.venueModel.findAll({
            where: { is_soft_deleted: false }
        })
    }

    create(newVenue: CreateVenueRequest): Promise<VenueModel> {
        const id = uuidv4();
        const slug = getSlug(newVenue.name)

        return this.venueModel.create({ ...newVenue, id, slug });
    }

    update(id: string, updatedValues: UpdateVenueRequest): Promise<VenueModel> {
        let values;
        if (updatedValues.name) {
            const slug = getSlug(updatedValues.name);

            values = {...updatedValues, slug};
        } else {
            values = {...updatedValues};
        }

        return this.venueModel.update(values, { where: { id }})
            .then((resp: [number, VenueModel[]]) => {
                return resp[1][0];
            });
    }

    softDelete(id: string): Promise<VenueModel> {
        return this.venueModel.update({is_soft_deleted: true }, {
           where: { id }
        }).then((resp: [number, VenueModel[]]) => {
            return resp[1][0];
        })
    }
}
