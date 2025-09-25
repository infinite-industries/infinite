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
import { UserModel } from '../src/users/models/user.model';
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
import createJwtForRandomUser from './test-helpers/creaeteJwt';

describe('Authenticated Events API', () => {
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
    partnerModel = databaseModels.partnerModel;
    userModel = databaseModels.userModel;

    testingModule = databaseModels.testingModule;

    console.log('Events API test suite ready');

    return Promise.resolve();
  }, 30000);

  afterEach(async () => {
    await datetimeVenueModel.destroy({ where: {} });
    await eventModel.destroy({ where: {} });
    await venueModel.destroy({ where: {} });
    await partnerModel.destroy({ where: {} });

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

  it('/authenticated/events should include owning_partner in paginated results when events have partners', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Test Partner for Authenticated Events',
      logo_url: 'https://example.com/auth-events-logo.png',
    });

    // Create events with the partner
    const [eventsWithPartner] =
      await createListOfFutureEventsInChronologicalOrder(3, {
        verified: true,
        owning_partner_id: partner.id,
      });

    // Create events without partners
    await createListOfFutureEventsInChronologicalOrder(2, { verified: true });

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events?page=1&pageSize=10`)
      .set('x-access-token', token)
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
          // Partner admins should see organizer_contact for their own events
          expect(event).toHaveProperty('organizer_contact');
          expect(event.organizer_contact).toBeDefined();
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

  it('/authenticated/events/non-verified should include owning_partner when non-verified events have partners', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Test Partner for Non-Verified Events',
      logo_url: 'https://example.com/non-verified-logo.png',
    });

    // Create non-verified events with the partner
    const [eventsWithPartner] =
      await createListOfFutureEventsInChronologicalOrder(2, {
        verified: false,
        owning_partner_id: partner.id,
      });

    // Create non-verified events without partners
    await createListOfFutureEventsInChronologicalOrder(1, { verified: false });

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events/non-verified`)
      .set('x-access-token', token)
      .expect(200)
      .then(async ({ body }) => {
        const { events, status } = body;

        expect(status).toEqual('success');
        expect(events.length).toEqual(3);

        // Find events with partners
        const eventsWithPartners = events.filter(
          (event) => event.owning_partner_id,
        );
        expect(eventsWithPartners.length).toEqual(2);

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
          // Partner admins should see organizer_contact for their own events
          expect(event).toHaveProperty('organizer_contact');
          expect(event.organizer_contact).toBeDefined();
        });

        // Find events without partners
        const eventsWithoutPartners = events.filter(
          (event) => !event.owning_partner_id,
        );
        expect(eventsWithoutPartners.length).toEqual(1);

        // Verify no partner data for events without partners
        eventsWithoutPartners.forEach((event) => {
          expect(event.owning_partner).toBeUndefined();
        });
      });
  });

  it('/authenticated/events/{id} should include owning_partner when event has a partner', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Test Partner for Single Event',
      logo_url: 'https://example.com/single-event-logo.png',
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

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events/${event.id}`)
      .set('x-access-token', token)
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
        // Partner admins should see organizer_contact for their own events
        expect(eventReturned).toHaveProperty('organizer_contact');
        expect(eventReturned.organizer_contact).toBeDefined();
      });
  });

  it('/authenticated/events/{id} should not include owning_partner when event has no partner', async () => {
    // Create an event without a partner
    const event = await createRandomEventWithDateTime(
      eventModel,
      venueModel,
      datetimeVenueModel,
      { verified: true },
    );

    const token = await login();

    return server
      .get(`/${CURRENT_VERSION_URI}/authenticated/events/${event.id}`)
      .set('x-access-token', token)
      .expect(200)
      .then(async ({ body }) => {
        const { event: eventReturned, status } = body;

        expect(status).toEqual('success');
        expect(eventReturned).toHaveProperty('owning_partner_id', null);
        expect(eventReturned.owning_partner).toBeUndefined();
      });
  });

  describe('GET /authenticated/events/non-verified-for-partners', () => {
    it('should return 403 when user is not authenticated', async () => {
      await createListOfFutureEventsInChronologicalOrder(3);

      return server
        .get(
          `/${CURRENT_VERSION_URI}/authenticated/events/non-verified-for-partners`,
        )
        .expect(403);
    });

    it("should return only non-verified events from user's associated partners", async () => {
      // Create partners
      const userPartner1 = await createPartner({
        name: 'User Partner 1',
        logo_url: 'https://example.com/user-partner-1.png',
      });

      const userPartner2 = await createPartner({
        name: 'User Partner 2',
        logo_url: 'https://example.com/user-partner-2.png',
      });

      const otherPartner = await createPartner({
        name: 'Other Partner',
        logo_url: 'https://example.com/other-partner.png',
      });

      // Create a user with JWT token
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      // Create the user in the database
      const userResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const userId = userResponse.body.id;

      // Associate user with their partners
      await associateUserWithPartners(userId, [
        userPartner1.id,
        userPartner2.id,
      ]);

      // Create non-verified events for user's partners (should be included)
      const userPartner1Event = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
          owning_partner_id: userPartner1.id,
        },
      );

      const userPartner2Event = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
          owning_partner_id: userPartner2.id,
        },
      );

      // Create non-verified event for other partner (should be excluded)
      const otherPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
          owning_partner_id: otherPartner.id,
        },
      );

      // Create non-verified event without partner (should be excluded)
      const noPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
        },
      );

      // Create verified event for user's partner (should be excluded)
      const verifiedUserPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          owning_partner_id: userPartner1.id,
        },
      );

      // Call the endpoint
      return server
        .get(
          `/${CURRENT_VERSION_URI}/authenticated/events/non-verified-for-partners`,
        )
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async ({ body }) => {
          const { status, events } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(2);

          // Verify only events from user's partners are returned
          const eventIds = events.map((event: any) => event.id);
          expect(eventIds).toContain(userPartner1Event.id);
          expect(eventIds).toContain(userPartner2Event.id);

          // Verify excluded events are not returned
          expect(eventIds).not.toContain(otherPartnerEvent.id);
          expect(eventIds).not.toContain(noPartnerEvent.id);
          expect(eventIds).not.toContain(verifiedUserPartnerEvent.id);

          // Verify event structure includes partner information
          const userPartner1EventReturned = events.find(
            (e: any) => e.id === userPartner1Event.id,
          );
          expect(userPartner1EventReturned).toHaveProperty(
            'owning_partner_id',
            userPartner1.id,
          );
          expect(userPartner1EventReturned).toHaveProperty('owning_partner');
          expect(userPartner1EventReturned.owning_partner).toHaveProperty(
            'id',
            userPartner1.id,
          );
          expect(userPartner1EventReturned.owning_partner).toHaveProperty(
            'name',
            userPartner1.name,
          );

          const userPartner2EventReturned = events.find(
            (e: any) => e.id === userPartner2Event.id,
          );
          expect(userPartner2EventReturned).toHaveProperty(
            'owning_partner_id',
            userPartner2.id,
          );
          expect(userPartner2EventReturned).toHaveProperty('owning_partner');
          expect(userPartner2EventReturned.owning_partner).toHaveProperty(
            'id',
            userPartner2.id,
          );
          expect(userPartner2EventReturned.owning_partner).toHaveProperty(
            'name',
            userPartner2.name,
          );
        });
    });

    it('should return empty list when user has no non-verified events from their partners', async () => {
      // Create a partner
      const userPartner = await createPartner({
        name: 'User Partner',
        logo_url: 'https://example.com/user-partner.png',
      });

      // Create a user with JWT token
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      // Create the user in the database
      const userResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const userId = userResponse.body.id;

      // Associate user with partner
      await associateUserWithPartners(userId, [userPartner.id]);

      // Create only verified events for user's partner
      await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: true,
          owning_partner_id: userPartner.id,
        },
      );

      // Call the endpoint
      return server
        .get(
          `/${CURRENT_VERSION_URI}/authenticated/events/non-verified-for-partners`,
        )
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(({ body }) => {
          const { status, events } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(0);
        });
    });

    it('should work for infinite admin and return all non-verified events', async () => {
      // Create partners
      const partner1 = await createPartner({
        name: 'Partner 1',
        logo_url: 'https://example.com/partner-1.png',
      });

      const partner2 = await createPartner({
        name: 'Partner 2',
        logo_url: 'https://example.com/partner-2.png',
      });

      // Create infinite admin user
      const adminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': true,
      });

      // Create non-verified events for different partners
      const partner1Event = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
          owning_partner_id: partner1.id,
        },
      );

      const partner2Event = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
          owning_partner_id: partner2.id,
        },
      );

      const noPartnerEvent = await createRandomEventWithDateTime(
        eventModel,
        venueModel,
        datetimeVenueModel,
        {
          verified: false,
        },
      );

      // Call the endpoint
      return server
        .get(
          `/${CURRENT_VERSION_URI}/authenticated/events/non-verified-for-partners`,
        )
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .then(({ body }) => {
          const { status, events } = body;

          expect(status).toEqual('success');
          expect(events).toHaveLength(3);

          // Verify all non-verified events are returned
          const eventIds = events.map((event: any) => event.id);
          expect(eventIds).toContain(partner1Event.id);
          expect(eventIds).toContain(partner2Event.id);
          expect(eventIds).toContain(noPartnerEvent.id);
        });
    });
  });

  describe('Non-Admin Access Tests', () => {
    let nonAdminToken: string;

    beforeEach(async () => {
      // Create a non-admin user token
      nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });
    });

    it('should return 403 Forbidden for non-admin user accessing GET /authenticated/events', async () => {
      await createListOfFutureEventsInChronologicalOrder(3);

      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/events`)
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing GET /authenticated/events/admin-metadata', async () => {
      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/events/admin-metadata`)
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing GET /authenticated/events/non-verified', async () => {
      await createListOfFutureEventsInChronologicalOrder(3);

      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/events/non-verified`)
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing GET /authenticated/events/:id', async () => {
      const [events] = await createListOfFutureEventsInChronologicalOrder(1);
      const eventId = events[0].id;

      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/events/${eventId}`)
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing PUT /authenticated/events/:id', async () => {
      const [events] = await createListOfFutureEventsInChronologicalOrder(1);
      const eventId = events[0].id;

      const updateData = {
        title: 'Updated Event Title',
        description: 'Updated event description',
      };

      return server
        .put(`/${CURRENT_VERSION_URI}/authenticated/events/${eventId}`)
        .set('x-access-token', nonAdminToken)
        .send(updateData)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing PUT /authenticated/events/verify/:id', async () => {
      const [events] = await createListOfFutureEventsInChronologicalOrder(1);
      const eventId = events[0].id;

      return server
        .put(`/${CURRENT_VERSION_URI}/authenticated/events/verify/${eventId}`)
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing DELETE /authenticated/events/:id', async () => {
      const [events] = await createListOfFutureEventsInChronologicalOrder(1);
      const eventId = events[0].id;

      return server
        .delete(`/${CURRENT_VERSION_URI}/authenticated/events/${eventId}`)
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing PUT /authenticated/events/:id/admin-metadata', async () => {
      const [events] = await createListOfFutureEventsInChronologicalOrder(1);
      const eventId = events[0].id;

      const adminMetadata = {
        reviewed_by_org: true,
        accessibility_notes: 'Updated accessibility information',
      };

      return server
        .put(
          `/${CURRENT_VERSION_URI}/authenticated/events/${eventId}/admin-metadata`,
        )
        .set('x-access-token', nonAdminToken)
        .send(adminMetadata)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing GET /authenticated/events with query parameters', async () => {
      await createListOfFutureEventsInChronologicalOrder(5);

      return server
        .get(
          `/${CURRENT_VERSION_URI}/authenticated/events?page=1&pageSize=10&tags=music&category=concert`,
        )
        .set('x-access-token', nonAdminToken)
        .expect(403);
    });

    it('should return 403 Forbidden for non-admin user accessing GET /authenticated/events with dateRange filter', async () => {
      await createListOfFutureEventsInChronologicalOrder(3);

      return server
        .get(
          `/${CURRENT_VERSION_URI}/authenticated/events?dateRange=2024-01-01T00:00:00.000Z/2024-12-31T23:59:59.999Z`,
        )
        .set('x-access-token', nonAdminToken)
        .expect(403);
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

  async function createPartner(partnerData: any): Promise<PartnerModel> {
    return partnerModel.create({
      ...partnerData,
      id: uuidv4(),
    });
  }

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
