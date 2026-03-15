import { VenueModel } from '../models/venue.model';
import { VenueDTO } from './venue-dto';
import { PartnerDTO } from '../../users/dto/partner-dto';

export function venueModelToVenueDTO(venueModel: VenueModel): VenueDTO {
  const partners = ((venueModel as any).partners ?? []).map(
    (p) =>
      new PartnerDTO({
        id: p.id,
        name: p.name,
        light_logo_url: p.light_logo_url,
        dark_logo_url: p.dark_logo_url,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }),
  );

  return new VenueDTO({
    id: venueModel.id,
    name: venueModel.name,
    slug: venueModel.slug,
    address: venueModel.address,
    g_map_link: venueModel.g_map_link,
    gps_lat: venueModel.gps_lat,
    gps_long: venueModel.gps_long,
    gps_alt: venueModel.gps_alt,
    street: venueModel.street,
    city: venueModel.city,
    state: venueModel.state,
    zip: venueModel.zip,
    neighborhood: venueModel.neighborhood,
    is_soft_deleted: venueModel.is_soft_deleted,
    createdAt: venueModel.createdAt,
    updatedAt: venueModel.updatedAt,
    partners,
  });
}
