import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VenueModel } from './models/venue.model';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateVenueRequest,
  UpdateVenueRequest,
} from './dto/create-update-venue-request';
import { FindOptions } from 'sequelize';
import getSlug from '../utils/get-slug';
import { GpsService } from './gps.services';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
import { isNullOrUndefined } from '../utils';

@Injectable()
export class VenuesService {
  constructor(
    @InjectModel(VenueModel) private venueModel: typeof VenueModel,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly gpsService: GpsService,
  ) {}

  findById(id: string): Promise<VenueModel> {
    const options: FindOptions = {
      where: { id },
    };

    return this.venueModel.findOne(options);
  }

  findAll(): Promise<VenueModel[]> {
    return this.venueModel.findAll();
  }

  findWhereNotSoftDeleted(): Promise<VenueModel[]> {
    return this.venueModel.findAll({
      where: { is_soft_deleted: false },
    });
  }

  findWhereSoftDeleted(): Promise<VenueModel[]> {
    return this.venueModel.findAll({
      where: { is_soft_deleted: true },
    });
  }

  async create(newVenue: CreateVenueRequest): Promise<VenueModel> {
    const id = uuidv4();
    const slug = getSlug(newVenue.name);

    newVenue = await this.fillInGPSCoordinatesIfNeededWhenPossible(newVenue);

    return this.venueModel.create({ ...newVenue, id, slug });
  }

  async update(
    id: string,
    updatedValues: UpdateVenueRequest,
  ): Promise<VenueModel> {
    updatedValues = await this.fillInGPSCoordinatesIfNeededWhenPossible(
      updatedValues,
    );

    const values = isNotNullOrUndefined(updatedValues.name)
      ? { ...updatedValues, slug: getSlug(updatedValues.name) }
      : { ...updatedValues };

    return this.venueModel
      .update(values, {
        where: { id },
        returning: true,
      })
      .then((resp: [number, VenueModel[]]) => {
        if (resp[0] === 0) {
          return null;
        }

        return resp[1][0];
      });
  }

  softDelete(id: string): Promise<VenueModel> {
    return this.venueModel
      .update(
        { is_soft_deleted: true },
        {
          where: { id },
          returning: true,
        },
      )
      .then((resp: [number, VenueModel[]]) => {
        return resp[1][0];
      });
  }

  reactivate(id: string): Promise<VenueModel> {
    return this.venueModel
      .update(
        { is_soft_deleted: false },
        {
          where: { id },
          returning: true,
        },
      )
      .then((resp: [number, VenueModel[]]) => {
        return resp[1][0];
      });
  }

  private async fillInGPSCoordinatesIfNeededWhenPossible<
    T extends UpdateVenueRequest | CreateVenueRequest,
  >(venue: T): Promise<T> {
    if (isNullOrUndefined(venue)) {
      return venue;
    }

    if (this.hasGPSCoordinates(venue)) {
      return Promise.resolve(venue);
    } else {
      const { street, city, state, zip } = venue;

      try {
        const coordinates = await this.gpsService.getCoordinatesFromAddress({
          street,
          city,
          state,
          zip,
        });

        if (this.isCreateRequest(venue)) {
          return new CreateVenueRequest({
            ...venue,
            gps_long: coordinates.longitude,
            gps_lat: coordinates.latitude,
          }) as T;
        } else {
          return new UpdateVenueRequest({
            ...venue,
            gps_long: coordinates.longitude,
            gps_lat: coordinates.latitude,
          }) as T;
        }
      } catch (ex) {
        // for /get-gps-from-address we will return a 500 in this case, but for venue creation and update we will just
        // log this and let the user continue
        this.logger.warn(
          `There was an exception fetching GPS coordinates, during venue creation (name: ${venue.name}, street: ${venue.street}):`,
        );
        this.logger.warn(ex);

        return venue;
      }
    }
  }

  private isCreateRequest(
    request: CreateVenueRequest | UpdateVenueRequest,
  ): request is CreateVenueRequest {
    return request instanceof CreateVenueRequest;
  }

  private isUpdateRequest(
    request: CreateVenueRequest | UpdateVenueRequest,
  ): request is UpdateVenueRequest {
    return request instanceof UpdateVenueRequest;
  }

  private hasGPSCoordinates(
    venue: CreateVenueRequest | UpdateVenueRequest,
  ): boolean {
    return (
      isNotNullOrUndefined(venue.gps_lat) &&
      isNotNullOrUndefined(venue.gps_long)
    );
  }
}
