import request from 'supertest';
import { PORT } from '../src/constants';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import {
  EventModel,
  EventModelConstructorProps,
} from '../src/events/models/event.model';
import { VenueModel } from '../src/venues/models/venue.model';
import { DatetimeVenueModel } from '../src/events/models/datetime-venue.model';
import { TestingModule } from '@nestjs/testing';
import { afterAllStackShutdown } from './test-helpers/after-all-stack-shutdown';
import {
  createListOfFutureEventsInChronologicalOrder as _createListOfFutureEventsInChronologicalOrder,
  createRandomEventWithDateTime,
  createRandomEventWithVenue,
} from './fakers/event.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import EventDTO from '../src/events/dto/eventDTO';
import { Nullable } from '../src/utils/NullableOrUndefinable';
import faker from 'faker';
import { assertEventsEqual } from './test-helpers/assert-events';
import bringUpStackAndEstablishDbEntities from './test-helpers/bring-up-stack-and-establish-db-entities';
import clearDatabaseEntries from './test-helpers/clear-database-entries';
import { v4 as uuidv4 } from 'uuid';
import generateVenue from './fakers/venue.faker';

describe('Events API', () => {
  const server = request('http://localhost:' + PORT);

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let eventModel: typeof EventModel;
  let venueModel: typeof VenueModel;
  let datetimeVenueModel: typeof DatetimeVenueModel;
  let testingModule: TestingModule;

  let dbHostPort: number;

  beforeAll(async () => {
    console.info('preparing Events API test suite');

    ({
      appUnderTest,
      dbContainer,
      eventModel,
      venueModel,
      datetimeVenueModel,
      testingModule,
      dbHostPort,
    } = await bringUpStackAndEstablishDbEntities());

    console.log(
      `Events API test suite ready, db listing on port ${dbHostPort}`,
    );

    return Promise.resolve();
  }, 30000);

  afterEach(async () => {
    return await clearDatabaseEntries({
      datetimeVenueModel,
      eventModel,
      venueModel,
    });
  });

  afterAll(
    async () => afterAllStackShutdown(appUnderTest, dbContainer, testingModule),
    30000,
  );

  it('/verified should be able to return the first page using defaults', async () => {
    const givenTotalNumEvents = 40;
    const expectedDefaultPageSize = 20;

    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: true },
    );

    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);
        expect(totalPages).toEqual(2);
        expect(nextPage).toEqual(2);
        expect(page).toEqual(1);
        expect(pageSize).toEqual(expectedDefaultPageSize);
        expect(events.length).toEqual(expectedDefaultPageSize);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEvents[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  it('/verified should be able to return the second page using default page size', async () => {
    const givenTotalNumEvents = 40;
    const expectedDefaultPageSize = 20;

    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: true },
    );

    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=2`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);
        expect(totalPages).toEqual(2);
        expect(nextPage).toBeUndefined();
        expect(page).toEqual(2);
        expect(pageSize).toEqual(expectedDefaultPageSize);
        expect(events.length).toEqual(20);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEvents[i + 20];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  // this covers a specific bug we ran into https://github.com/infinite-industries/infinite/issues/469
  it('/verified should maintain sort from oldest to newest after rejoining on events', async () => {
    const givenTotalNumEvents = 2;

    await givenSpecialCaseEvents();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?page=1&pageSize=${givenTotalNumEvents}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);
        expect(totalPages).toEqual(1);
        expect(nextPage).toBeUndefined();
        expect(page).toEqual(1);
        expect(pageSize).toEqual(2);
        expect(events.length).toEqual(2);

        assertOrderedByFirstStartTimeDescending(events);
      });
  });

  it('/verified exclude unverified events', async () => {
    const givenTotalNumEvents = 40;
    const expectedPageSize = 40;

    const [allVerifiedEvents] =
      await createListOfFutureEventsInChronologicalOrder(20, {
        verified: true,
      });

    await createListOfFutureEventsInChronologicalOrder(20, { verified: false });

    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?page=1&pageSize=${givenTotalNumEvents}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);
        expect(totalPages).toEqual(1);
        expect(nextPage).toBeUndefined();
        expect(page).toEqual(1);
        expect(pageSize).toEqual(expectedPageSize);
        expect(events.length).toEqual(20);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allVerifiedEvents[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  it('should include events such as online resources that have no date time entries', async () => {
    const numEventsWithDateTimes = 3;

    const [someVerifiedEventsWithDateTimes] =
      await createListOfFutureEventsInChronologicalOrder(
        numEventsWithDateTimes,
        {
          verified: true,
        },
      );

    const [eventWithoutDateTime1] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
      { verified: true },
    );
    const [eventWithoutDateTime2] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
      { verified: true },
    );

    // null should sort to the front on descending sort
    const allVerifiedEvents = [
      eventWithoutDateTime2, // the most recently created online resource will show first since created_at is secondary sort
      eventWithoutDateTime1,
      ...someVerifiedEventsWithDateTimes,
    ];

    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=1`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);
        expect(totalPages).toEqual(1);
        expect(nextPage).toBeUndefined();
        expect(page).toEqual(1);
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(allVerifiedEvents.length);

        for (let i = 0; i < numEventsWithDateTimes; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allVerifiedEvents[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }

        // first 2 entries should have no date_times
        expect(events[0].date_times).toEqual([]);
        expect(events[1].date_times).toEqual([]);
      });
  });

  it('should filter by single tag', async () => {
    const numEventsWithTag1 = 30;
    const numEventsWithTag2 = 45;

    await createListOfFutureEventsInChronologicalOrder(numEventsWithTag1, {
      verified: true,
      tags: ['tag1'],
    });

    const [eventsWithTag2] = await createListOfFutureEventsInChronologicalOrder(
      numEventsWithTag2,
      { verified: true, tags: ['tag2'] },
    );

    // check first page
    await server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=1&tags=tag2`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);

        // should reflect the fact we only include tag2
        expect(totalPages).toEqual(3);

        expect(nextPage).toEqual(2);
        expect(page).toEqual(1);
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(20);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = eventsWithTag2[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });

    // check second page
    await server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=2&tags=tag2`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);

        // should reflect the fact we only include tag2
        expect(totalPages).toEqual(3);

        expect(nextPage).toEqual(3);
        expect(page).toEqual(2);
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(20);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = eventsWithTag2[i + 20];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });

    // check third page
    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=3&tags=tag2`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);

        // should reflect the fact we only include tag2
        expect(totalPages).toEqual(3);

        expect(nextPage).toBeUndefined();
        expect(page).toEqual(3);
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(5);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = eventsWithTag2[i + 40];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  it('should filter by multiple tag', async () => {
    const numEventsWithTag1 = 12;
    const numEventsWithTag2 = 10;
    const numEventsWithTag3 = 13;

    await createListOfFutureEventsInChronologicalOrder(numEventsWithTag1, {
      verified: true,
      tags: ['tag1'],
    });

    const [eventsWithTag2, baseTime] =
      await createListOfFutureEventsInChronologicalOrder(numEventsWithTag2, {
        verified: true,
        tags: ['tag2'],
      });

    const [eventsWithTag3] = await createListOfFutureEventsInChronologicalOrder(
      numEventsWithTag3,
      { verified: true, tags: ['tag3'] },
      baseTime,
    );

    // unverified events that have the right tag should not show in results (ensure we are applying both tag and verified filters)
    await createListOfFutureEventsInChronologicalOrder(
      faker.datatype.number({ min: 1, max: 10 }),
      { verified: false, tags: ['tag2'] },
      baseTime,
    );
    await createListOfFutureEventsInChronologicalOrder(
      faker.datatype.number({ min: 1, max: 10 }),
      { verified: false, tags: ['tag3'] },
      baseTime,
    );

    const allEventsExpectedToBeInResults = [
      ...eventsWithTag2,
      ...eventsWithTag3,
    ];

    // check first page
    await server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=1&tags=tag2&tags=tag3`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);

        // should reflect the fact we only include tag2 and tag3
        expect(totalPages).toEqual(2);

        expect(nextPage).toEqual(2);
        expect(page).toEqual(1);
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(20);

        assertOrderedByFirstStartTimeDescending(events);

        // check all tag2 events
        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEventsExpectedToBeInResults[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });

    // check second page
    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=2&tags=tag2&tags=tag3`)
      .expect(200)
      .then(async ({ body }) => {
        const {
          status,
          paginated,
          totalPages,
          nextPage,
          pageSize,
          page,
          events,
        } = body;

        expect(status).toEqual('success');
        expect(paginated).toEqual(true);

        // should reflect the fact we only include tag2 and tag3
        expect(totalPages).toEqual(2);

        expect(nextPage).toBeUndefined();
        expect(page).toEqual(2);
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(3);

        assertOrderedByFirstStartTimeDescending(events);

        // check all tag2 events
        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEventsExpectedToBeInResults[i + 20];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  it('should fail appropriately given too high of page size is requested', async () => {
    await createListOfFutureEventsInChronologicalOrder(
      faker.datatype.number({ min: 1, max: 40 }),
      {
        verified: true,
      },
    );

    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=1&pageSize=301`)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual(['pageSize must not be greater than 300']);
      });
  });

  it('/events/{eventId} should be able to fetch a single existing verified event', async () => {
    const givenExistingEvent = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
    );

    const givenExistingEventId = givenExistingEvent.id;

    return await server
      .get(`/${CURRENT_VERSION_URI}/events/${givenExistingEventId}`)
      .expect(200)
      .then(async ({ body }) => {
        const { event: eventReturned, status } = body;
        expect(status).toEqual('success');
        assertEventsEqual(eventReturned, givenExistingEvent, false);
      });
  });

  it('/events/{eventId} should return a 404 given the even requested does not exist', async () => {
    const givenNonExistingEventId = uuidv4();

    return await server
      .get(`/${CURRENT_VERSION_URI}/events/${givenNonExistingEventId}`)
      .expect(404)
      .then(async ({ body }) => {
        expect(body.statusCode).toEqual(404);
        expect(body.error).toEqual('Not Found');
        expect(body.message).toEqual(
          `Could not find event: ${givenNonExistingEventId}`,
        );
      });
  });

  // This type should be very close EventDTO but is a serialized/deserialized representation
  // Objects that don't translate direct to json will be off, Dates will be strings for example
  function assertOrderedByFirstStartTimeDescending(events: EventDTO[]) {
    let lastFirstStartTime: Nullable<string> = null;

    events.forEach((event, ndx: number) => {
      // find first start time
      const firstStartTime = event.date_times.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      )[0].start_time as unknown as string;

      expect(firstStartTime).not.toBeNull();
      expect(firstStartTime).not.toBeUndefined();

      if (ndx > 0) {
        // check that first start time is greater than the last first start time
        expect(new Date(lastFirstStartTime).getTime()).toBeGreaterThan(
          new Date(firstStartTime).getTime(),
        );
      }

      lastFirstStartTime = firstStartTime;
    });
  }

  async function createListOfFutureEventsInChronologicalOrder(
    numEvents = 30,
    overrides: EventModelConstructorProps = {},
    baseTime = new Date(),
  ): Promise<[EventModel[], Date]> {
    return _createListOfFutureEventsInChronologicalOrder(
      eventModel,
      venueModel,
      datetimeVenueModel,
      numEvents,
      overrides,
      baseTime,
    );
  }

  async function givenSpecialCaseEvents(): Promise<EventModel[]> {
    const venue1 = await generateVenue(VenueModel).save();
    const venue2 = await generateVenue(VenueModel).save();
    const venue3 = await generateVenue(VenueModel).save();

    const event1 = await EventModel.create({
      admission_fee: '750.00',
      bitly_link: 'https://walker.biz',
      brief_description: 'Et ut expedita harum nihil.',
      createdAt: new Date('2024-01-21T18:21:44.516Z'),
      description: 'Quos qui quo.',
      eventbrite_link: 'http://vivienne.name',
      fb_event_link: 'https://maiya.net',
      id: '600405bb-b9f8-49bc-b62d-f2a16ec226e2',
      image: 'http://amiya.com',
      links: [],
      organizer_contact: 'Gay66@hotmail.com',
      reviewed_by_org: 'some-org-1',
      slug: 'quibusdam-architecto-eos',
      social_image: 'https://kelsi.net',
      tags: [],
      category: 'odio',
      condition: [
        'consequatur',
        'quaerat',
        'ipsam',
        'officiis',
        'perspiciatis',
        'et',
        'illum',
        'voluptatem',
        'dolorem',
        'id',
      ],
      mode: 'voluptatem',
      ticket_link: 'https://travon.net',
      title: 'Stamm, Reilly and Schuster',
      updatedAt: new Date('2024-01-21T18:21:44.516Z'),
      venue_id: null,
      verified: true,
      website_link: 'http://novella.org',
      multi_day: true,
    });

    await DatetimeVenueModel.create({
      id: uuidv4(),
      start_time: new Date('2024-01-20T02:21:44.196Z'),
      end_time: new Date('2067-12-28T22:22:12.022Z'),
      venue_id: venue1.id,
      timezone: 'US/Eastern',
      optional_title: 'numquam ut atque',
      event_id: event1.id,
    });

    await DatetimeVenueModel.create({
      id: uuidv4(),
      start_time: new Date('2024-01-20T03:21:44.196Z'),
      end_time: new Date('2026-04-11T02:11:56.139Z'),
      venue_id: venue2.id,
      timezone: 'US/Eastern',
      optional_title: 'quis non consectetur',
      event_id: event1.id,
    });

    const event2 = await EventModel.create({
      admission_fee: '141.00',
      bitly_link: 'https://dovie.info',
      brief_description: 'Dolorem at et quia.',
      createdAt: new Date('2024-01-21T18:21:44.196Z'),
      description: 'Veritatis qui et ullam sint excepturi.',
      eventbrite_link: 'http://georgianna.info',
      fb_event_link: 'https://lacy.biz',
      id: 'd06c5b70-5c4f-42c0-8afd-4bd306ad6f38',
      image: 'http://brody.name',
      links: [],
      organizer_contact: 'Rodrigo37@hotmail.com',
      reviewed_by_org: 'somoe-other-org',
      slug: 'vero-exercitationem-velit',
      social_image: 'https://lauriane.biz',
      tags: [],
      category: 'debitis',
      condition: [
        'vero',
        'eligendi',
        'perferendis',
        'tempore',
        'et',
        'dolor',
        'ratione',
      ],
      mode: 'aliquam',
      ticket_link: 'http://aurelia.org',
      title: 'Ferry, Rolfson and Cassin',
      updatedAt: new Date('2024-01-21T18:21:44.196Z'),
      venue_id: null,
      verified: true,
      website_link: 'https://leo.name',
      multi_day: true,
    });

    await DatetimeVenueModel.create({
      id: uuidv4(),
      start_time: new Date('2024-01-21T18:21:44.196Z'),
      end_time: new Date('2046-05-05T03:19:58.569Z'),
      venue_id: venue3.id,
      timezone: 'US/Eastern',
      optional_title: 'ut enim in',
      event_id: event2.id,
    });

    return [event1, event2];
  }

  it('/verified should filter events by date range when startDate and endDate are provided', async () => {
    // Create events with different date ranges
    const [[event1]] = await createListOfFutureEventsInChronologicalOrder(1, {
      verified: true,
    });

    const [[event2]] = await createListOfFutureEventsInChronologicalOrder(1, {
      verified: true,
    });

    // Update the datetime_venue entries to have specific dates
    const event1DateTime = await DatetimeVenueModel.findOne({
      where: { event_id: event1.id },
    });
    await event1DateTime.update({
      start_time: new Date('2024-06-01T10:00:00.000Z'),
      end_time: new Date('2024-06-01T12:00:00.000Z'),
    });

    const event2DateTime = await DatetimeVenueModel.findOne({
      where: { event_id: event2.id },
    });
    await event2DateTime.update({
      start_time: new Date('2024-08-01T10:00:00.000Z'),
      end_time: new Date('2024-08-01T12:00:00.000Z'),
    });

    // Test filtering with date range that includes only event1
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?startDate=2024-05-01T00:00:00.000Z&endDate=2024-07-01T23:59:59.999Z`,
      )
      .expect(200)
      .then(async ({ body }) => {
        const { events } = body;

        expect(events.length).toEqual(1);
        expect(events[0].id).toEqual(event1.id);
      });
  });

  it('/verified should return bad request when only startDate is provided', async () => {
    // Test filtering with startDate only - should return 400 Bad Request
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?startDate=2024-07-01T00:00:00.000Z`,
      )
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain('Both startDate and endDate must be provided together');
      });
  });

  it('/verified should return bad request when only endDate is provided', async () => {
    // Test filtering with endDate only - should return 400 Bad Request
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?endDate=2024-07-01T23:59:59.999Z`,
      )
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain('Both startDate and endDate must be provided together');
      });
  });
});
