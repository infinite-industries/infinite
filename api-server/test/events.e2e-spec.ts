import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import request from 'supertest';
import { PORT } from '../src/constants';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { EventModel } from '../src/events/models/event.model';
import { VenueModel } from '../src/venues/models/venue.model';
import { DatetimeVenueModel } from '../src/events/models/datetime-venue.model';
import { TestingModule } from '@nestjs/testing';
import { afterAllStackShutdown } from './test-helpers/after-all-stack-shutdown';
import { createRandomEvent } from './fakers/event.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';

// !!! TODO CHECK BOTH SORT ORDERS
// !!! CHECK WITH TAGS
// !!! CHECK WITH ONLINE RESOURCES

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

  afterAll(
    async () => afterAllStackShutdown(appUnderTest, dbContainer, testingModule),
    30000,
  );

  it('/verified should be able to return the first page using defaults', async () => {
    const givenTotalNumEvents = 40;
    const expectedDefaultPageSize = 20;

    const allEvents = await createListOfFutureEventsInChronologicalOrder(
      givenTotalNumEvents,
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
        expect(pageSize).toEqual(20);
        expect(events.length).toEqual(20);

        for (let i = 0; i < events.length; i++) {
          const paginatedEventReturned = events[i];
          const expectedEvent = allEvents[i];

          assertEventsEqual(paginatedEventReturned, expectedEvent);
        }
      });
  });

  async function createListOfFutureEventsInChronologicalOrder(numEvents = 30) {
    const events: EventModel[] = [];

    let baseTime = new Date();
    for (let i = 0; i < numEvents; i++) {
      const [newEvent, newBaseTime] = await createEventInPast(baseTime);

      events.push(newEvent);
      baseTime = newBaseTime;
    }

    return events;
  }

  async function createEventInPast(baseTime): Promise<[EventModel, Date]> {
    const event = await createRandomEvent(
      eventModel,
      venueModel,
      datetimeVenueModel,
    );

    let offset = 0;
    let lastStartTime = baseTime;

    for (const dt of event.date_times) {
      const newStartTime = new Date(baseTime);
      newStartTime.setHours(baseTime.getHours() - offset);
      offset++;
      lastStartTime = newStartTime;

      await dt.update({ start_time: newStartTime });
    }

    await event.reload();

    return [event, lastStartTime];
  }

  function assertEventsEqual(actualReturned: any, expectedEvent: EventModel) {
    expect(actualReturned.id).toEqual(expectedEvent.id);
    expect(actualReturned.verified).toEqual(expectedEvent.verified);
    expect(actualReturned.title).toEqual(expectedEvent.title);
    expect(actualReturned.multi_day).toEqual(expectedEvent.multi_day);
    expect(actualReturned.image).toEqual(expectedEvent.image);
    expect(actualReturned.social_image).toEqual(expectedEvent.social_image);
    expect(actualReturned.admission_fee).toEqual(expectedEvent.admission_fee);
    expect(actualReturned.organizer_contact).toEqual(
      expectedEvent.organizer_contact,
    );
    expect(actualReturned.brief_description).toEqual(
      expectedEvent.brief_description,
    );
    expect(actualReturned.description).toEqual(expectedEvent.description);
    expect(actualReturned.links).toEqual(expectedEvent.links);
    expect(actualReturned.website_link).toEqual(expectedEvent.website_link);
    expect(actualReturned.ticket_link).toEqual(expectedEvent.ticket_link);
    expect(actualReturned.fb_event_link).toEqual(expectedEvent.fb_event_link);
    expect(actualReturned.eventbrite_link).toEqual(
      expectedEvent.eventbrite_link,
    );
    expect(actualReturned.bitly_link).toEqual(expectedEvent.bitly_link);
    expect(actualReturned.tags).toEqual(expectedEvent.tags);
    expect(actualReturned.reviewed_by_org).toEqual(
      expectedEvent.reviewed_by_org,
    );
  }
});
