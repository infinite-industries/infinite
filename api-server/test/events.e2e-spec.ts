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
import { PartnerModel } from '../src/users/models/partner.model';
import { TestingModule } from '@nestjs/testing';
import { afterAllStackShutdown } from './test-helpers/after-all-stack-shutdown';
import {
  createListOfFutureEventsInChronologicalOrder as _createListOfFutureEventsInChronologicalOrder,
  createRandomEventWithDateTime,
  createRandomEventWithVenue,
} from './fakers/event.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import faker from 'faker';
import { assertEventsEqual } from './test-helpers/assert-events';
import bringUpStackAndEstablishDbEntities from './test-helpers/bring-up-stack-and-establish-db-entities';
import clearDatabaseEntries from './test-helpers/clear-database-entries';
import { v4 as uuidv4 } from 'uuid';
import generateVenue from './fakers/venue.faker';
import { assertOrderedByFirstStartTimeDescending } from './test-helpers/assertOrderedByFirstStartTimeDescending';
import createJwtForRandomUser from './test-helpers/creaeteJwt';
import { UserModel } from '../src/users/models/user.model';

describe('Events API', () => {
  const server = request('http://localhost:' + PORT);

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let eventModel: typeof EventModel;
  let venueModel: typeof VenueModel;
  let datetimeVenueModel: typeof DatetimeVenueModel;
  let partnerModel: typeof PartnerModel;
  let userModel: typeof UserModel;
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
      partnerModel,
      userModel,
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
      partnerModel,
      userModel,
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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

          assertEventsEqual(paginatedEventReturned, expectedEvent, false);
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
      organizer_contact: 'Guy66@hotmail.com',
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
    //  === event1, event2, event3, event4, and event5 in range -- should be included ===
    const event1 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-06-15T10:00:00.000Z'),
          end_time: new Date('2024-06-15T14:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 1',
        },
      ],
    );

    // event2: Starts before range, ends within range (should be included)
    const event2 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-06-01T00:00:00.000'),
          end_time: new Date('2024-06-15T16:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 2',
        },
      ],
    );

    // event3: Starts within range, ends in range (should be included)
    const event3 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-06-25T18:00:00.000Z'),
          end_time: new Date('2024-06-29T22:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 3',
        },
      ],
    );

    // last end date is still in range, included
    const event4 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-06-17T18:00:00.000Z'),
          end_time: new Date('2024-06-17T22:00:00.000Z'),
          timezone: 'UTC',
        },
        {
          id: uuidv4(),
          start_time: new Date('2024-06-29T10:00:00.000Z'),
          end_time: new Date('2024-06-29T12:00:00.000Z'),
          timezone: 'UTC',
        },
      ],
    );

    const event5 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        // outside range, lower end
        {
          id: uuidv4(),
          start_time: new Date('2024-05-29T00:00:00.000Z'),
          end_time: new Date('2024-05-29T11:00:00.000Z'),
          timezone: 'UTC',
        },
        // outside range, upper end
        {
          id: uuidv4(),
          start_time: new Date('2024-07-01T00:00:00.000Z'),
          end_time: new Date('2024-07-01T10:00:00.000Z'),
          timezone: 'UTC',
        },
        // inside range
        {
          id: uuidv4(),
          start_time: new Date('2024-06-02T00:00:00.000Z'),
          end_time: new Date('2024-06-02T10:00:00.000Z'),
          timezone: 'UTC',
        },
      ],
    );

    // event5: Completely outside range - before (should NOT be included)
    const event6 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-05-15T10:00:00.000Z'),
          end_time: new Date('2024-05-15T14:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 5',
        },
      ],
    );

    // start dates all outside range
    const event7 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-07-15T10:00:00.000Z'),
          end_time: new Date('2024-07-15T14:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 6',
        },
      ],
    );

    // start dates all outside range
    const event8 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-07-02T11:00:00.000Z'),
          end_time: new Date('2024-07-02T12:00:00.000Z'),
          timezone: 'UTC',
        },
        {
          id: uuidv4(),
          start_time: new Date('2024-07-01T11:00:00.000Z'),
          end_time: new Date('2024-07-01T12:00:00.000Z'),
          timezone: 'UTC',
        },
      ],
    );

    // first start date is out of range as well as second
    const event9 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-05-30T18:00:00.000Z'),
          end_time: new Date('2024-05-30T22:00:00.000Z'),
          timezone: 'UTC',
        },
        {
          id: uuidv4(),
          start_time: new Date('2024-07-01T10:00:00.000Z'),
          end_time: new Date('2024-07-01T11:00:00.000Z'),
          timezone: 'UTC',
        },
      ],
    );

    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?dateRange=2024-06-01T00:00:00.000Z/2024-06-30T00:00:00.000Z`,
      )
      .expect(200)
      .then(async ({ body }) => {
        const { events } = body;

        console.log(
          'Returned events: ',
          events.map((e) => ({ id: e.id, title: e.title })),
        );
        console.log('Expected events:', [
          event1.id,
          event2.id,
          event3.id,
          event4.id,
          event5.id,
        ]);
        console.log('Unexpected events:', [
          event6.id,
          event7.id,
          event8.id,
          event9.id,
        ]);

        expect(events.length).toEqual(5);

        // Check that the correct events are included
        const eventIds = events.map((event) => event.id);
        expect(eventIds).toContain(event1.id);
        expect(eventIds).toContain(event2.id);
        expect(eventIds).toContain(event3.id);
        expect(eventIds).toContain(event4.id);
        expect(eventIds).toContain(event5.id);

        // Check that the wrong events are NOT included
        expect(eventIds).not.toContain(event6.id);
        expect(eventIds).not.toContain(event7.id);
        expect(eventIds).not.toContain(event8.id);
        expect(eventIds).not.toContain(event9.id);
      });
  });

  it('/verified should return bad request when dateRange has invalid format', async () => {
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?dateRange=2024-07-01T00:00:00.000Z`,
      )
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'Invalid dateRange format. Expected format: startDate/endDate',
        );
      });
  });

  it('/verified should return bad request when dateRange has empty dates', async () => {
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?dateRange=/2024-07-01T23:59:59.999Z`,
      )
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'Both startDate and endDate must be provided in dateRange parameter',
        );
      });
  });

  it('/verified should return bad request when dateRange has invalid date format', async () => {
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?dateRange=invalid-date/2024-07-01T23:59:59.999Z`,
      )
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'Invalid date format in dateRange. Ensure dates are in ISO 8601 format.',
        );
      });
  });

  it('/verified should return bad request when startDate is after endDate in dateRange', async () => {
    return server
      .get(
        `/${CURRENT_VERSION_URI}/events/verified?dateRange=2024-07-01T23:59:59.999Z/2024-06-01T00:00:00.000Z`,
      )
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'startDate must be before endDate in dateRange parameter',
        );
      });
  });

  it('/events/{eventId} should include owning_partner when event has a partner', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Test Partner Organization',
      logo_url: 'https://example.com/logo.png',
    });

    // Create an event with the partner
    const event = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      {
        verified: true,
        owning_partner_id: partner.id,
      },
    );

    return server
      .get(`/${CURRENT_VERSION_URI}/events/${event.id}`)
      .expect(200)
      .then(async ({ body }) => {
        const { event: eventReturned, status } = body;

        expect(status).toEqual('success');
        expect(eventReturned).toHaveProperty('owning_partner_id', partner.id);
        expect(eventReturned).toHaveProperty('owning_partner');
        expect(eventReturned.owning_partner).toHaveProperty('id', partner.id);
        expect(eventReturned.owning_partner).toHaveProperty(
          'name',
          partner.name,
        );
        expect(eventReturned.owning_partner).toHaveProperty(
          'logo_url',
          partner.logo_url,
        );
        expect(eventReturned.owning_partner).toHaveProperty('createdAt');
        expect(eventReturned.owning_partner).toHaveProperty('updatedAt');
      });
  });

  it('/events/{eventId} should not include owning_partner when event has no partner', async () => {
    // Create an event without a partner
    const event = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
    );

    return server
      .get(`/${CURRENT_VERSION_URI}/events/${event.id}`)
      .expect(200)
      .then(async ({ body }) => {
        const { event: eventReturned, status } = body;

        expect(status).toEqual('success');
        expect(eventReturned).toHaveProperty('owning_partner_id', null);
        expect(eventReturned.owning_partner).toBeUndefined();
      });
  });

  it('/events/verified should include owning_partner in paginated results when events have partners', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Test Partner for Pagination',
      logo_url: 'https://example.com/pagination-logo.png',
    });

    // Create events with the partner
    await createListOfFutureEventsInChronologicalOrder(3, {
      verified: true,
      owning_partner_id: partner.id,
    });

    // Create events without partners
    await createListOfFutureEventsInChronologicalOrder(2, { verified: true });

    return server
      .get(`/${CURRENT_VERSION_URI}/events/verified?page=1&pageSize=10`)
      .expect(200)
      .then(async ({ body }) => {
        const { events, status } = body;

        expect(status).toEqual('success');
        expect(events.length).toBeGreaterThanOrEqual(3);

        // Find events with partners
        const eventsWithPartners = events.filter(
          (event) => event.owning_partner_id,
        );
        expect(eventsWithPartners.length).toBeGreaterThanOrEqual(3);

        // Verify partner data is included
        eventsWithPartners.forEach((event) => {
          expect(event).toHaveProperty('owning_partner_id', partner.id);
          expect(event).toHaveProperty('owning_partner');
          expect(event.owning_partner).toHaveProperty('id', partner.id);
          expect(event.owning_partner).toHaveProperty('name', partner.name);
          expect(event.owning_partner).toHaveProperty(
            'logo_url',
            partner.logo_url,
          );
        });

        // Find events without partners
        const eventsWithoutPartners = events.filter(
          (event) => !event.owning_partner_id,
        );
        expect(eventsWithoutPartners.length).toBeGreaterThanOrEqual(2);

        // Verify no partner data for events without partners
        eventsWithoutPartners.forEach((event) => {
          expect(event.owning_partner).toBeUndefined();
        });
      });
  });

  describe('Partner ID Filtering Tests', () => {
    it('/verified should filter events by single owning_partner_id', async () => {
      // Create partners
      const partner1 = await partnerModel.create({
        id: uuidv4(),
        name: 'Partner 1',
        logo_url: 'https://example.com/partner-1.png',
      });

      const partner2 = await partnerModel.create({
        id: uuidv4(),
        name: 'Partner 2',
        logo_url: 'https://example.com/partner-2.png',
      });

      // Create events for partner1
      const [partner1Events] =
        await createListOfFutureEventsInChronologicalOrder(3, {
          verified: true,
          owning_partner_id: partner1.id,
        });

      // Create events for partner2
      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: true,
        owning_partner_id: partner2.id,
      });

      // Create events without partners
      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: true,
      });

      return server
        .get(
          `/${CURRENT_VERSION_URI}/events/verified?owning_partner_id=${partner1.id}`,
        )
        .expect(200)
        .then(async ({ body }) => {
          const { events, status } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(3);

          // All returned events should belong to partner1
          events.forEach((event) => {
            expect(event.owning_partner_id).toEqual(partner1.id);
            expect(event.owning_partner).toHaveProperty('id', partner1.id);
            expect(event.owning_partner).toHaveProperty('name', partner1.name);
          });

          // Verify we got the correct events
          const returnedEventIds = events.map((e) => e.id);
          partner1Events.forEach((expectedEvent) => {
            expect(returnedEventIds).toContain(expectedEvent.id);
          });
        });
    });

    it('/verified should filter events by multiple owning_partner_id parameters', async () => {
      // Create partners
      const partner1 = await partnerModel.create({
        id: uuidv4(),
        name: 'Partner 1',
        logo_url: 'https://example.com/partner-1.png',
      });

      const partner2 = await partnerModel.create({
        id: uuidv4(),
        name: 'Partner 2',
        logo_url: 'https://example.com/partner-2.png',
      });

      const partner3 = await partnerModel.create({
        id: uuidv4(),
        name: 'Partner 3',
        logo_url: 'https://example.com/partner-3.png',
      });

      // Create events for partner1
      const [partner1Events] =
        await createListOfFutureEventsInChronologicalOrder(2, {
          verified: true,
          owning_partner_id: partner1.id,
        });

      // Create events for partner2
      const [partner2Events] =
        await createListOfFutureEventsInChronologicalOrder(3, {
          verified: true,
          owning_partner_id: partner2.id,
        });

      // Create events for partner3 (should not be included)
      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: true,
        owning_partner_id: partner3.id,
      });

      // Create events without partners (should not be included)
      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: true,
      });

      return server
        .get(
          `/${CURRENT_VERSION_URI}/events/verified?owning_partner_id=${partner1.id}&owning_partner_id=${partner2.id}`,
        )
        .expect(200)
        .then(async ({ body }) => {
          const { events, status } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(5);

          // All returned events should belong to either partner1 or partner2
          events.forEach((event) => {
            expect([partner1.id, partner2.id]).toContain(
              event.owning_partner_id,
            );
            expect(event.owning_partner).toBeDefined();
            expect([partner1.name, partner2.name]).toContain(
              event.owning_partner.name,
            );
          });

          // Verify we got the correct events
          const returnedEventIds = events.map((e) => e.id);
          const expectedEventIds = [...partner1Events, ...partner2Events].map(
            (e) => e.id,
          );
          expectedEventIds.forEach((expectedId) => {
            expect(returnedEventIds).toContain(expectedId);
          });
        });
    });

    it('/verified should return empty results when filtering by non-existent partner ID', async () => {
      // Create some events
      await createListOfFutureEventsInChronologicalOrder(3, {
        verified: true,
      });

      const nonExistentPartnerId = uuidv4();

      return server
        .get(
          `/${CURRENT_VERSION_URI}/events/verified?owning_partner_id=${nonExistentPartnerId}`,
        )
        .expect(200)
        .then(async ({ body }) => {
          const { events, status } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(0);
        });
    });

    it('/verified should filter by partner ID combined with other query parameters', async () => {
      // Create a partner
      const partner = await partnerModel.create({
        id: uuidv4(),
        name: 'Test Partner',
        logo_url: 'https://example.com/test-partner.png',
      });

      // Create events for the partner with specific tags
      const [partnerEventsWithTag] =
        await createListOfFutureEventsInChronologicalOrder(2, {
          verified: true,
          owning_partner_id: partner.id,
          tags: ['music'],
        });

      // Create events for the partner with different tags (should be filtered out)
      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: true,
        owning_partner_id: partner.id,
        tags: ['art'],
      });

      // Create events for other partners with the same tag (should be filtered out)
      const otherPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'Other Partner',
        logo_url: 'https://example.com/other-partner.png',
      });

      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: true,
        owning_partner_id: otherPartner.id,
        tags: ['music'],
      });

      return server
        .get(
          `/${CURRENT_VERSION_URI}/events/verified?owning_partner_id=${partner.id}&tags=music`,
        )
        .expect(200)
        .then(async ({ body }) => {
          const { events, status } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(2);

          // All returned events should belong to the specified partner AND have the music tag
          events.forEach((event) => {
            expect(event.owning_partner_id).toEqual(partner.id);
            expect(event.tags).toContain('music');
            expect(event.owning_partner).toHaveProperty('id', partner.id);
          });

          // Verify we got the correct events
          const returnedEventIds = events.map((e) => e.id);
          partnerEventsWithTag.forEach((expectedEvent) => {
            expect(returnedEventIds).toContain(expectedEvent.id);
          });
        });
    });

    it('/verified should filter by partner ID with pagination', async () => {
      // Create a partner
      const partner = await partnerModel.create({
        id: uuidv4(),
        name: 'Test Partner',
        logo_url: 'https://example.com/test-partner.png',
      });

      // Create more events than the default page size
      const [partnerEvents] =
        await createListOfFutureEventsInChronologicalOrder(25, {
          verified: true,
          owning_partner_id: partner.id,
        });

      // Create events for other partners
      const otherPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'Other Partner',
        logo_url: 'https://example.com/other-partner.png',
      });

      await createListOfFutureEventsInChronologicalOrder(10, {
        verified: true,
        owning_partner_id: otherPartner.id,
      });

      return server
        .get(
          `/${CURRENT_VERSION_URI}/events/verified?owning_partner_id=${partner.id}&page=1&pageSize=10`,
        )
        .expect(200)
        .then(async ({ body }) => {
          const {
            events,
            status,
            paginated,
            totalPages,
            nextPage,
            page,
            pageSize,
          } = body;

          expect(status).toEqual('success');
          expect(paginated).toEqual(true);
          expect(totalPages).toEqual(3); // 25 events / 10 per page = 3 pages
          expect(nextPage).toEqual(2);
          expect(page).toEqual(1);
          expect(pageSize).toEqual(10);
          expect(events).toHaveLength(10);

          // All returned events should belong to the specified partner
          events.forEach((event) => {
            expect(event.owning_partner_id).toEqual(partner.id);
            expect(event.owning_partner).toHaveProperty('id', partner.id);
          });
        });
    });
  });

  describe('Organizer Contact Filtering Tests', () => {
    it('/events/verified should strip organizer_contact for unauthenticated users', async () => {
      // Create events with organizer contact
      await createListOfFutureEventsInChronologicalOrder(3, {
        verified: true,
        organizer_contact: 'test@example.com',
      });

      return server
        .get(`/${CURRENT_VERSION_URI}/events/verified?page=1&pageSize=10`)
        .expect(200)
        .then(async ({ body }) => {
          const { events: returnedEvents, status } = body;

          expect(status).toEqual('success');
          expect(returnedEvents.length).toBeGreaterThanOrEqual(3);

          // All events should have organizer_contact stripped for unauthenticated users
          returnedEvents.forEach((event) => {
            expect(event.organizer_contact).toBeUndefined();
          });
        });
    });

    it('/events/verified should show organizer_contact for partner admin on their own events', async () => {
      // Create partners
      const userPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'User Partner',
        logo_url: 'https://example.com/user-partner.png',
      });

      const otherPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'Other Partner',
        logo_url: 'https://example.com/other-partner.png',
      });

      // Create a user with JWT token (partner admin)
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      // Create the user in the database
      const userResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const userId = userResponse.body.id;

      // Associate user with their partner
      await associateUserWithPartners(userId, [userPartner.id]);

      // Create events with organizer contact
      const userPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          owning_partner_id: userPartner.id,
          organizer_contact: 'user-partner@example.com',
        },
      );

      const otherPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          owning_partner_id: otherPartner.id,
          organizer_contact: 'other-partner@example.com',
        },
      );

      const noPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          organizer_contact: 'no-partner@example.com',
        },
      );

      return server
        .get(`/${CURRENT_VERSION_URI}/events/verified?page=1&pageSize=10`)
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async ({ body }) => {
          const { events, status } = body;

          expect(status).toEqual('success');
          expect(events.length).toBeGreaterThanOrEqual(3);

          // Find the specific events
          const userPartnerEventReturned = events.find(
            (e) => e.id === userPartnerEvent.id,
          );
          const otherPartnerEventReturned = events.find(
            (e) => e.id === otherPartnerEvent.id,
          );
          const noPartnerEventReturned = events.find(
            (e) => e.id === noPartnerEvent.id,
          );

          // Partner admin should see organizer_contact for their own events
          expect(userPartnerEventReturned).toHaveProperty('organizer_contact');
          expect(userPartnerEventReturned.organizer_contact).toEqual(
            'user-partner@example.com',
          );

          // Partner admin should NOT see organizer_contact for other partner's events
          expect(otherPartnerEventReturned.organizer_contact).toBeUndefined();

          // Partner admin should NOT see organizer_contact for events without partners
          expect(noPartnerEventReturned.organizer_contact).toBeUndefined();
        });
    });

    it('/events/{id} should show organizer_contact for partner admin on their own events', async () => {
      // Create a partner
      const userPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'User Partner',
        logo_url: 'https://example.com/user-partner.png',
      });

      // Create a user with JWT token (partner admin)
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      // Create the user in the database
      const userResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const userId = userResponse.body.id;

      // Associate user with their partner
      await associateUserWithPartners(userId, [userPartner.id]);

      // Create an event with organizer contact
      const event = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          owning_partner_id: userPartner.id,
          organizer_contact: 'user-partner@example.com',
        },
      );

      return server
        .get(`/${CURRENT_VERSION_URI}/events/${event.id}`)
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async ({ body }) => {
          const { event: eventReturned, status } = body;

          expect(status).toEqual('success');
          // Partner admin should see organizer_contact for their own events
          expect(eventReturned).toHaveProperty('organizer_contact');
          expect(eventReturned.organizer_contact).toEqual(
            'user-partner@example.com',
          );
        });
    });

    it('/events/{id} should strip organizer_contact for partner admin on events they do not own', async () => {
      // Create partners
      const userPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'User Partner',
        logo_url: 'https://example.com/user-partner.png',
      });

      const otherPartner = await partnerModel.create({
        id: uuidv4(),
        name: 'Other Partner',
        logo_url: 'https://example.com/other-partner.png',
      });

      // Create a user with JWT token (partner admin)
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      // Create the user in the database
      const userResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const userId = userResponse.body.id;

      // Associate user with their partner
      await associateUserWithPartners(userId, [userPartner.id]);

      // Create an event with organizer contact owned by other partner
      const event = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          owning_partner_id: otherPartner.id,
          organizer_contact: 'other-partner@example.com',
        },
      );

      return server
        .get(`/${CURRENT_VERSION_URI}/events/${event.id}`)
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async ({ body }) => {
          const { event: eventReturned, status } = body;

          expect(status).toEqual('success');
          // Partner admin should NOT see organizer_contact for events they don't own
          expect(eventReturned.organizer_contact).toBeUndefined();
        });
    });
  });

  async function associateUserWithPartners(
    userId: string,
    partnerIds: string[],
  ): Promise<void> {
    // Use Sequelize's association methods to create the many-to-many relationship
    const user = await userModel.findByPk(userId);
    const partners = await partnerModel.findAll({
      where: { id: partnerIds },
    });

    // Use the association method to set partners
    await (user as any).setPartners(partners);
  }
});
