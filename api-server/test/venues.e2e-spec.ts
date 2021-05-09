import startDatabase from "./test-helpers/e2e-stack/start-database";
import runMigrations from "./test-helpers/e2e-stack/run-migrations";
import startApplication from "./test-helpers/e2e-stack/start-application";
import buildDbConnectionsForTests from "./test-helpers/e2e-stack/build-db-connection-for-tests";
import killApp from "./test-helpers/e2e-stack/kill-app";
import stopDatabase from "./test-helpers/e2e-stack/stop-database";
import isNotNullOrUndefined from "../src/utils/is-not-null-or-undefined";
import * as request from "supertest";
import {ChildProcessWithoutNullStreams} from "child_process";
import {StartedTestContainer} from "testcontainers";
import {TestingModule} from "@nestjs/testing";
import {VenueModel} from "../src/venues/models/venue.model";
import {CreateVenueRequest} from "../src/venues/dto/create-update-venue-request";
import {v4 as uuidv4} from 'uuid';
import * as faker from 'faker';
import getSlug from "../src/utils/get-slug";
import {CURRENT_VERSION_URI} from "../src/utils/versionts";

const APP_PORT = process.env.PORT || 3003;
const server = request('http://localhost:' + APP_PORT);

let appUnderTest: ChildProcessWithoutNullStreams;
let dbContainer: StartedTestContainer;

let venueModel: typeof VenueModel;
let testingModule: TestingModule

let dbHostPort: number;

describe('Venues (e2e)', () => {
    beforeAll(async (done) => {
        console.info('preparing for test suite -- Venues');

        const dbInfo = await startDatabase();

        dbContainer = dbInfo.dbContainer;
        dbHostPort = dbInfo.dbHostPort;

        await runMigrations(dbHostPort);

        appUnderTest = await startApplication(dbHostPort);

        const databaseModels = await buildDbConnectionsForTests(dbHostPort);

        venueModel = databaseModels.venueModel;
        testingModule = databaseModels.testingModule

        console.info('test suite ready');

        done();
    }, 30000);

    afterAll(async (done) => {
        console.info('begin cleanup for announcements')

        await killApp(appUnderTest);

        if (appUnderTest) {
            appUnderTest.removeAllListeners()
        }

        await stopDatabase(dbContainer);

        if (isNotNullOrUndefined(testingModule))
            await testingModule.close();

        console.info('done cleaning up for announcements')
        done();
    })

    beforeEach(async () => {
        await deleteAllAnnouncements()
    })

    it('[GET]/venues should return all non-soft deleted venues when no flags are passed', async (done) => {
        const { activeVenues } = await createRandomMixOfDeletedAndNonDeletedVenues();

        return server
            .get(`/${CURRENT_VERSION_URI}/venues`)
            .expect(200)
            .then(async (response) => {
                expect(response.body.status).toEqual('success');

                const responseVenueIds = response.body.venues.map(venue => venue.id);
                const expectedIds = activeVenues.map(venue => venue.id);
                expectIdsEqualInAnyOrder(responseVenueIds, expectedIds);

                done();
            });
    });

    it('[GET]/venues?includeDeleted=true should return all venues including soft-deleted when appropriate flag is passed', async (done) => {
        const { activeVenues, deletedVenues } = await createRandomMixOfDeletedAndNonDeletedVenues();

        return server
            .get(`/${CURRENT_VERSION_URI}/venues?includeDeleted=true`)
            .expect(200)
            .then(async (response) => {
                expect(response.body.status).toEqual('success');

                const responseVenueIds = response.body.venues.map(venue => venue.id);

                const expectedIds = [
                    ...activeVenues.map(venue => venue.id),
                    ...deletedVenues.map(venue => venue.id)
                ];

                expectIdsEqualInAnyOrder(responseVenueIds, expectedIds);

                done();
            });
    })

    async function createRandomMixOfDeletedAndNonDeletedVenues()
        : Promise<{ activeVenues: VenueModel[], deletedVenues: VenueModel[] }>
    {
        const nonDeletedVenue1: VenueModel = await insertVenue(generateRandomCreateVenueRequest());
        const nonDeletedVenue2: VenueModel = await insertVenue(generateRandomCreateVenueRequest());
        const nonDeletedVenue3: VenueModel = await insertVenue(generateRandomCreateVenueRequest());

        const deletedVenue1: VenueModel = await insertVenue(generateRandomCreateVenueRequest(), true);
        const deletedVenue2: VenueModel = await insertVenue(generateRandomCreateVenueRequest(), true);

        return {
            activeVenues: [nonDeletedVenue1, nonDeletedVenue2, nonDeletedVenue3],
            deletedVenues: [deletedVenue1, deletedVenue2]
        }
    }

    function expectIdsEqualInAnyOrder(actualIds: string[], expectedIds) {
        expect(actualIds.length).toEqual(expectedIds.length);

        for (let i = 0; i < expectedIds.length; i++) {
            const expecctedId = expectedIds[i];
            expect(actualIds).toContain(expecctedId);
        }
    }

    function deleteAllAnnouncements(): Promise<number> {
        return venueModel.destroy({ where: {} })
    }

    function insertVenue(venue: CreateVenueRequest, isSoftDeleted = false): Promise<VenueModel> {
        const id = uuidv4();
        const slug = getSlug(venue.name);

        return venueModel.create({...venue, id, slug, is_soft_deleted: isSoftDeleted })
    }

    function generateRandomCreateVenueRequest(overrides: Partial<CreateVenueRequest> = {}) {
        return {
            name: faker.company.companyName(),
            address: faker.address.streetAddress(),
            g_map_link: faker.random.uuid(),
            ...overrides
        }
    }
});

/*
TODO CAW -- Test create; test update; test delete; test can't hit update or delete unauthenticated
 */
