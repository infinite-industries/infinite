import startDatabase from "./test-helpers/e2e-stack/start-database";
import runMigrations from "./test-helpers/e2e-stack/run-migrations";
import startApplication from "./test-helpers/e2e-stack/start-application";
import * as request from "supertest";
import {ChildProcessWithoutNullStreams} from "child_process";
import {StartedTestContainer} from "testcontainers";
import {TestingModule} from "@nestjs/testing";
import killApp from "./test-helpers/e2e-stack/kill-app";
import stopDatabase from "./test-helpers/e2e-stack/stop-database";
import isNotNullOrUndefined from "../src/utils/is-not-null-or-undefined";


const APP_PORT = process.env.PORT || 3003;
const server = request('http://localhost:' + APP_PORT);

let appUnderTest: ChildProcessWithoutNullStreams;
let dbContainer: StartedTestContainer;

let testingModule: TestingModule

let dbHostPort: number;

describe("Version (e2e)", () => {
    beforeAll(async (done) => {
        console.info('preparing for test suite -- Versions');

        const dbInfo = await startDatabase();

        dbContainer = dbInfo.dbContainer;
        dbHostPort = dbInfo.dbHostPort;

        await runMigrations(dbHostPort);

        appUnderTest = await startApplication(dbHostPort);

        console.info('test suite ready');

        done();
    }, 30000);

    afterAll(async (done) => {
        console.info('begin cleanup for versions')

        await killApp(appUnderTest);

        appUnderTest.removeAllListeners()

        await stopDatabase(dbContainer);

        if (isNotNullOrUndefined(testingModule))
            await testingModule.close();

        console.info('done cleaning up for versions')
        done();
    })

    it('can query version information', async function () {

        return server.get(`/version`)
            .expect(200)
            .then(async (response) => {
                // should only get back 2 of the three events
                expect(response.body).toEqual({
                   version: 'v1',
                   supportedVersions: ['v1']
                });
            })
    })

})

