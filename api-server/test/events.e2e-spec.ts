import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
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
  createRandomEventWithVenue,
} from './fakers/event.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import EventDTO from '../src/events/dto/eventDTO';
import { Nullable } from '../src/utils/NullableOrUndefinable';
import faker from 'faker';
import { assertEventsEqual } from './test-helpers/assert-events';

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

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    eventModel = databaseModels.eventModel;
    venueModel = databaseModels.venueModel;
    datetimeVenueModel = databaseModels.datetimeVenueModel;

    testingModule = databaseModels.testingModule;

    console.log('Events API test suite ready');

    return Promise.resolve();
  }, 30000);

  afterEach(async () => {
    await datetimeVenueModel.destroy({ where: {} });
    await eventModel.destroy({ where: {} });
    await venueModel.destroy({ where: {} });

    return Promise.resolve();
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

    const allVerifiedEvents = [
      ...someVerifiedEventsWithDateTimes,
      eventWithoutDateTime1,
      eventWithoutDateTime2,
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

        // last 2 entries should have no date_times
        expect(events[3].date_times).toEqual([]);
        expect(events[4].date_times).toEqual([]);
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
});
