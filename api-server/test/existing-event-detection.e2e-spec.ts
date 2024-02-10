import request from 'supertest';
import { INFINITE_API_BASE_URL, PORT } from '../src/constants';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { EventModel } from '../src/events/models/event.model';
import { VenueModel } from '../src/venues/models/venue.model';
import { DatetimeVenueModel } from '../src/events/models/datetime-venue.model';
import { TestingModule } from '@nestjs/testing';
import bringUpStackAndEstablishDbEntities from './test-helpers/bring-up-stack-and-establish-db-entities';
import clearDatabaseEntries from './test-helpers/clear-database-entries';
import { afterAllStackShutdown } from './test-helpers/after-all-stack-shutdown';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { createRandomEventWithVenue } from './fakers/event.faker';
import ExistingEventDetectionParameters from '../src/events/dto/existing-event-detection-parameters';
import { v4 as uuidv4 } from 'uuid';

describe('Existing Event Detection API', () => {
  const server = request('http://localhost:' + PORT);

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let eventModel: typeof EventModel;
  let venueModel: typeof VenueModel;
  let datetimeVenueModel: typeof DatetimeVenueModel;
  let testingModule: TestingModule;

  let dbHostPort: number;

  beforeAll(async () => {
    console.info('preparing Existing Event Detection API test suite');

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
      `Existing Event Detection API test suite ready, db listing on port ${dbHostPort}`,
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

  it('/detect-existing/by-time-and-location should label an event as existing if all start times match and are at the same venue', async () => {
    const [event, venue] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
    );

    const existDateTimesForVenue = await createTimesInFutureForVenue(
      event.id,
      venue.id,
    );

    const givenQuery: ExistingEventDetectionParameters = {
      timeAndLocations: existDateTimesForVenue.map(({ start_time }) => ({
        venueId: venue.id,
        startTime: start_time,
      })),
    };

    return server
      .post(
        `/${CURRENT_VERSION_URI}/events/detect-existing/by-time-and-location`,
      )
      .send(givenQuery)
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toEqual({
          isLikelyExisting: true,
          confidence: 100.0,
          factors: {
            percentMatchingStartTimesAtSameVenue: 100.0,
          },
          candidateEvents: [
            {
              title: event.title,
              briefDescription: event.brief_description,
              verified: event.verified,
              url: `${INFINITE_API_BASE_URL}/events/${event.id}`,
            },
          ],
        });
      });
  });

  async function createTimesInFutureForVenue(
    eventId: string,
    venueId: string,
  ): Promise<DatetimeVenueModel[]> {
    const pair1 = getStartEndPairs();
    const pair2 = getStartEndPairs(pair1[1]);
    const pair3 = getStartEndPairs(pair2[1]);
    const pair4 = getStartEndPairs(pair3[1]);

    return await Promise.all(
      [pair1, pair2, pair3, pair4].map(([startTime, endTime]) => {
        return new datetimeVenueModel({
          id: uuidv4(),
          event_id: eventId,
          venue_id: venueId,
          start_time: startTime,
          end_time: endTime,
        }).save();
      }),
    );
  }

  function getStartEndPairs(
    baseTime = new Date(),
    startTimeOffset = 5,
    endTimeOffset = 1,
  ): [Date, Date] {
    const startTime = new Date(baseTime);
    startTime.setHours(startTime.getHours() + startTimeOffset);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + endTimeOffset);

    return [startTime, endTime];
  }
});
