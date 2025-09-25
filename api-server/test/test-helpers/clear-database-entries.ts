import { DatetimeVenueModel } from '../../src/events/models/datetime-venue.model';
import { EventModel } from '../../src/events/models/event.model';
import { VenueModel } from '../../src/venues/models/venue.model';
import { PartnerModel } from '../../src/users/models/partner.model';
import { UserModel } from '../../src/users/users.modules';
import isNotNullOrUndefined from '../../src/utils/is-not-null-or-undefined';

type BringDownDatabaseEntitiesProps = {
  datetimeVenueModel: typeof DatetimeVenueModel;
  eventModel: typeof EventModel;
  venueModel: typeof VenueModel;
  partnerModel?: typeof PartnerModel;
  userModel?: typeof UserModel;
};

export default async function clearDatabaseEntries({
  datetimeVenueModel,
  eventModel,
  venueModel,
  partnerModel,
  userModel,
}: BringDownDatabaseEntitiesProps) {
  await datetimeVenueModel.destroy({ where: {} });
  await eventModel.destroy({ where: {} });
  await venueModel.destroy({ where: {} });

  if (isNotNullOrUndefined(userModel)) {
    await userModel.destroy({ where: {} });
  }

  if (isNotNullOrUndefined(partnerModel)) {
    await partnerModel.destroy({ where: {} });
  }
}
