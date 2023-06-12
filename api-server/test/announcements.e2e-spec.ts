import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import * as request from 'supertest';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { TestingModule } from '@nestjs/testing';
import { AnnouncementModel } from '../src/announcements/models/announcement.model';
import killApp from './test-helpers/e2e-stack/kill-app';
import stopDatabase from './test-helpers/e2e-stack/stop-database';
import isNotNullOrUndefined from '../src/utils/is-not-null-or-undefined';
import { CreateOrUpdateAnnouncementRequest } from '../src/announcements/dto/create-or-update-announcement-request';
import generateAnnouncementRequest from './fakers/announcement.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { v4 as uuidv4 } from 'uuid';
import { PORT } from '../src/constants';

const server = request('http://localhost:' + PORT);

let appUnderTest: ChildProcessWithoutNullStreams;
let dbContainer: StartedTestContainer;

let announcementModel: typeof AnnouncementModel;
let testingModule: TestingModule;

let dbHostPort: number;

describe('Announcements (e2e)', () => {
  beforeAll(async () => {
    console.info('preparing for test suite -- Announcements');

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    announcementModel = databaseModels.announcementModel;
    testingModule = databaseModels.testingModule;

    console.info('test suite ready');

    return Promise.resolve();
  }, 30000);

  afterAll(async () => {
    console.info('begin cleanup for announcements');

    await killApp(appUnderTest);

    appUnderTest.removeAllListeners();

    await stopDatabase(dbContainer);

    if (isNotNullOrUndefined(testingModule)) await testingModule.close();

    console.info('done cleaning up for announcements');
    return Promise.resolve();
  });

  beforeEach(async () => {
    await deleteAllAnnouncements();
  });

  it('can query all announcements', async function () {
    const announcement1 = await createAnnouncement(
      generateAnnouncementRequest(),
    );
    const announcement2 = await createAnnouncement(
      generateAnnouncementRequest(),
    );

    return server
      .get(`/${CURRENT_VERSION_URI}/announcements`)
      .expect(200)
      .then(async (response) => {
        // should only get back 2 of the three events
        expect(response.body.announcements.length).toEqual(2);

        expect(response.body.announcements[0].message).toEqual(
          announcement1.message,
        );
        expect(response.body.announcements[1].message).toEqual(
          announcement2.message,
        );
      });
  });

  function createAnnouncement(
    announcement: CreateOrUpdateAnnouncementRequest,
  ): Promise<AnnouncementModel> {
    return announcementModel.create({ ...announcement, id: uuidv4() });
  }

  function deleteAllAnnouncements(): Promise<number> {
    return announcementModel.destroy({ where: {} });
  }
});
