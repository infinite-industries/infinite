import {
  DateTimeVenueFields,
  DatetimeVenueModel,
} from '../../src/events/models/datetime-venue.model';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');

export function generateDateTimeVenueFields(
  overrides: DateTimeVenueFields = {},
): DateTimeVenueFields {
  return {
    id: uuidv4(),
    event_id: uuidv4(),
    venue_id: uuidv4(),
    start_time: faker.datatype.datetime(),
    end_time: faker.datatype.datetime(),
    optional_title: faker.lorem.words(3),
    ...overrides,
  };
}

export function generateDatetimeVenueFaker(
  overrides: DateTimeVenueFields = {},
): DatetimeVenueModel {
  return new DatetimeVenueModel(generateDateTimeVenueFields(overrides));
}
