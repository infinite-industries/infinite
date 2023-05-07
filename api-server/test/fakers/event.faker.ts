import { v4 as uuidv4 } from 'uuid';
import { EventModel } from '../../src/events/models/event.model';
import { DatetimeVenueModel } from "../../src/events/models/datetime-venue.model";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');

function generateEvent(
  eventModelConstructor: typeof EventModel,
  venue_id: string,
  verified: boolean,
  startEndTimeValues: Partial<DatetimeVenueModel>[] = [],
): EventModel {
  const dateTimes: DatetimeVenueModel[] = startEndTimeValues.map(
    (values) => new DatetimeVenueModel(values),
  );

  return new eventModelConstructor({
    id: uuidv4(),
    venue_id,
    verified,
    title: faker.company.companyName(),
    slug: faker.lorem.slug(),
    multi_day: false,
    date_times: dateTimes,
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
  });
}

export default generateEvent;
