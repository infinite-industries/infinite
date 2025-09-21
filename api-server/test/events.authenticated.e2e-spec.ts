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
import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { afterAllStackShutdown } from './test-helpers/after-all-stack-shutdown';
import { createListOfFutureEventsInChronologicalOrder as _createListOfFutureEventsInChronologicalOrder } from './fakers/event.faker';
import { ApiOkResponse } from '@nestjs/swagger';
import { Nullable } from '../src/utils/NullableOrUndefinable';
import { assertEventsEqual } from './test-helpers/assert-events';
import { assertOrderedByFirstStartTimeDescending } from './test-helpers/assertOrderedByFirstStartTimeDescending';
import { createRandomEventWithDateTime } from './fakers/event.faker';
import { v4 as uuidv4 } from 'uuid';

describe('Authenticated Events API', () => {
  const server = request('http://localhost:' + PORT);

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let eventModel: typeof EventModel;
  let venueModel: typeof VenueModel;
  let datetimeVenueModel: typeof DatetimeVenueModel;
  let testingModule: TestingModule;

  let dbHostPort: number;

  beforeAll(async () => {
    console.info('preparing Authenticated Events API test suite');

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

  it('/authenticated/events/non-verified should return forbidden if the user is not authenticated', async () => {
    await createListOfFutureEventsInChronologicalOrder(3);

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events/non-verified`)
      .expect(403);
  });

  it('/authenticated/events/non-verified should return non-verified events if the user is authenticated', async () => {
    const numEventsToCreate = 10;

    const [expectedEvents] = await createListOfFutureEventsInChronologicalOrder(
      numEventsToCreate,
      { verified: false },
    );

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events/non-verified`)
      .set('x-access-token', token)
      .expect(200)
      .then(({ body }) => {
        const { status, events } = body;

        expect(status).toEqual('success');
        expect(events.length).toEqual(numEventsToCreate);

        for (let i = 0; i < events.length; i++) {
          const returnedEvent = events[i];
          const expectedEvent: Nullable<EventModel> = expectedEvents.find(
            (e) => e.id === returnedEvent.id,
          );

          assertEventsEqual(returnedEvent, expectedEvent);
        }
      });
  });

  it('/authenticated/events/non-verified should not return verified events', async () => {
    const numEventsToCreate = 10;

    await createListOfFutureEventsInChronologicalOrder(numEventsToCreate, {
      verified: true,
    });

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events/non-verified`)
      .set('x-access-token', token)
      .expect(200)
      .then(({ body }) => {
        const { status, events } = body;

        expect(status).toEqual('success');
        expect(events.length).toEqual(0);
      });
  });

  it('/authenticated/events should return forbidden if the user is not authenticated', async () => {
    await createListOfFutureEventsInChronologicalOrder(3);

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events`)
      .expect(403);
  });

  it('/authenticated/events should return verified and non-verified events if the user is authenticated', async () => {
    const numEventsNonVerifiedToCreate = 10;
    const numEventsVerifiedToCreate = 10;

    const [expectedEventsNonVerified, offset] =
      await createListOfFutureEventsInChronologicalOrder(
        numEventsNonVerifiedToCreate,
        {
          verified: false,
        },
      );

    const [expectedEventsVerified] =
      await createListOfFutureEventsInChronologicalOrder(
        numEventsNonVerifiedToCreate,
        {
          verified: true,
        },
        offset,
      );

    const token = await login();

    const expectedEvents = [
      ...expectedEventsNonVerified,
      ...expectedEventsVerified,
    ];

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events`)
      .set('x-access-token', token)
      .expect(200)
      .then(({ body }) => {
        const { status, events } = body;

        expect(status).toEqual('success');
        expect(events.length).toEqual(
          numEventsNonVerifiedToCreate + numEventsVerifiedToCreate,
        );

        for (let i = 0; i < events.length; i++) {
          const returnedEvent = events[i];
          const expectedEvent: Nullable<EventModel> = expectedEvents.find(
            (e) => e.id === returnedEvent.id,
          );

          assertEventsEqual(returnedEvent, expectedEvent);
        }
      });
  });

  it('/authenticated/events should return paginated results with default page size', async () => {
    const givenTotalNumEvents = 40;
    const expectedDefaultPageSize = 20;

    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: true },
    );

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events`)
      .set('x-access-token', token)
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

  it('/authenticated/events should return second page with default page size', async () => {
    const givenTotalNumEvents = 40;
    const expectedDefaultPageSize = 20;

    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: false },
    );

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events?page=2`)
      .set('x-access-token', token)
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

  it('/authenticated/events should return paginated results with custom page size', async () => {
    const givenTotalNumEvents = 30;
    const customPageSize = 10;

    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: false },
    );

    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?page=1&pageSize=${customPageSize}`,
      )
      .set('x-access-token', token)
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
        expect(totalPages).toEqual(3);
        expect(nextPage).toEqual(2);
        expect(page).toEqual(1);
        expect(pageSize).toEqual(customPageSize);
        expect(events.length).toEqual(customPageSize);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEvents[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  it('/authenticated/events should return second page with custom page size', async () => {
    const givenTotalNumEvents = 30;
    const customPageSize = 10;

    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: false },
    );

    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?page=2&pageSize=${customPageSize}`,
      )
      .set('x-access-token', token)
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
        expect(totalPages).toEqual(3);
        expect(nextPage).toEqual(3);
        expect(page).toEqual(2);
        expect(pageSize).toEqual(customPageSize);
        expect(events.length).toEqual(customPageSize);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEvents[i + customPageSize];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  it('/authenticated/events should filter events by dateRange when provided', async () => {
    //  === event1, event2, event3, event4, and event5 in range -- should be included ===
    const event1 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true }, // mix of verified and un-verified, it should not matter here
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
      { verified: false },
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
      { verified: false },
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
      { verified: false },
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

    // event6: Completely outside range - before (should NOT be included)
    const event6 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: false },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-05-15T10:00:00.000Z'),
          end_time: new Date('2024-05-15T14:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 6',
        },
      ],
    );

    // event7: Completely outside range - after (should NOT be included)
    const event7 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: false },
      [
        {
          id: uuidv4(),
          start_time: new Date('2024-07-15T10:00:00.000Z'),
          end_time: new Date('2024-07-15T14:00:00.000Z'),
          timezone: 'UTC',
          optional_title: 'Event 7',
        },
      ],
    );

    // event8: start dates all outside range
    const event8 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: false },
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

    // event9: first start date is out of range as well as second
    const event9 = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: false },
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

    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?dateRange=2024-06-01T00:00:00.000Z/2024-06-30T00:00:00.000Z`,
      )
      .set('x-access-token', token)
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

  it('/authenticated/events should return bad request when dateRange has invalid format', async () => {
    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?dateRange=2024-07-01T00:00:00.000Z`,
      )
      .set('x-access-token', token)
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'Invalid dateRange format. Expected format: startDate/endDate',
        );
      });
  });

  it('/authenticated/events should return bad request when dateRange has empty dates', async () => {
    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?dateRange=/2024-07-01T23:59:59.999Z`,
      )
      .set('x-access-token', token)
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'Both startDate and endDate must be provided in dateRange parameter',
        );
      });
  });

  it('/authenticated/events should return bad request when dateRange has invalid date format', async () => {
    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?dateRange=invalid-date/2024-07-01T23:59:59.999Z`,
      )
      .set('x-access-token', token)
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'Invalid date format in dateRange. Ensure dates are in ISO 8601 format.',
        );
      });
  });

  it('/authenticated/events should return bad request when startDate is after endDate in dateRange', async () => {
    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?dateRange=2024-07-01T23:59:59.999Z/2024-06-01T00:00:00.000Z`,
      )
      .set('x-access-token', token)
      .expect(400)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          'startDate must be before endDate in dateRange parameter',
        );
      });
  });

  it('/authenticated/events should return paginated events within dateRange', async () => {
    const givenTotalNumEvents = 30;
    const customPageSize = 10;

    // Create events with specific dates within our range
    const [allEvents] = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
      { verified: false },
    );

    const token = await login();

    return server
      .get(
        `/${CURRENT_VERSION_URI}/authenticated/events?page=1&pageSize=${customPageSize}&dateRange=2024-01-01T00:00:00.000Z/2025-12-31T23:59:59.999Z`,
      )
      .set('x-access-token', token)
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
        expect(totalPages).toEqual(3);
        expect(nextPage).toEqual(2);
        expect(page).toEqual(1);
        expect(pageSize).toEqual(customPageSize);
        expect(events.length).toEqual(customPageSize);

        assertOrderedByFirstStartTimeDescending(events);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEvents[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
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

  async function login(username = 'test', password = 'xxx'): Promise<string> {
    return await server
      .post(`/${CURRENT_VERSION_URI}/authentication/login`)
      .send({
        username,
        password,
      })
      .expect(ApiOkResponse)
      .then(({ body }) => {
        return body.token;
      });
  }
});
