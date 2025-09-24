import { DatetimeVenueModel } from '../../src/events/models/datetime-venue.model';
import { EventModel } from '../../src/events/models/event.model';
import { VenueModel } from '../../src/venues/models/venue.model';
import { PartnerModel } from '../../src/users/models/partner.model';

type BringDownDatabaseEntitiesProps = {
  datetimeVenueModel: typeof DatetimeVenueModel;
  eventModel: typeof EventModel;
  venueModel: typeof VenueModel;
  partnerModel?: typeof PartnerModel;
};

export default async function clearDatabaseEntries({
  datetimeVenueModel,
  eventModel,
  venueModel,
  partnerModel,
}: BringDownDatabaseEntitiesProps) {
  await datetimeVenueModel.destroy({ where: {} });
  await eventModel.destroy({ where: {} });
  await venueModel.destroy({ where: {} });
  if (partnerModel) {
    await partnerModel.destroy({ where: {} });
  }
}
