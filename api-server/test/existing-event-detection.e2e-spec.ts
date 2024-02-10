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
import generateEvent, {
  createRandomEventWithVenue,
} from './fakers/event.faker';
import ExistingEventDetectionParameters from '../src/events/dto/existing-event-detection-parameters';
import { v4 as uuidv4 } from 'uuid';

describe('Existing Event Detection API', () => {
  const server = request('http://localhost:' + PORT);
  const detectByTimeAndPlacePath =
    '/events/detect-existing/by-time-and-location';

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

  it(`${detectByTimeAndPlacePath} should label an event as existing if all start times match and are at the same venue`, async () => {
    // === Given
    const [event, venue] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
    );

    const existingDateTimesForVenue =
      await createFiveDateTimeVenueModelsInFutureForVenue(event.id, venue.id);

    // === When all the start times in the query match exactly the start times we createad for this venue
    const query: ExistingEventDetectionParameters = {
      timeAndLocations: existingDateTimesForVenue.map(({ start_time }) => ({
        venueId: venue.id,
        startTime: start_time,
      })),
    };

    // === Then
    return server
      .post(`/${CURRENT_VERSION_URI}${detectByTimeAndPlacePath}`)
      .send(query)
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

  it(`${detectByTimeAndPlacePath} should label an event as existing if more than 50% of the start times match and are at the same venue`, async () => {
    // === Given
    const [event, venue] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
    );

    const existingDateTimesForVenue =
      await createFiveDateTimeVenueModelsInFutureForVenue(event.id, venue.id);

    // === When two/five start times in the query are offset by an hour
    const query: ExistingEventDetectionParameters = {
      timeAndLocations: existingDateTimesForVenue.map(({ start_time }) => ({
        venueId: venue.id,
        startTime: start_time,
      })),
    };

    query.timeAndLocations[3].startTime.setHours(
      query.timeAndLocations[3].startTime.getHours() + 1,
    );
    query.timeAndLocations[4].startTime.setHours(
      query.timeAndLocations[4].startTime.getHours() + 1,
    );

    // === Then
    return server
      .post(`/${CURRENT_VERSION_URI}${detectByTimeAndPlacePath}`)
      .send(query)
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toEqual({
          isLikelyExisting: true,
          confidence: 60.0,
          factors: {
            percentMatchingStartTimesAtSameVenue: 60.0,
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

  it(`${detectByTimeAndPlacePath} should label an event as new if less than 50% of the start times match and are at the same venue`, async () => {
    // === Given
    const [event, venue] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
    );

    const existingDateTimesForVenue =
      await createFiveDateTimeVenueModelsInFutureForVenue(event.id, venue.id);

    // === When three/five start times in the query are offset by an hour
    const query: ExistingEventDetectionParameters = {
      timeAndLocations: existingDateTimesForVenue.map(({ start_time }) => ({
        venueId: venue.id,
        startTime: start_time,
      })),
    };

    query.timeAndLocations[2].startTime.setHours(
      query.timeAndLocations[2].startTime.getHours() + 1,
    );
    query.timeAndLocations[3].startTime.setHours(
      query.timeAndLocations[3].startTime.getHours() + 1,
    );
    query.timeAndLocations[4].startTime.setHours(
      query.timeAndLocations[4].startTime.getHours() + 1,
    );

    // === Then
    return server
      .post(`/${CURRENT_VERSION_URI}${detectByTimeAndPlacePath}`)
      .send(query)
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toEqual({
          isLikelyExisting: false,
          confidence: 40.0,
          factors: {
            percentMatchingStartTimesAtSameVenue: 40.0,
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

  it(`${detectByTimeAndPlacePath} should handle cases where multiple events match the query`, async () => {
    // === Given
    const [event1, venue] = await createRandomEventWithVenue(
      eventModel,
      venueModel,
    );
    const existingDateTimesForVenue =
      await createFiveDateTimeVenueModelsInFutureForVenue(event1.id, venue.id);

    const event2: EventModel = await generateEvent(eventModel).save();
    await copyDateTimesToSecondEvent(event2.id, existingDateTimesForVenue);

    // === When all start times in the query match all the start times at the same venue for two events
    const query: ExistingEventDetectionParameters = {
      timeAndLocations: existingDateTimesForVenue.map(({ start_time }) => ({
        venueId: venue.id,
        startTime: start_time,
      })),
    };

    // === Then
    return server
      .post(`/${CURRENT_VERSION_URI}${detectByTimeAndPlacePath}`)
      .send(query)
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toEqual({
          isLikelyExisting: true,
          confidence: 100.0,
          factors: {
            percentMatchingStartTimesAtSameVenue: 100.0,
          },
          // should contain both events, in some order
          candidateEvents: expect.arrayContaining([
            {
              title: event1.title,
              briefDescription: event1.brief_description,
              verified: event1.verified,
              url: `${INFINITE_API_BASE_URL}/events/${event1.id}`,
            },
            {
              title: event2.title,
              briefDescription: event2.brief_description,
              verified: event2.verified,
              url: `${INFINITE_API_BASE_URL}/events/${event2.id}`,
            },
          ]),
        });

        // extra assert needed because arrayContaining doesn't guarantee same length
        expect(body.candidateEvents.length).toEqual(2);
      });
  });

  async function createFiveDateTimeVenueModelsInFutureForVenue(
    eventId: string,
    venueId: string,
  ): Promise<DatetimeVenueModel[]> {
    const pair1 = getStartEndPairs();
    const pair2 = getStartEndPairs(pair1[1]);
    const pair3 = getStartEndPairs(pair2[1]);
    const pair4 = getStartEndPairs(pair3[1]);
    const pair5 = getStartEndPairs(pair4[1]);

    return await Promise.all(
      [pair1, pair2, pair3, pair4, pair5].map(([startTime, endTime]) => {
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

  async function copyDateTimesToSecondEvent(
    newEventId: string,
    dateTimeVenueModels: DatetimeVenueModel[],
  ): Promise<DatetimeVenueModel[]> {
    return await Promise.all(
      dateTimeVenueModels.map((dt) => {
        const newDateTimeVenueModel = new datetimeVenueModel({
          ...dt.dataValues,
          id: uuidv4(),
          event_id: newEventId,
        });

        return newDateTimeVenueModel.save();
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
