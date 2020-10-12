import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {SequelizeModule} from "@nestjs/sequelize";
import {CurrentEventsModule} from "../src/current-events/current-events.module";
import {VenuesModule} from "../src/venues/venues.module";
import isNotNullOrUndefined from "../src/utils/is-not-null-or-undefined";
import {CurrentEvent} from "../src/current-events/dto/current-event.model";
// @ts-ignore
import { GenericContainer, StartedTestContainer } from "testcontainers";
import {Venue} from "../dist/venues/dto/venue.model";
import {CurrentEventsController} from "../src/current-events/current-events.controller";
import {CurrentEventsService} from "../src/current-events/current-events.service";
import * as request from "supertest";
import {AppModule} from "../src/app.module";
import {CURRENT_VERSION_URI} from "../src/utils/versionts";


const today = new Date(Date.now());
const eventWindow = 24; // maximum hours in past events will remain visible for
const apiUrl = 'http://localhost:3000/v1';

const DB_PORT = 5432;
const DB_USERNAME = 'foobar';
const DB_PASSWORD = 'foobar';
const DB_NAME = 'infinite'
const DB_HOST = 'localhost'
const TMP_FS = {"/temp_pgdata": "rw,noexec,nosuid,size=65536k"};

let app: INestApplication;
let dbContainer: StartedTestContainer;
let mappedDbPort: number

beforeEach(async (done) => {
    //await startDatabase()

    // const module: TestingModule = await Test.createTestingModule({
    //     imports: [
    //         SequelizeModule.forRoot({
    //             dialect: 'postgres',
    //             autoLoadModels: true,
    //             synchronize: true,
    //             host: DB_HOST,
    //             port: mappedDbPort,
    //             username: DB_USERNAME,
    //             password: DB_PASSWORD,
    //             database:DB_NAME,
    //             models: [CurrentEvent, Venue]
    //         }),
    //         VenuesModule,
    //         CurrentEventsModule
    //     ]
    // }).compile();

    // also kind of working (neither give access to our models though :-(
    const module: TestingModule =  await Test.createTestingModule({
        imports: [
            AppModule
        ]
    }).compile();

    // ok, kind of working :shrug:
    // const module: TestingModule = await Test.createTestingModule({
    //     imports: [
    //         SequelizeModule.forRoot({
    //             dialect: 'postgres',
    //             autoLoadModels: true,
    //             synchronize: true,
    //             host: 'localhost',
    //             port: 5438,
    //             username: 'postgres',
    //             password: 'xxx',
    //             database: 'infinite-api',
    //             models: [CurrentEvent, Venue]
    //         }),
    //         VenuesModule,
    //         CurrentEventsModule
    //     ]
    // }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }));

    await app.init();

    // Should be able to ask for CurrentEvent this way, but :shrug:
    const test: CurrentEventsService = module.get('CurrentEventsService');

    const grr  = test['currentEventModel'] as typeof CurrentEvent
    console.log('!!! go: ' + await grr.findAll())

    done()

}, 30000);

afterAll(async (done) => {
    console.log('!!! run afterall')

    if (isNotNullOrUndefined(app)) {
        await app.close();
    }

    if (isNotNullOrUndefined(dbContainer)) {
        await dbContainer.stop();
    }

    done()
}, 30000);

// async function startDatabase() {
//     console.log('!!! try to start the damn thing')
//     dbContainer = await new GenericContainer('postgres', '9.6.2-alpine')
//         .withExposedPorts(DB_PORT)
//         .withTmpFs(TMP_FS)
//         .withEnv('POSTGRES_USER', DB_USERNAME)
//         .withEnv('POSTGRES_PASSWORD', DB_PASSWORD)
//         .withEnv('POSTGRES_DB', DB_NAME)
//         .start();
//
//     console.log('!!! started the damn thing: ' + dbContainer.getMappedPort(DB_PORT))
//
//     mappedDbPort = dbContainer.getMappedPort(DB_PORT)
//
//
//     // require('dotenv').config()
//     // process.env.DB_PORT = mappedDbPort.toString()
// }

// beforeEach(async () => {
//   await deleteAllEvents()
//   await deleteAllVenues()
// })
//
// function deleteAllEvents() {
//   const test: unknown = module.get('UserModel')
// }
//
it('can query current-events', () => {
    console.log('!!! start test: ')

    return request(app.getHttpServer())
        .get(`/${CURRENT_VERSION_URI}/current-events/verified`)
        .expect(200)
});
//
// it('returns only verified events', async function() {
//   const dateTimesForEventInFuture1 = getDateTimesInFuture()
//   const dateTimesForEventInFuture2 = getDateTimesInFuture()
//
//   const venue = await createVenue(generateVenue())
//   const eventVerified = await createEvent(
//     generateEvent(venue.id, true, dateTimesForEventInFuture1))
//   const eventNonVerified = await createEvent(
//     generateEvent(venue.id, false, dateTimesForEventInFuture2))
//
//   return frisby.get(apiUrl + '/events/current/verified')
//     .expect('status', 200)
//     .then(async (response) => {
//       // should only get back 2 of the three events
//       expect(response.json.events.length).toEqual(1)
//
//       // should only have the verified event in the list
//       expect(response.json.events.map(event => event.id)).toEqual([eventVerified.id])
//     })
// })
//
// it('returns only events in the future or recent past', async function() {
//   const dateTimesForEventTooFarInPast = getDateTimesInPastBeyondWindow()
//   const dateTimesForEventInFuture = getDateTimesInFuture()
//   const dateTimesForEvenInPast = getDateTimesInPastButInsideWindow()
//
//   // create a venue tRo associate the events with
//   const venue = await createVenue(generateVenue())
//
//   const eventInFuture = await createEvent(
//     generateEvent(venue.id, true, dateTimesForEventInFuture))
//   const eventInRecentPast = await createEvent(generateEvent(venue.id, true, dateTimesForEvenInPast))
//   const eventInDistantPast = await createEvent(generateEvent(venue.id, true, dateTimesForEventTooFarInPast))
//
//   return frisby.get(apiUrl + '/events/current/verified')
//     .expect('status', 200)
//     .then(async (response) => {
//       // should only get back 2 of the three events
//       expect(response.json.events.length).toEqual(2)
//
//       // should be the correct two events with oldest first
//       expect(response.json.events.map(event => event.id)).toEqual([eventInRecentPast.id, eventInFuture.id])
//     })
// })
//
// it('sorts multi-date events by most recent non-expired start-time', async () => {
//   // order in this list shouldn't matter
//   const multiDayDateTimes = [,
//     getDateTimePair(getTimePlusX(today, 11)),
//     getDateTimePair(getTimePlusX(today, -47)),
//     getDateTimePair(getTimePlusX(today, 6))
//   ]
//
//   const singleDayEventTimes1 = [
//     getDateTimePair(getTimePlusX(today, 3))
//   ]
//
//   const singleDayEventTimes2 = [
//     getDateTimePair(getTimePlusX(today, 7))
//   ]
//
//   // create a venue to associate the events with
//   const venue = await createVenue(generateVenue())
//
//   const multiDayEvent = await createEvent(
//     generateEvent(venue.id, true, multiDayDateTimes))
//   const singleDayEvent1 = await createEvent(
//     generateEvent(venue.id, true, singleDayEventTimes1)
//   )
//   const singleDayEvent2 = await createEvent(
//     generateEvent(venue.id, true, singleDayEventTimes2)
//   )
//
//   return frisby.get(apiUrl + '/events/current/verified')
//     .expect('status', 200)
//     .then(async (response) => {
//       // should only get back 2 of the three events
//       expect(response.json.events.length).toEqual(3)
//
//       // should be the correct two events with oldest first
//       expect(response.json.events.map(event => event.id))
//         .toEqual([
//           singleDayEvent1.id,
//           multiDayEvent.id,
//           singleDayEvent2.id
//         ])
//     })
// })
//
// it('filters expired events from multi-day events and finds correct first day/last day times', async () => {
//   const firstDayTime =  getDateTimePair(getTimePlusX(today, -eventWindow + 1))
//   const secondDayTime = getDateTimePair(getTimePlusX(today, -eventWindow + 2))
//   // order in this list shouldn't matter
//   const multiDayDateTimes = [
//     secondDayTime, // will show up
//     getDateTimePair(getTimePlusX(today, -eventWindow - 1)),
//     getDateTimePair(getTimePlusX(today, -eventWindow - 2)),
//     firstDayTime // will show up
//   ]
//
//   const venue = await createVenue(generateVenue())
//
//   await createEvent(
//     generateEvent(venue.id, true, multiDayDateTimes))
//
//   return frisby.get(apiUrl + '/events/current/verified')
//     .expect('status', 200)
//     .then(async (response) => {
//       // should only get back 2 of the three events
//       expect(response.json.events.length).toEqual(1)
//
//       const event = response.json.events[0]
//       const remainingTimes = event.date_times
//
//       expect(remainingTimes.length).toEqual(2)
//       expect(remainingTimes[0].start_time).toEqual(firstDayTime.start_time)
//       expect(remainingTimes[1].start_time).toEqual(secondDayTime.start_time)
//       expect(event.first_day_start_time).toEqual(firstDayTime.start_time)
//       expect(event.last_day_end_time).toEqual(secondDayTime.end_time)
//     })
// })
//
// it('returns events with all expected field values', async () => {
//   const futureTime = getDateTimePair(getTimePlusX(today, 1))
//   const venue = await createVenue(generateVenue())
//
//   const dbEvent = await createEvent(
//     generateEvent(venue.id, true, [futureTime]))
//
//   return frisby.get(apiUrl + '/events/current/verified')
//     .expect('status', 200)
//     .then(async (response) => {
//       // should only get back 2 of the three events
//       expect(response.json.events.length).toEqual(1)
//
//       const event = response.json.events[0]
//
//       // fields returned should match what was saved to the db
//       expect(event.uuid).toEqual(dbEvent.uuid)
//       expect(event.venue_id).toEqual(dbEvent.venue_id)
//       expect(event.verified).toEqual(dbEvent.verified)
//       expect(event.title).toEqual(dbEvent.title)
//       expect(event.slug).toEqual(dbEvent.slug)
//       expect(event.multi_day).toEqual(dbEvent.multi_day)
//       expect(event.date_times).toEqual(dbEvent.date_times)
//       expect(event.image).toEqual(dbEvent.image)
//       expect(event.social_image).toEqual(dbEvent.social_image)
//       expect(event.admission_fee).toEqual(dbEvent.admission_fee)
//       expect(event.address).toEqual(dbEvent.address)
//       expect(event.map_link).toEqual(dbEvent.map_link)
//       expect(event.brief_description).toEqual(dbEvent.brief_description)
//       expect(event.description).toEqual(dbEvent.description)
//       expect(event.links).toEqual(dbEvent.links)
//       expect(event.website_link).toEqual(dbEvent.website_link)
//       expect(event.ticket_link).toEqual(dbEvent.ticket_link)
//       expect(event.fb_event_link).toEqual(dbEvent.fb_event_link)
//       expect(event.eventbrite_link).toEqual(dbEvent.eventbrite_link)
//       expect(event.bitly_link).toEqual(dbEvent.bitly_link)
//       expect(event.tags).toEqual(dbEvent.tags)
//       expect(event.reviewed_by_org).toEqual(dbEvent.reviewed_by_org)
//
//       // except this one should be empty for non-admins
//       expect(event.organizer_contact).toBeUndefined()
//     })
// })
//
// function getTimePlusX(time, deltaHours) {
//   const incrementedTime = new Date(time)
//   incrementedTime.setHours(incrementedTime.getHours() + deltaHours)
//
//   return incrementedTime
// }
//
// function getDateTimePair(startTime) {
//   const startTimeCopy = new Date(startTime)
//   const endTime = new Date(startTime)
//   endTime.setHours(endTime.getHours() + 1)
//
//   return {
//     start_time: startTimeCopy.toISOString(),
//     end_time: endTime.toISOString()
//   }
// }
//
// function getDateTimesInFuture() {
//   const startTime = new Date(today)
//   startTime.setDate(today.getDate() + 1)
//
//   const endTime = new Date(startTime)
//   endTime.setHours(startTime.getHours() + 1)
//
//   return [{
//     start_time: startTime.toISOString(),
//     end_time: endTime.toISOString()
//   }]
// }
//
// function getDateTimesInPastBeyondWindow() {
//   const startTime = new Date(today)
//   startTime.setHours(startTime.getHours() - eventWindow -1)
//
//   const endTime = new Date(startTime)
//   endTime.setHours(startTime.getHours() + 1)
//
//   return [{
//     start_time: startTime.toISOString(),
//     end_time: endTime.toISOString()
//   }]
// }
//
// function getDateTimesInPastButInsideWindow() {
//   const startTime = new Date(today)
//   startTime.setHours(startTime.getHours() - eventWindow + 1)
//
//   const endTime = new Date(startTime)
//   endTime.setHours(startTime.getHours() + 1)
//
//   return [{
//     start_time: startTime.toISOString(),
//     end_time: endTime.toISOString()
//   }]
// }
