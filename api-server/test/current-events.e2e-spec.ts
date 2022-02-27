import { TestingModule } from "@nestjs/testing";
import isNotNullOrUndefined from "../src/utils/is-not-null-or-undefined";
import {StartedTestContainer } from "testcontainers";
import {VenueModel} from "../src/venues/models/venue.model"
import * as request from "supertest";
import {CURRENT_VERSION_URI} from "../src/utils/versionts";
import {EventModel} from '../src/events/models/event.model';
import generateEvent from "./fakers/event.faker";
import generateVenue from "./fakers/venue.faker";
import {ChildProcessWithoutNullStreams} from "child_process";
import runMigrations from "./test-helpers/e2e-stack/run-migrations";
import startApplication from "./test-helpers/e2e-stack/start-application";
import buildDbConnectionsForTests from "./test-helpers/e2e-stack/build-db-connection-for-tests";
import killApp from "./test-helpers/e2e-stack/kill-app";
import stopDatabase from "./test-helpers/e2e-stack/stop-database";
import startDatabase from "./test-helpers/e2e-stack/start-database";
import { generateDatetimeVenueFaker } from './fakers/generateDatetimeVenue.faker';
import { DatetimeVenueModel } from '../src/events/models/datetime-venue.model';
import {PORT} from "../src/constants";


const today = new Date(Date.now());
const eventWindow = 2; // maximum hours in past events will remain visible for

const server = request('http://localhost:' + PORT);

let appUnderTest: ChildProcessWithoutNullStreams;
let dbContainer: StartedTestContainer;

let eventModel: typeof EventModel;
let venueModel: typeof VenueModel;
let datetimeVenueModel: typeof DatetimeVenueModel;
let testingModule: TestingModule;

let dbHostPort: number;

describe('CurrentEvents (e2e)', () => {
    beforeAll(async (done) => {
        console.info('preparing for test suite');

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

        console.log('test suite ready');

        done();
    }, 30000);

    afterAll(async (done) => {
        console.info('begin cleanup for events')

        await killApp(appUnderTest);

        appUnderTest.removeAllListeners()

        await stopDatabase(dbContainer);

        if (isNotNullOrUndefined(testingModule)) {
            await testingModule.close();
        }

        console.info('done cleaning up for events')
        done();
    }, 30000);

    beforeEach(async (done) => {
        console.info('preparing for test');

        if (datetimeVenueModel)
          await deleteAllDatetimeVenues();

        if (eventModel)
            await deleteAllEvents();

        if (venueModel)
            await deleteAllVenues();

        done();
    });

    it('can query current-events', async () => {
        console.info('running first test: ' +
            `http://localhost:${PORT}/${CURRENT_VERSION_URI}/current-events/verified`);

        return server
            .get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200);
    });

    it('returns only verified events', async function (done) {
        const dateTimesForEventInFuture1 = getDateTimesInFuture();
        const dateTimesForEventInFuture2 = getDateTimesInFuture();

        const venue = await createVenue(generateVenue(venueModel));

        const eventVerified = await createEvent(
            generateEvent(EventModel, venue.id, true), dateTimesForEventInFuture1);

        await createEvent(
            generateEvent(EventModel, venue.id, false), dateTimesForEventInFuture2);

        return server
            .get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200)
            .then(async (response) => {
                expect(response.body.status).toEqual('success');
                // should only get back 2 of the three events
                expect(response.body.events.length).toEqual(1);

                // should only have the verified event in the list
                expect(response.body.events.map(event => event.id)).toEqual([eventVerified.id]);

                done();
            });
    });

    it('returns only events in the future or recent past', async function () {
        const dateTimesForEventTooFarInPast = getDateTimesInPastBeyondWindow();
        const dateTimesForEventInFuture = getDateTimesInFuture();
        const dateTimesForEvenInPast = getDateTimesInPastButInsideWindow();

        // create a venue to associate the events with
        const venue = await createVenue(generateVenue(VenueModel));

        const eventInFuture = await createEvent(
            generateEvent(EventModel, venue.id, true), dateTimesForEventInFuture);

        const eventInRecentPast = await createEvent(generateEvent(EventModel, venue.id, true), dateTimesForEvenInPast);

        // event in distant past
        await createEvent(generateEvent(EventModel, venue.id, true), dateTimesForEventTooFarInPast);

        const expectedEventIdsReturned = [eventInRecentPast.id, eventInFuture.id];

        return server
            .get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200)
            .then(async (response) => {
                // should only get back 2 of the three events
                expect(response.body.events.length).toEqual(2);

                // should be the correct two events with oldest first
                const returnedIds = response.body.events.map(event => event.id);

                expect(returnedIds).toEqual(expectedEventIdsReturned);
            });
    });

    it('sorts multi-date events by most recent non-expired start-time', async () => {
        // order in this list shouldn't matter
        const multiDayDateTimes = [
            getDateTimePair(getTimePlusX(today, 11)),
            getDateTimePair(getTimePlusX(today, -47)),
            getDateTimePair(getTimePlusX(today, 6))
        ];

        const singleDayEventTimes1 = [
            getDateTimePair(getTimePlusX(today, 3))
        ];

        const singleDayEventTimes2 = [
            getDateTimePair(getTimePlusX(today, 7))
        ];

        // create a venue to associate the events with
        const venue = await createVenue(generateVenue(venueModel));

        const multiDayEvent = await createEvent(
            generateEvent(eventModel, venue.id, true), multiDayDateTimes);
        const singleDayEvent1 = await createEvent(
            generateEvent(eventModel, venue.id, true), singleDayEventTimes1
        );
        const singleDayEvent2 = await createEvent(
            generateEvent(eventModel, venue.id, true), singleDayEventTimes2
        );

        return server.get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200)
            .then(async (response) => {
                // should only get back 2 of the three events
                expect(response.body.events.length).toEqual(3);

                // should be the correct two events with oldest first
                expect(response.body.events.map(event => event.id))
                    .toEqual([
                        singleDayEvent1.id,
                        multiDayEvent.id,
                        singleDayEvent2.id
                    ]);
            });
    });

    it('filters expired events from multi-day events and finds correct first day/last day times', async () => {
        const firstDayTime = getDateTimePair(getTimePlusX(today, -eventWindow + 1));
        const secondDayTime = getDateTimePair(getTimePlusX(today, -eventWindow + 2));
        // order in this list shouldn't matter
        const multiDayDateTimes = [
            secondDayTime, // will show up
            getDateTimePair(getTimePlusX(today, -eventWindow - 1)),
            getDateTimePair(getTimePlusX(today, -eventWindow - 2)),
            firstDayTime // will show up
        ];

        const venue = await createVenue(generateVenue(venueModel));

        await createEvent(
            generateEvent(eventModel, venue.id, true), multiDayDateTimes);

        return server.get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200)
            .then(async (response) => {
                // should only get back 2 of the three events
                expect(response.body.events.length).toEqual(1);

                const event = response.body.events[0];
                const remainingTimes = event.date_times;

                expect(remainingTimes.length).toEqual(2);
                expect(new Date(remainingTimes[0].start_time)).toEqual(firstDayTime.start_time);
                expect(new Date(remainingTimes[1].start_time)).toEqual(secondDayTime.start_time);
                expect(new Date(event.first_day_start_time)).toEqual(firstDayTime.start_time);
                expect(new Date(event.last_day_end_time)).toEqual(secondDayTime.end_time);
            });
    });

    it('returns events with all expected field values', async () => {
        const futureTime = getDateTimePair(getTimePlusX(today, 1));
        const venue = await createVenue(generateVenue(venueModel));

        const dbEvent = await createEvent(
            generateEvent(eventModel, venue.id, true), [futureTime]);

        return server.get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200)
            .then(async (response) => {
                // should only get back 2 of the three events
                expect(response.body.events.length).toEqual(1);

                const event = response.body.events[0];

                // fields returned should match what was saved to the db
                expect(event.venue_id).toEqual(dbEvent.venue_id);
                expect(event.verified).toEqual(dbEvent.verified);
                expect(event.title).toEqual(dbEvent.title);
                expect(event.slug).toEqual(dbEvent.slug);
                expect(event.multi_day).toEqual(dbEvent.multi_day);
                expect(event.image).toEqual(dbEvent.image);
                expect(event.social_image).toEqual(dbEvent.social_image);
                expect(event.admission_fee).toEqual(dbEvent.admission_fee);
                expect(event.address).toEqual(dbEvent.address);
                expect(event.map_link).toEqual(dbEvent.map_link);
                expect(event.brief_description).toEqual(dbEvent.brief_description);
                expect(event.description).toEqual(dbEvent.description);
                expect(event.links).toEqual(dbEvent.links);
                expect(event.website_link).toEqual(dbEvent.website_link);
                expect(event.ticket_link).toEqual(dbEvent.ticket_link);
                expect(event.fb_event_link).toEqual(dbEvent.fb_event_link);
                expect(event.eventbrite_link).toEqual(dbEvent.eventbrite_link);
                expect(event.bitly_link).toEqual(dbEvent.bitly_link);
                expect(event.tags).toEqual(dbEvent.tags);
                expect(event.reviewed_by_org).toEqual(dbEvent.reviewed_by_org);

                // except this one should be empty for non-admins
                expect(event.organizer_contact).toBeUndefined();

                // check datetimes
               expect(event.date_times.length).toEqual(1)
               expect(new Date(event.date_times[0].start_time)).toEqual(futureTime.start_time)
               expect(new Date(event.date_times[0].end_time)).toEqual(futureTime.end_time)
            });
    });

    function getTimePlusX(time, deltaHours) {
        const incrementedTime = new Date(time);
        incrementedTime.setHours(incrementedTime.getHours() + deltaHours);

        return incrementedTime;
    }

    function getDateTimePair(startTime) {
        const startTimeCopy = new Date(startTime);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        return {
            start_time: startTimeCopy,
            end_time: endTime
        };
    }

    function getDateTimesInFuture() {
      const start_time = new Date(today);
      start_time.setDate(today.getDate() + 1);

      const end_time = new Date(start_time);
      end_time.setHours(start_time.getHours() + 1);

      return [{ start_time, end_time }];
    }

    function getDateTimesInPastBeyondWindow() {
        const start_time = new Date(today);
        start_time.setHours(start_time.getHours() - eventWindow - 1);

        const end_time = new Date(start_time);
        end_time.setHours(start_time.getHours() + 1);

        return [{
            start_time,
            end_time
        }];
    }

    function getDateTimesInPastButInsideWindow() {
        const start_time = new Date(today);
        start_time.setHours(start_time.getHours() - eventWindow + 1);

        const end_time = new Date(start_time);
        end_time.setHours(start_time.getHours() + 1);

        return [{
            start_time,
            end_time
        }];
    }

    async function createEvent(event: EventModel, startEndTimes: { start_time: Date, end_time: Date } []) {
        const eventCreated = await event.save();

        const requests = startEndTimes.map(async (startEndTimePair) => {
          const datetimeVenueEntry = generateDatetimeVenueFaker({
            event_id: event.id,
            venue_id: event.venue_id,
            start_time: startEndTimePair.start_time,
            end_time: startEndTimePair.end_time
          });

          return datetimeVenueEntry.save();
        });

        await Promise.all(requests);

        return eventCreated;
    }

    async function createVenue(venue: VenueModel) {
        return venueModel.create(venue.get({plain: true}));
    }

    async function deleteAllEvents() {
        return eventModel.destroy({where: {}});
    }

    async function deleteAllVenues() {
        venueModel.destroy({where: {}});
    }

  async function deleteAllDatetimeVenues() {
    datetimeVenueModel.destroy({where: {}});
  }
});
