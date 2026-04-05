import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import request from 'supertest';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { TestingModule } from '@nestjs/testing';
import { VenueModel } from '../src/venues/models/venue.model';
import { PartnerModel } from '../src/users/models/partner.model';
import killApp from './test-helpers/e2e-stack/kill-app';
import stopDatabase from './test-helpers/e2e-stack/stop-database';
import isNotNullOrUndefined from '../src/utils/is-not-null-or-undefined';
import generatePartnerRequest from './fakers/partner.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { v4 as uuidv4 } from 'uuid';
import { PORT } from '../src/constants';
import createJwtForRandomUser from './test-helpers/creaeteJwt';
import faker from 'faker';
import getSlug from '../src/utils/get-slug';

describe('Venues Authenticated (e2e)', () => {
  const server = request('http://localhost:' + PORT);

  const ASSOCIATE_ENDPOINT = `/${CURRENT_VERSION_URI}/authenticated/venues/partner-associate`;
  const DISASSOCIATE_ENDPOINT = `/${CURRENT_VERSION_URI}/authenticated/venues/partner-disassociate`;

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let venueModel: typeof VenueModel;
  let partnerModel: typeof PartnerModel;
  let testingModule: TestingModule;

  let dbHostPort: number;

  beforeAll(async () => {
    console.info('preparing for test suite -- Venues Authenticated');

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    venueModel = databaseModels.venueModel;
    partnerModel = databaseModels.partnerModel;
    testingModule = databaseModels.testingModule;

    console.info('test suite ready');

    return Promise.resolve();
  }, 30000);

  afterAll(async () => {
    console.info('begin cleanup for venues authenticated');

    await killApp(appUnderTest);

    if (appUnderTest) {
      appUnderTest.removeAllListeners();
    }

    await stopDatabase(dbContainer);

    if (isNotNullOrUndefined(testingModule)) await testingModule.close();

    console.info('done cleaning up for venues authenticated');
    return Promise.resolve();
  });

  beforeEach(async () => {
    await deleteAllVenuesAndPartners();
  });

  describe('POST /authenticated/venues/partner-associate', () => {
    it('should return 403 when user is not authenticated', async () => {
      return server
        .post(ASSOCIATE_ENDPOINT)
        .send({ venue_id: uuidv4(), partner_id: uuidv4() })
        .expect(403);
    });

    it('should return 403 when user is authenticated but not admin', async () => {
      const nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      return server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': nonAdminToken })
        .send({ venue_id: uuidv4(), partner_id: uuidv4() })
        .expect(403);
    });

    it('should return 404 when venue does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const partner = await createPartner();

      return server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: uuidv4(), partner_id: partner.id })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Venue with ID');
          expect(response.body.message).toContain('not found');
        });
    });

    it('should return 404 when partner does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const venue = await createVenue();

      return server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: uuidv4() })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Partner with ID');
          expect(response.body.message).toContain('not found');
        });
    });

    it('should successfully associate a venue with a partner', async () => {
      const adminToken = await createJwtForRandomUser();
      const venue = await createVenue();
      const partner = await createPartner();

      return server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: partner.id })
        .expect(201)
        .then(async (response) => {
          expect(response.body.status).toEqual('success');
          expect(response.body.message).toContain('successfully associated');
          expect(response.body.message).toContain(venue.id);
          expect(response.body.message).toContain(partner.id);

          const venueWithPartners = await venueModel.findByPk(venue.id, {
            include: [
              {
                model: PartnerModel,
                as: 'partners',
                through: { attributes: [] },
              },
            ],
          });

          expect(venueWithPartners.partners).toHaveLength(1);
          expect(venueWithPartners.partners[0].id).toEqual(partner.id);
        });
    });

    it('should return 409 when association already exists', async () => {
      const adminToken = await createJwtForRandomUser();
      const venue = await createVenue();
      const partner = await createPartner();

      await server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: partner.id })
        .expect(201);

      return server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: partner.id })
        .expect(409)
        .then((response) => {
          expect(response.body.message).toContain('already associated');
        });
    });

    it('should return 400 for invalid UUID format', async () => {
      const adminToken = await createJwtForRandomUser();

      return server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: 'invalid-uuid', partner_id: 'invalid-uuid' })
        .expect(400);
    });
  });

  describe('POST /authenticated/venues/partner-disassociate', () => {
    it('should return 403 when user is not authenticated', async () => {
      return server
        .post(DISASSOCIATE_ENDPOINT)
        .send({ venue_id: uuidv4(), partner_id: uuidv4() })
        .expect(403);
    });

    it('should return 403 when user is authenticated but not admin', async () => {
      const nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      return server
        .post(DISASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': nonAdminToken })
        .send({ venue_id: uuidv4(), partner_id: uuidv4() })
        .expect(403);
    });

    it('should return 404 when venue does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const partner = await createPartner();

      return server
        .post(DISASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: uuidv4(), partner_id: partner.id })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Venue with ID');
          expect(response.body.message).toContain('not found');
        });
    });

    it('should return 404 when partner does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const venue = await createVenue();

      return server
        .post(DISASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: uuidv4() })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Partner with ID');
          expect(response.body.message).toContain('not found');
        });
    });

    it('should return 404 when association does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const venue = await createVenue();
      const partner = await createPartner();

      return server
        .post(DISASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: partner.id })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('not associated');
        });
    });

    it('should successfully disassociate a venue from a partner', async () => {
      const adminToken = await createJwtForRandomUser();
      const venue = await createVenue();
      const partner = await createPartner();

      await server
        .post(ASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: partner.id })
        .expect(201);

      return server
        .post(DISASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: venue.id, partner_id: partner.id })
        .expect(201)
        .then(async (response) => {
          expect(response.body.status).toEqual('success');
          expect(response.body.message).toContain('successfully disassociated');

          const venueWithPartners = await venueModel.findByPk(venue.id, {
            include: [
              {
                model: PartnerModel,
                as: 'partners',
                through: { attributes: [] },
              },
            ],
          });

          expect(venueWithPartners.partners).toHaveLength(0);
        });
    });

    it('should return 400 for invalid UUID format', async () => {
      const adminToken = await createJwtForRandomUser();

      return server
        .post(DISASSOCIATE_ENDPOINT)
        .set({ 'x-access-token': adminToken })
        .send({ venue_id: 'invalid-uuid', partner_id: 'invalid-uuid' })
        .expect(400);
    });
  });

  function createVenue(): Promise<VenueModel> {
    return venueModel.create({
      id: uuidv4(),
      name: faker.company.companyName(),
      slug: getSlug(faker.company.companyName()),
      address: faker.address.streetAddress(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      neighborhood: faker.address.county(),
      g_map_link: faker.datatype.uuid(),
      is_soft_deleted: false,
    });
  }

  function createPartner(): Promise<PartnerModel> {
    const req = generatePartnerRequest();
    return partnerModel.create({ ...req, id: uuidv4() });
  }

  async function deleteAllVenuesAndPartners(): Promise<void> {
    await venueModel.destroy({ where: {} });
    await partnerModel.destroy({ where: {} });
  }
});
