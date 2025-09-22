import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import request from 'supertest';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { TestingModule } from '@nestjs/testing';
import { UserModel } from '../src/users/models/user.model';
import { PartnerModel } from '../src/users/models/partner.model';
import killApp from './test-helpers/e2e-stack/kill-app';
import stopDatabase from './test-helpers/e2e-stack/stop-database';
import isNotNullOrUndefined from '../src/utils/is-not-null-or-undefined';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import { v4 as uuidv4 } from 'uuid';
import { PORT } from '../src/constants';
import createJwtForRandomUser from './test-helpers/creaeteJwt';
import generatePartnerRequest from './fakers/partner.faker';

const server = request('http://localhost:' + PORT);

let appUnderTest: ChildProcessWithoutNullStreams;
let dbContainer: StartedTestContainer;

let userModel: typeof UserModel;
let partnerModel: typeof PartnerModel;
let testingModule: TestingModule;

let dbHostPort: number;

describe('Users (e2e)', () => {
  beforeAll(async () => {
    console.info('preparing for test suite -- Users');

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    userModel = databaseModels.userModel;
    partnerModel = databaseModels.partnerModel;
    testingModule = databaseModels.testingModule;

    console.info('test suite ready');

    return Promise.resolve();
  }, 30000);

  afterAll(async () => {
    console.info('begin cleanup for users');

    await killApp(appUnderTest);

    if (appUnderTest) {
      appUnderTest.removeAllListeners();
    }

    await stopDatabase(dbContainer);

    if (isNotNullOrUndefined(testingModule)) await testingModule.close();

    console.info('done cleaning up for users');
    return Promise.resolve();
  });

  beforeEach(async () => {
    await deleteAllUsersAndPartners();
  });

  describe('GET /users/current', () => {
    it('should return 403 when user is not authenticated', async () => {
      return server.get(`/${CURRENT_VERSION_URI}/users/current`).expect(403);
    });

    it('should create a new user when user does not exist', async () => {
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': true,
      });

      // Verify no users exist initially
      const initialUserCount = await userModel.count();
      expect(initialUserCount).toEqual(0);

      return server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async (response) => {
          // Verify user was created
          const finalUserCount = await userModel.count();
          expect(finalUserCount).toEqual(1);

          // Verify response structure
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toBeDefined();
          expect(response.body.nickname).toBeDefined();
          expect(response.body.isInfiniteAdmin).toEqual(true);

          // Verify user exists in database
          const createdUser = await userModel.findByPk(response.body.id);
          expect(createdUser).toBeDefined();
          expect(createdUser.name).toEqual(response.body.name);
        });
    });

    it('should return existing user when user already exists', async () => {
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': true,
      });

      // Create a user first
      const firstResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const firstUserId = firstResponse.body.id;

      // Call the endpoint again
      return server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async (response) => {
          // Should return the same user
          expect(response.body.id).toEqual(firstUserId);
          expect(response.body.name).toEqual(firstResponse.body.name);
          expect(response.body.nickname).toEqual(firstResponse.body.nickname);

          // Should still have only one user in database
          const userCount = await userModel.count();
          expect(userCount).toEqual(1);
        });
    });

    it('should return existing user with associated partners', async () => {
      const userToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': true,
      });

      // Create a user first
      const userResponse = await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200);

      const userId = userResponse.body.id;

      // Create some partners
      const partner1 = await createPartner(generatePartnerRequest());
      const partner2 = await createPartner(generatePartnerRequest());

      // Associate user with partners
      await associateUserWithPartners(userId, [partner1.id, partner2.id]);

      // Call the endpoint again and verify partners are loaded
      return server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': userToken })
        .expect(200)
        .then(async (response) => {
          expect(response.body.id).toEqual(userId);

          // Verify user has partners associated in the database
          const userWithPartners = await userModel.findByPk(userId, {
            include: [
              {
                model: PartnerModel,
                as: 'partners',
                through: { attributes: [] },
              },
            ],
          });

          expect(userWithPartners.partners).toHaveLength(2);
          expect(userWithPartners.partners.map((p) => p.id)).toContain(
            partner1.id,
          );
          expect(userWithPartners.partners.map((p) => p.id)).toContain(
            partner2.id,
          );
        });
    });

    it('should return user info with correct admin status', async () => {
      const adminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': true,
      });

      // Test admin user
      await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': adminToken })
        .expect(200)
        .then((response) => {
          expect(response.body.isInfiniteAdmin).toEqual(true);
        });

      const nonAdminToken = await createJwtForRandomUser({
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      // Test non-admin user
      await server
        .get(`/${CURRENT_VERSION_URI}/users/current`)
        .set({ 'x-access-token': nonAdminToken })
        .expect(200)
        .then((response) => {
          expect(response.body.isInfiniteAdmin).toEqual(false);
        });
    });
  });

  async function createPartner(partnerData: any): Promise<PartnerModel> {
    return partnerModel.create({
      ...partnerData,
      id: uuidv4(),
    });
  }

  async function associateUserWithPartners(
    userId: string,
    partnerIds: string[],
  ): Promise<void> {
    // Use Sequelize's association methods to create the many-to-many relationship
    const user = await userModel.findByPk(userId);
    const partners = await partnerModel.findAll({
      where: { id: partnerIds },
    });

    // Use the association method to set partners
    await (user as any).setPartners(partners);
  }

  async function deleteAllUsersAndPartners(): Promise<void> {
    // Delete all users first (this will cascade delete the mappings due to foreign key constraints)
    await userModel.destroy({ where: {} });

    // Delete all partners
    await partnerModel.destroy({ where: {} });
  }
});
