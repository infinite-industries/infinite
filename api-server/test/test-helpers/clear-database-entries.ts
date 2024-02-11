import { DatetimeVenueModel } from '../../src/events/models/datetime-venue.model';
import { EventModel } from '../../src/events/models/event.model';
import { VenueModel } from '../../src/venues/models/venue.model';

type BringDownDatabaseEntitiesProps = {
  datetimeVenueModel: typeof DatetimeVenueModel;
  eventModel: typeof EventModel;
  venueModel: typeof VenueModel;
};

export default async function clearDatabaseEntries({
  datetimeVenueModel,
  eventModel,
  venueModel,
}: BringDownDatabaseEntitiesProps) {
  await datetimeVenueModel.destroy({ where: {} });
  await eventModel.destroy({ where: {} });
  await venueModel.destroy({ where: {} });
}
