import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import request from 'supertest';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { TestingModule } from '@nestjs/testing';
import { PartnerModel } from '../src/users/models/partner.model';
import { UserModel } from '../src/users/models/user.model';
import killApp from './test-helpers/e2e-stack/kill-app';
import stopDatabase from './test-helpers/e2e-stack/stop-database';
import isNotNullOrUndefined from '../src/utils/is-not-null-or-undefined';
import { CreatePartnerRequest } from '../src/users/dto/create-partner-request';
import generatePartnerRequest from './fakers/partner.faker';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { v4 as uuidv4 } from 'uuid';
import { PORT } from '../src/constants';
import createJwtForRandomUser from './test-helpers/creaeteJwt';

const server = request('http://localhost:' + PORT);

let appUnderTest: ChildProcessWithoutNullStreams;
let dbContainer: StartedTestContainer;

let partnerModel: typeof PartnerModel;
let userModel: typeof UserModel;
let testingModule: TestingModule;

let dbHostPort: number;

describe('Partners Authenticated (e2e)', () => {
  beforeAll(async () => {
    console.info('preparing for test suite -- Partners Authenticated');

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    partnerModel = databaseModels.partnerModel;
    userModel = databaseModels.userModel;
    testingModule = databaseModels.testingModule;

    console.info('test suite ready');

    return Promise.resolve();
  }, 30000);

  afterAll(async () => {
    console.info('begin cleanup for partners authenticated');

    await killApp(appUnderTest);

    if (appUnderTest) {
      appUnderTest.removeAllListeners();
    }

    await stopDatabase(dbContainer);

    if (isNotNullOrUndefined(testingModule)) await testingModule.close();

    console.info('done cleaning up for partners authenticated');
    return Promise.resolve();
  });

  beforeEach(async () => {
    await deleteAllUsersAndPartners();
  });

  describe('GET /authenticated/partners', () => {
    it('should return 403 when user is not authenticated', async () => {
      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .expect(403);
    });

    it('should return 403 when user is authenticated but not admin', async () => {
      const nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': nonAdminToken })
        .expect(403);
    });

    it('should return empty list when no partners exist', async () => {
      const adminToken = await createJwtForRandomUser();

      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .then((response) => {
          expect(response.body.status).toEqual('success');
          expect(response.body.paginated).toEqual(false);
          expect(response.body.page).toEqual(0);
          expect(response.body.pageSize).toEqual(0);
          expect(response.body.nextPage).toEqual(null);
          expect(response.body.partners).toEqual([]);
        });
    });

    it('should return all partners when partners exist', async () => {
      const partner1 = await createPartner(generatePartnerRequest());
      const partner2 = await createPartner(generatePartnerRequest());

      const adminToken = await createJwtForRandomUser();

      return server
        .get(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .then((response) => {
          expect(response.body.status).toEqual('success');
          expect(response.body.paginated).toEqual(false);
          expect(response.body.page).toEqual(0);
          expect(response.body.pageSize).toEqual(2);
          expect(response.body.nextPage).toEqual(null);
          expect(response.body.partners).toHaveLength(2);

          // Check that partners are ordered by createdAt ASC
          const partners = response.body.partners;
          expect(partners[0].id).toEqual(partner1.id);
          expect(partners[1].id).toEqual(partner2.id);
          expect(partners[0].name).toEqual(partner1.name);
          expect(partners[1].name).toEqual(partner2.name);
        });
    });
  });

  describe('POST /authenticated/partners', () => {
    it('should return 403 when user is not authenticated', async () => {
      const partnerRequest = generatePartnerRequest();

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .send(partnerRequest)
        .expect(403);
    });

    it('should return 403 when user is authenticated but not admin', async () => {
      const nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });
      const partnerRequest = generatePartnerRequest();

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': nonAdminToken })
        .send(partnerRequest)
        .expect(403);
    });

    it('should create a new partner with name and logo URLs', async () => {
      const adminToken = await createJwtForRandomUser();
      const partnerRequest = generatePartnerRequest();

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .send(partnerRequest)
        .expect(201)
        .then((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toEqual(partnerRequest.name);
          expect(response.body.light_logo_url).toEqual(partnerRequest.light_logo_url);
          expect(response.body.dark_logo_url).toEqual(partnerRequest.dark_logo_url);
          expect(response.body.createdAt).toBeDefined();
          expect(response.body.updatedAt).toBeDefined();
        });
    });

    it('should create a new partner with only name (logo URLs optional)', async () => {
      const adminToken = await createJwtForRandomUser();
      const partnerRequest: CreatePartnerRequest = {
        name: 'Test Partner',
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .send(partnerRequest)
        .expect(201)
        .then((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toEqual(partnerRequest.name);
          expect(response.body.light_logo_url).toEqual(null);
          expect(response.body.dark_logo_url).toEqual(null);
          expect(response.body.createdAt).toBeDefined();
          expect(response.body.updatedAt).toBeDefined();
        });
    });

    it('should return 400 when name is missing', async () => {
      const adminToken = await createJwtForRandomUser();
      const partnerRequest = {
        light_logo_url: 'https://example.com/logo-light.png',
        dark_logo_url: 'https://example.com/logo-dark.png',
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .send(partnerRequest)
        .expect(400);
    });

    it('should return 400 when name is empty', async () => {
      const adminToken = await createJwtForRandomUser();
      const partnerRequest = {
        name: '',
        light_logo_url: 'https://example.com/logo-light.png',
        dark_logo_url: 'https://example.com/logo-dark.png',
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .send(partnerRequest)
        .expect(400);
    });

    it('should return 409 when partner name already exists (case-insensitive)', async () => {
      const adminToken = await createJwtForRandomUser();
      const partnerRequest = generatePartnerRequest();

      // Create first partner
      await createPartner(partnerRequest);

      // Try to create partner with same name but different case
      const duplicateRequest = {
        ...partnerRequest,
        name: partnerRequest.name.toUpperCase(),
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners`)
        .set({ 'x-access-token': adminToken })
        .send(duplicateRequest)
        .expect(409);
    });
  });

  describe('POST /authenticated/partners/associate', () => {
    it('should return 403 when user is not authenticated', async () => {
      const associationRequest = {
        user_id: uuidv4(),
        partner_id: uuidv4(),
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .send(associationRequest)
        .expect(403);
    });

    it('should return 403 when user is authenticated but not admin', async () => {
      const nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });
      const associationRequest = {
        user_id: uuidv4(),
        partner_id: uuidv4(),
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': nonAdminToken })
        .send(associationRequest)
        .expect(403);
    });

    it('should return 404 when user does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const partner = await createPartner(generatePartnerRequest());

      const associationRequest = {
        user_id: uuidv4(), // Non-existent user
        partner_id: partner.id,
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': adminToken })
        .send(associationRequest)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('User with ID');
          expect(response.body.message).toContain('not found');
        });
    });

    it('should return 404 when partner does not exist', async () => {
      const adminToken = await createJwtForRandomUser();
      const user = await createUser();

      const associationRequest = {
        user_id: user.id,
        partner_id: uuidv4(), // Non-existent partner
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': adminToken })
        .send(associationRequest)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Partner with ID');
          expect(response.body.message).toContain('not found');
        });
    });

    it('should successfully associate user with partner', async () => {
      const adminToken = await createJwtForRandomUser();
      const user = await createUser();
      const partner = await createPartner(generatePartnerRequest());

      const associationRequest = {
        user_id: user.id,
        partner_id: partner.id,
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': adminToken })
        .send(associationRequest)
        .expect(201)
        .then(async (response) => {
          expect(response.body.message).toContain('successfully associated');
          expect(response.body.message).toContain(user.id);
          expect(response.body.message).toContain(partner.id);

          // Verify the association was created in the database
          const userWithPartners = await userModel.findByPk(user.id, {
            include: [
              {
                model: PartnerModel,
                as: 'partners',
                through: { attributes: [] },
              },
            ],
          });

          expect(userWithPartners.partners).toHaveLength(1);
          expect(userWithPartners.partners[0].id).toEqual(partner.id);
        });
    });

    it('should return 409 when association already exists', async () => {
      const adminToken = await createJwtForRandomUser();
      const user = await createUser();
      const partner = await createPartner(generatePartnerRequest());

      const associationRequest = {
        user_id: user.id,
        partner_id: partner.id,
      };

      // Create the association first
      await server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': adminToken })
        .send(associationRequest)
        .expect(201);

      // Try to create the same association again
      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': adminToken })
        .send(associationRequest)
        .expect(409)
        .then((response) => {
          expect(response.body.message).toContain('already associated');
        });
    });

    it('should return 400 for invalid UUID format', async () => {
      const adminToken = await createJwtForRandomUser();

      const associationRequest = {
        user_id: 'invalid-uuid',
        partner_id: 'invalid-uuid',
      };

      return server
        .post(`/${CURRENT_VERSION_URI}/authenticated/partners/associate`)
        .set({ 'x-access-token': adminToken })
        .send(associationRequest)
        .expect(400);
    });
  });

  function createUser(): Promise<UserModel> {
    return userModel.create({
      id: uuidv4(),
      name: 'Test User',
      nickname: 'testuser',
      picture: 'https://example.com/avatar.jpg',
    });
  }

  function createPartner(partner: CreatePartnerRequest): Promise<PartnerModel> {
    return partnerModel.create({ ...partner, id: uuidv4() });
  }

  async function deleteAllUsersAndPartners(): Promise<void> {
    // Delete all users first (this will cascade delete the mappings due to foreign key constraints)
    await userModel.destroy({ where: {} });

    // Delete all partners
    await partnerModel.destroy({ where: {} });
  }
});
