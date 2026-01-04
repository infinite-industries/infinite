import request from 'supertest';
import { PORT } from '../src/constants';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { PartnerModel } from '../src/users/models/partner.model';
import { TestingModule } from '@nestjs/testing';
import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { afterAllStackShutdown } from './test-helpers/after-all-stack-shutdown';
import { v4 as uuidv4 } from 'uuid';

describe('Partners API (e2e)', () => {
  const server = request('http://localhost:' + PORT);

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let partnerModel: typeof PartnerModel;
  let testingModule: TestingModule;

  let dbHostPort: number;

  beforeAll(async () => {
    console.info('preparing Partners API test suite');

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    partnerModel = databaseModels.partnerModel;

    testingModule = databaseModels.testingModule;

    console.log('Partners API test suite ready');

    return Promise.resolve();
  }, 30000);

  afterEach(async () => {
    await partnerModel.destroy({ where: {} });

    return Promise.resolve();
  });

  afterAll(
    async () => afterAllStackShutdown(appUnderTest, dbContainer, testingModule),
    30000,
  );

  it('/partners/name/{name} should return a partner when found', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Test Partner Organization',
      light_logo_url: 'https://example.com/logo-light.png',
      dark_logo_url: 'https://example.com/logo-dark.png',
    });

    return server
      .get(
        `/${CURRENT_VERSION_URI}/partners/name/${encodeURIComponent(
          partner.name,
        )}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toHaveProperty('id', partner.id);
        expect(body).toHaveProperty('name', partner.name);
        expect(body).toHaveProperty('light_logo_url', partner.light_logo_url);
        expect(body).toHaveProperty('dark_logo_url', partner.dark_logo_url);
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
      });
  });

  it('/partners/name/{name} should return 404 when partner not found', async () => {
    const nonExistentName = 'Non Existent Partner';

    return server
      .get(
        `/${CURRENT_VERSION_URI}/partners/name/${encodeURIComponent(
          nonExistentName,
        )}`,
      )
      .expect(404)
      .then(async ({ body }) => {
        expect(body.message).toContain(
          `Partner with name "${nonExistentName}" not found`,
        );
      });
  });

  it('/partners/name/{name} should handle URL-encoded partner names', async () => {
    // Create a partner with special characters in the name
    const partnerName = 'TechCorp & Associates LLC';
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: partnerName,
      light_logo_url: 'https://example.com/techcorp-logo-light.png',
      dark_logo_url: 'https://example.com/techcorp-logo-dark.png',
    });

    return server
      .get(
        `/${CURRENT_VERSION_URI}/partners/name/${encodeURIComponent(
          partnerName,
        )}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toHaveProperty('id', partner.id);
        expect(body).toHaveProperty('name', partnerName);
        expect(body).toHaveProperty('light_logo_url', partner.light_logo_url);
        expect(body).toHaveProperty('dark_logo_url', partner.dark_logo_url);
      });
  });

  it('/partners/name/{name} should handle partner names with spaces', async () => {
    // Create a partner with spaces in the name
    const partnerName = 'Global Tech Solutions Inc';
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: partnerName,
      light_logo_url: 'https://example.com/global-tech-logo-light.png',
      dark_logo_url: 'https://example.com/global-tech-logo-dark.png',
    });

    return server
      .get(
        `/${CURRENT_VERSION_URI}/partners/name/${encodeURIComponent(
          partnerName,
        )}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toHaveProperty('id', partner.id);
        expect(body).toHaveProperty('name', partnerName);
        expect(body).toHaveProperty('light_logo_url', partner.light_logo_url);
        expect(body).toHaveProperty('dark_logo_url', partner.dark_logo_url);
      });
  });

  it('/partners/name/{name} should not require authentication', async () => {
    // Create a partner
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Public Partner',
      light_logo_url: 'https://example.com/public-logo-light.png',
      dark_logo_url: 'https://example.com/public-logo-dark.png',
    });

    // Test without any authentication headers
    return server
      .get(
        `/${CURRENT_VERSION_URI}/partners/name/${encodeURIComponent(
          partner.name,
        )}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toHaveProperty('id', partner.id);
        expect(body).toHaveProperty('name', partner.name);
        expect(body).toHaveProperty('light_logo_url', partner.light_logo_url);
        expect(body).toHaveProperty('dark_logo_url', partner.dark_logo_url);
      });
  });

  it('/partners/name/{name} should return partner with null logo URLs when not set', async () => {
    // Create a partner without logo URLs
    const partner = await partnerModel.create({
      id: uuidv4(),
      name: 'Partner Without Logo',
      light_logo_url: null,
      dark_logo_url: null,
    });

    return server
      .get(
        `/${CURRENT_VERSION_URI}/partners/name/${encodeURIComponent(
          partner.name,
        )}`,
      )
      .expect(200)
      .then(async ({ body }) => {
        expect(body).toHaveProperty('id', partner.id);
        expect(body).toHaveProperty('name', partner.name);
        expect(body).toHaveProperty('light_logo_url', null);
        expect(body).toHaveProperty('dark_logo_url', null);
      });
  });
});
