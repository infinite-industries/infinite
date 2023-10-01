import { v4 as uuidv4 } from 'uuid';
import {
  EventModel,
  EventModelConstructorProps,
} from '../../src/events/models/event.model';
import {
  DateTimeVenueFields,
  DatetimeVenueModel,
} from '../../src/events/models/datetime-venue.model';
import {
  generateDatetimeVenueFaker,
  generateDateTimeVenueFields,
} from './generateDatetimeVenue.faker';
import faker from 'faker';
import {
  VenueModel,
  VenueModelConstructorProps,
} from '../../src/venues/models/venue.model';
import generateVenue from './venue.faker';
import { generateList } from './generate-list';
import isNotNullOrUndefined from '../../src/utils/is-not-null-or-undefined';
import { Nullable } from '../../src/utils/NullableOrUndefinable';

export function generateEvent(
  eventModelConstructor: typeof EventModel,
  overrides: EventModelConstructorProps = {},
) {
  const eventProps = {
    id: uuidv4(),
    venue_id: null, // no longer used
    verified: faker.datatype.boolean(),
    title: faker.company.companyName(),
    slug: faker.lorem.slug(),
    multi_day: faker.datatype.boolean(),
    image: faker.internet.url(),
    social_image: faker.internet.url(),
    admission_fee: faker.commerce.price(),
    organizer_contact: faker.internet.email(),
    brief_description: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    links: [],
    website_link: faker.internet.url(),
    ticket_link: faker.internet.url(),
    fb_event_link: faker.internet.url(),
    eventbrite_link: faker.internet.url(),
    bitly_link: faker.internet.url(),
    tags: [],
    reviewed_by_org: faker.company.companyName(),
    category: faker.lorem.word(),
    mode: faker.lorem.word(),
    condition: generateList(() => faker.lorem.word(), 0, 10),
    ...overrides,
  };

  return new eventModelConstructor(eventProps);
}

export async function createRandomEventWithVenue(
  eventModelConstructor: typeof EventModel,
  venueModelConstructor: typeof VenueModel,
  eventOverrides: EventModelConstructorProps = {},
  venueOverrides?: VenueModelConstructorProps,
): Promise<[EventModel, VenueModel]> {
  const venue: Nullable<VenueModel> = await (isNotNullOrUndefined(
    venueOverrides,
  )
    ? generateVenue(venueModelConstructor, venueOverrides).save()
    : Promise.resolve(null));

  const event: EventModel = await generateEvent(
    eventModelConstructor,
    eventOverrides,
  ).save();

  return [event, venue];
}

export async function createRandomEventWithDateTime(
  eventModelConstructor: typeof EventModel,
  venueModelConstructor: typeof VenueModel,
  dateTimeVenueModelConstructor: typeof DatetimeVenueModel,
  eventOverrides: EventModelConstructorProps = {},
  dateTimeVenueOverrides: DateTimeVenueFields[] = generateList(
    () => generateDateTimeVenueFields(),
    1,
    3,
  ),
  venueOverrides?: VenueModelConstructorProps,
): Promise<EventModel> {
  const [event, venue] = await createRandomEventWithVenue(
    eventModelConstructor,
    venueModelConstructor,
    eventOverrides,
    venueOverrides,
  );

  for (const dtv of dateTimeVenueOverrides) {
    const venueForDateTime: VenueModel = await (isNotNullOrUndefined(venue)
      ? Promise.resolve(venue)
      : generateVenue(venueModelConstructor).save());

    const dateTimeVenueModel = new dateTimeVenueModelConstructor({
      ...dtv,
      event_id: event.id,
      venue_id: venueForDateTime.id,
    });

    await dateTimeVenueModel.save();
  }

  await event.reload({ include: DatetimeVenueModel });

  return event;
}

export async function createEvent(
  event: EventModel,
  startEndTimes: { start_time: Date; end_time: Date }[],
) {
  const eventCreated = await event.save();

  const requests = startEndTimes.map(async (startEndTimePair) => {
    const datetimeVenueEntry = generateDatetimeVenueFaker({
      event_id: event.id,
      venue_id: event.venue_id,
      start_time: startEndTimePair.start_time,
      end_time: startEndTimePair.end_time,
    });

    return datetimeVenueEntry.save();
  });

  await Promise.all(requests);

  return eventCreated;
}

export default generateEvent;
