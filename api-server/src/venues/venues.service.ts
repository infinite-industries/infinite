import {
  ConflictException,
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VenueModel } from './models/venue.model';
import { PartnerModel } from '../users/models/partner.model';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateVenueRequest,
  UpdateVenueRequest,
} from './dto/create-update-venue-request';
import { AssociateVenuePartnerRequest } from './dto/associate-venue-partner-request';
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
    @InjectModel(PartnerModel) private partnerModel: typeof PartnerModel,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly gpsService: GpsService,
  ) {}

  private readonly partnersInclude = {
    model: PartnerModel,
    as: 'partners' as const,
    through: { attributes: [] },
  };

  findById(id: string): Promise<VenueModel> {
    return this.venueModel.findOne({
      where: { id },
      include: [this.partnersInclude],
    });
  }

  findAll(): Promise<VenueModel[]> {
    return this.venueModel.findAll({
      include: [this.partnersInclude],
    });
  }

  findWhereNotSoftDeleted(): Promise<VenueModel[]> {
    return this.venueModel.findAll({
      where: { is_soft_deleted: false },
      include: [this.partnersInclude],
    });
  }

  findWhereSoftDeleted(): Promise<VenueModel[]> {
    return this.venueModel.findAll({
      where: { is_soft_deleted: true },
      include: [this.partnersInclude],
    });
  }

  async create(newVenue: CreateVenueRequest): Promise<VenueModel> {
    const id = uuidv4();
    const slug = getSlug(newVenue.name);

    newVenue = await this.fillInGPSCoordinatesIfNeededWhenPossible(newVenue);

    await this.venueModel.create({ ...newVenue, id, slug });

    return this.findById(id);
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

    const [affectedCount] = await this.venueModel.update(values, {
      where: { id },
    });

    if (affectedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<VenueModel> {
    await this.venueModel.update(
      { is_soft_deleted: true },
      { where: { id } },
    );

    return this.findById(id);
  }

  async reactivate(id: string): Promise<VenueModel> {
    await this.venueModel.update(
      { is_soft_deleted: false },
      { where: { id } },
    );

    return this.findById(id);
  }

  async getPartnersForVenue(venueId: string): Promise<PartnerModel[]> {
    const venue = await this.venueModel.findByPk(venueId, {
      include: [
        {
          model: PartnerModel,
          as: 'partners',
          through: { attributes: [] },
        },
      ],
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${venueId} not found`);
    }

    return venue.partners;
  }

  async associateVenueWithPartner(
    request: AssociateVenuePartnerRequest,
  ): Promise<void> {
    const { venue_id, partner_id } = request;

    const venue = await this.venueModel.findByPk(venue_id, {
      include: [
        {
          model: PartnerModel,
          as: 'partners',
          through: { attributes: [] },
        },
      ],
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${venue_id} not found`);
    }

    const partner = await this.partnerModel.findByPk(partner_id);

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${partner_id} not found`);
    }

    const existingAssociation = venue.partners.find((p) => p.id === partner_id);
    if (existingAssociation) {
      throw new ConflictException(
        `Venue ${venue_id} is already associated with partner ${partner_id}`,
      );
    }

    await (venue as any).addPartner(partner);
  }

  async disassociateVenueFromPartner(
    request: AssociateVenuePartnerRequest,
  ): Promise<void> {
    const { venue_id, partner_id } = request;

    const venue = await this.venueModel.findByPk(venue_id, {
      include: [
        {
          model: PartnerModel,
          as: 'partners',
          through: { attributes: [] },
        },
      ],
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${venue_id} not found`);
    }

    const partner = await this.partnerModel.findByPk(partner_id);

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${partner_id} not found`);
    }

    const existingAssociation = venue.partners.find((p) => p.id === partner_id);
    if (!existingAssociation) {
      throw new NotFoundException(
        `Venue ${venue_id} is not associated with partner ${partner_id}`,
      );
    }

    await (venue as any).removePartner(partner);
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
