import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {SequelizeModule} from "@nestjs/sequelize";
import {CurrentEventsModule} from "../src/current-events/current-events.module";
import {VenuesModule} from "../src/venues/venues.module";
import isNotNullOrUndefined from "../src/utils/is-not-null-or-undefined";
import {CurrentEvent} from "../src/current-events/dto/current-event.model";
// @ts-ignore
import {GenericContainer, StartedTestContainer, Wait} from "testcontainers";
import {Venue} from "../dist/venues/dto/venue.model";
import {CurrentEventsController} from "../src/current-events/current-events.controller";
import {CurrentEventsService} from "../src/current-events/current-events.service";
import * as request from "supertest";
import {AppModule} from "../src/app.module";
import {CURRENT_VERSION_URI} from "../src/utils/versionts";
import {VenuesService} from "../src/venues/venues.service";
import {Event} from '../src/events/models/event.model';
import {EventsService} from "../src/events/events.service";
import generateEvent from "../src/fakers/event.faker";
import generateVenue from "../src/fakers/venue.faker";
import {ChildProcessWithoutNullStreams, execSync, spawn} from "child_process";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const today = new Date(Date.now());
const eventWindow = 24; // maximum hours in past events will remain visible for

const APP_PORT = process.env.PORT || 3003
const server = request('http://localhost:' + APP_PORT)

const DB_INTERNAL_PORT = 5432
const TMP_FS = { "/temp_pgdata": "rw,noexec,nosuid,size=65536k" }
const DB_USERNAME = 'infinite'
const DB_PASSWORD = 'infinite'
const DB_NAME = 'infinite'
const DB_HOST = 'localhost'

let appUnderTest: ChildProcessWithoutNullStreams
let dbContainer: StartedTestContainer;
let eventModel: typeof Event
let venueModel: typeof Venue
let dbHostPort: number

describe('CurrentEvents (e2e)', () => {
    beforeAll(async (done) => {
        console.info('preparing for test suite')

        await startDatabase()

        runMigrations()

        await startApplication()

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    autoLoadModels: true,
                    synchronize: true,
                    host: DB_HOST,
                    port: dbHostPort,
                    username: DB_USERNAME,
                    password: DB_PASSWORD,
                    database:DB_NAME,
                    models: [CurrentEvent, Venue, Event]
                }),
                SequelizeModule.forFeature([Event, Venue, CurrentEvent])
            ],
            providers: [
                EventsService,
                VenuesService,
                CurrentEventsService
            ]
        }).compile()

        eventModel = module.get('EventRepository') as typeof Event
        venueModel = module.get('VenueRepository');

        console.log('test suite ready')

        done();
    }, 60000);

    afterAll(async (done) => {
        if (isNotNullOrUndefined(appUnderTest)) {
            await killApp()
        }

        if (isNotNullOrUndefined(dbContainer)) {
            await dbContainer.stop();
        }

        done()
    }, 30000);

    beforeEach(async (done) => {
        console.info('preparing for test')

        if (eventModel)
            await deleteAllEvents()

        if (venueModel)
            await deleteAllVenues();

        done();
    });


    it('can query current-events', async () => {
        console.info('running first test: ' +
            `http://localhost:${APP_PORT}/${CURRENT_VERSION_URI}/current-events/verified`)

        return server
            .get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200);
    });

    it('returns only verified events', async function (done) {
        const dateTimesForEventInFuture1 = getDateTimesInFuture();
        const dateTimesForEventInFuture2 = getDateTimesInFuture();

        const venue = await createVenue(generateVenue(Venue));

        const eventVerified = await createEvent(
            generateEvent(Event, venue.id, true, dateTimesForEventInFuture1));
        await createEvent(
            generateEvent(Event, venue.id, false, dateTimesForEventInFuture2));

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

        // create a venue tRo associate the events with
        const venue = await createVenue(generateVenue(Venue));

        const eventInFuture = await createEvent(
            generateEvent(Event, venue.id, true, dateTimesForEventInFuture));
        const eventInRecentPast = await createEvent(generateEvent(Event, venue.id, true, dateTimesForEvenInPast));

        // event in distant past
        await createEvent(generateEvent(Event, venue.id, true, dateTimesForEventTooFarInPast));

        const expectedEventIdsReturned = [eventInRecentPast.id, eventInFuture.id]

        return server
            .get(`/${CURRENT_VERSION_URI}/current-events/verified`)
            .expect(200)
            .then(async (response) => {
                // should only get back 2 of the three events
                expect(response.body.events.length).toEqual(2);

                // should be the correct two events with oldest first
                const returnedIds = response.body.events.map(event => event.id)

                expect(returnedIds).toEqual(expectedEventIdsReturned);
            });
    });

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

    function getTimePlusX(time, deltaHours) {
        const incrementedTime = new Date(time)
        incrementedTime.setHours(incrementedTime.getHours() + deltaHours)

        return incrementedTime
    }

    function getDateTimePair(startTime) {
        const startTimeCopy = new Date(startTime)
        const endTime = new Date(startTime)
        endTime.setHours(endTime.getHours() + 1)

        return {
            start_time: startTimeCopy.toISOString(),
            end_time: endTime.toISOString()
        }
    }

    function getDateTimesInFuture() {
        const startTime = new Date(today);
        startTime.setDate(today.getDate() + 1);

        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        return [{
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        }];
    }

    function getDateTimesInPastBeyondWindow() {
        const startTime = new Date(today);
        startTime.setHours(startTime.getHours() - eventWindow - 1);

        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        return [{
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        }];
    }

    function getDateTimesInPastButInsideWindow() {
        const startTime = new Date(today);
        startTime.setHours(startTime.getHours() - eventWindow + 1);

        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        return [{
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
        }];
    }

    async function createEvent(event: Event) {
        return event.save();
    }

    async function deleteEvent(event: Event) {
        return event.destroy();
    }

    async function createVenue(venue: Venue) {
        return venueModel.create(venue.get({ plain: true}));
    }

    async function deleteVeneu(venue: Venue) {
        return venueModel.destroy({ where: { id: venue.id }})
    }

    async function deleteAllEvents() {
        return eventModel.destroy({where: {}});
    }

    async function deleteAllVenues() {
        venueModel.destroy({where: {}});
    }

    async function startDatabase() {
        console.info('starting a database for e2e tests')

        const databaseReadyMessage = 'database system is ready to accept connections'

        dbContainer = await new GenericContainer('postgres', '9.6.2-alpine')
            .withExposedPorts(DB_INTERNAL_PORT)
            .withTmpFs(TMP_FS)
            .withEnv('POSTGRES_USER', DB_USERNAME)
            .withEnv('POSTGRES_PASSWORD', DB_PASSWORD)
            .withEnv('POSTGRES_DB', DB_NAME)
            .withWaitStrategy(Wait.forLogMessage(databaseReadyMessage))
            .start();

        dbHostPort = dbContainer.getMappedPort(DB_INTERNAL_PORT)
        console.info('database running on port: ' + dbHostPort)
    }

    async function startApplication() {
        const appReadyMessage = 'Nest application successfully started'
        const timeOut = 10000

        appUnderTest = spawn('node', ['/home/chris/projects/infinite/api-server-nest/dist/main'],  {
            env: {
                ...process.env,
                DB_HOST,
                DB_PORT: dbHostPort + '',
                DB_USER_NAME: DB_USERNAME,
                DB_PASSWORD,
                DB_NAME
            }
        });

        console.info(`waiting on app ${appUnderTest.pid} to finnish loading`)

        return new Promise((resolve, reject) => {
            appUnderTest.stdout.on('data', (data) => {
                console.log(`running-app -> ${data}`);

                if (data && data.indexOf(appReadyMessage) >= 0) {
                    console.log('the app is ready')
                    resolve()
                }
            });

            appUnderTest.stderr.on('data', (data) => {
                console.error(`running-app -> ${data}`);
            });

            setTimeout(() => reject(new Error('timed out waiting on app to start')), timeOut)
        })
    }

    function killApp(): Promise<void> {
        console.log('stopping the test app')
        return new Promise(resolve => {
            appUnderTest.stdout.removeAllListeners()
            appUnderTest.stderr.removeAllListeners()

            appUnderTest.on('exit', (code) => {
                appUnderTest.removeAllListeners()

                console.log(`child process exited with code ${code}`);
                resolve()
            })

            appUnderTest.kill('SIGINT')
        })
    }

    function runMigrations() {
        console.log('running migrations')

        const numTries = 5

        let finalEx: Error | null = null

        for (let i = 0; i < numTries; i++) {
            try {
                _doRunMigration()

                finalEx = null

                break
            } catch (ex) {
                finalEx = ex
            }
        }

        function _doRunMigration() {
            execSync('npm run db:migrate', {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    DB_HOST,
                    DB_PORT: dbHostPort + '',
                    DB_USER_NAME: DB_USERNAME,
                    DB_PASSWORD,
                    DB_NAME
                }
            })

            if (finalEx !== null) {
                throw new Error('failed to run migrations: ' + finalEx)
        }}

        console.log('migrations complete')
    }

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
})
