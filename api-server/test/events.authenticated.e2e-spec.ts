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

  it('/authenticated/events/non-verified should return events if the user is authenticated', async () => {
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
