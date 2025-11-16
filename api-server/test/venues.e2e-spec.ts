import startDatabase from './test-helpers/e2e-stack/start-database';
import runMigrations from './test-helpers/e2e-stack/run-migrations';
import startApplication from './test-helpers/e2e-stack/start-application';
import buildDbConnectionsForTests from './test-helpers/e2e-stack/build-db-connection-for-tests';
import killApp from './test-helpers/e2e-stack/kill-app';
import stopDatabase from './test-helpers/e2e-stack/stop-database';
import isNotNullOrUndefined from '../src/utils/is-not-null-or-undefined';
import request from 'supertest';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { TestingModule } from '@nestjs/testing';
import { VenueModel } from '../src/venues/models/venue.model';
import { CreateVenueRequest } from '../src/venues/dto/create-update-venue-request';
import { v4 as uuidv4 } from 'uuid';
import getSlug from '../src/utils/get-slug';
import { CURRENT_VERSION_URI } from '../src/utils/versionts';
import createJwtForRandomUser from './test-helpers/creaeteJwt';
import { PORT } from '../src/constants';

import faker from 'faker';

describe('Venues (e2e)', () => {
  const server = request('http://localhost:' + PORT);

  const DELETE_END_POINT = `/${CURRENT_VERSION_URI}/authenticated/venues`;
  const UPDATE_END_POINT = `/${CURRENT_VERSION_URI}/authenticated/venues`;
  const GET_ALL_VENUES_END_POINT = `/${CURRENT_VERSION_URI}/venues`;
  const CREATE_VENUES_END_POINT = `/${CURRENT_VERSION_URI}/venues`;

  let appUnderTest: ChildProcessWithoutNullStreams;
  let dbContainer: StartedTestContainer;

  let venueModel: typeof VenueModel;
  let testingModule: TestingModule;

  let dbHostPort: number;

  beforeAll(async () => {
    console.info('preparing for test suite -- Venues');

    const dbInfo = await startDatabase();

    dbContainer = dbInfo.dbContainer;
    dbHostPort = dbInfo.dbHostPort;

    await runMigrations(dbHostPort);

    appUnderTest = await startApplication(dbHostPort);

    const databaseModels = await buildDbConnectionsForTests(dbHostPort);

    venueModel = databaseModels.venueModel;
    testingModule = databaseModels.testingModule;

    console.info('test suite ready');

    return Promise.resolve();
  }, 30000);

  afterAll(async () => {
    console.info('begin cleanup for announcements');

    await killApp(appUnderTest);

    if (appUnderTest) {
      appUnderTest.removeAllListeners();
    }

    await stopDatabase(dbContainer);

    if (isNotNullOrUndefined(testingModule)) await testingModule.close();

    console.info('done cleaning up for announcements');

    return Promise.resolve();
  });

  beforeEach(async () => {
    await deleteAllAnnouncements();
  });

  it('[GET]/venues should return all non-soft deleted venues given no flags are passed', async () => {
    const { givenActiveVenues } =
      await createRandomMixOfDeletedAndNonDeletedVenues();

    return server
      .get(GET_ALL_VENUES_END_POINT)
      .expect(200)
      .then(async (response) => {
        expect(response.body.status).toEqual('success');

        const responseVenueIds = response.body.venues.map((venue) => venue.id);
        const expectedIds = givenActiveVenues.map((venue) => venue.id);
        expectIdsEqualInAnyOrder(responseVenueIds, expectedIds);
      });
  });

  it('[GET]/venues?includeDeleted=true should return all venues including soft-deleted when appropriate flag is passed', async () => {
    const { givenActiveVenues, givenDeletedVenues } =
      await createRandomMixOfDeletedAndNonDeletedVenues();
    const givenFlags = 'includeDeleted=yes';

    return server
      .get(`${GET_ALL_VENUES_END_POINT}?${givenFlags}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.status).toEqual('success');

        const responseVenueIds = response.body.venues.map((venue) => venue.id);

        const expectedIds = [
          ...givenActiveVenues.map((venue) => venue.id),
          ...givenDeletedVenues.map((venue) => venue.id),
        ];

        expectIdsEqualInAnyOrder(responseVenueIds, expectedIds);
      });
  });

  it('[DELETE]/authenticated/venues/:id should soft delete a venue given a valid token and id', async () => {
    const givenValidToken = await createJwtForRandomUser();

    const givenActiveExistingVenue: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const givenValidId = givenActiveExistingVenue.id;

    return server
      .del(`${DELETE_END_POINT}/${givenValidId}`)
      .set({ 'x-access-token': givenValidToken })
      .expect(200)
      .then(async (response) => {
        const statusResp: string = response.body.status;
        const venueResp: Record<string, unknown> = response.body.venue;

        const originalModelAsJson = givenActiveExistingVenue.toJSON();

        const expectedModel: Record<string, unknown> = {
          ...givenActiveExistingVenue.toJSON(),
          is_soft_deleted: true,
        };

        expect(statusResp).toEqual('success');
        expect(venueResp).toBeTruthy();

        expect(response.body.venue).not.toEqual(originalModelAsJson);
        assertVenuesEqualIgnoringDateStampsAndLatLong(venueResp, expectedModel);
      });
  });

  it('[DELETE]/authenticated/venues/:id should return 403 given no token provided', async () => {
    const givenActiveExistingVenue: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const givenValidId = givenActiveExistingVenue.id;

    return server.del(`${DELETE_END_POINT}/${givenValidId}`).expect(403);
  });

  it('[PUT]/authenticated/venue:id should return 200 and update model given valid token and inputs', async () => {
    const givenValidToken = await createJwtForRandomUser();

    const givenActiveExistingVenue: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const givenValidId = givenActiveExistingVenue.id;

    const givenNameToUpdate = faker.company.companyName();

    const givenValuesToUpdate = {
      name: givenNameToUpdate,
    };

    return server
      .put(`${UPDATE_END_POINT}/${givenValidId}`)
      .set({ 'x-access-token': givenValidToken })
      .send(givenValuesToUpdate)
      .expect(200)
      .then(async (response) => {
        const statusResp: string = response.body.status;
        const venueResp: Record<string, unknown> = response.body.venue;

        const originalModelAsJson = givenActiveExistingVenue.toJSON();

        const expectedSlug = getSlug(givenNameToUpdate);
        const expectedModelResp = {
          ...givenActiveExistingVenue.toJSON(),
          name: givenNameToUpdate,
          slug: expectedSlug,
        };

        expect(statusResp).toEqual('success');
        expect(venueResp).toBeTruthy();

        expect(response.body.venue).not.toEqual(originalModelAsJson);
        assertVenuesEqualIgnoringDateStampsAndLatLong(
          venueResp,
          expectedModelResp,
        );
      });
  });

  it('[PUT]/authenticated/venue:id should return 400 given empty update but valid token', async () => {
    const givenValidToken = await createJwtForRandomUser();

    const givenActiveExistingVenue: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const givenValidId = givenActiveExistingVenue.id;

    const givenEmptyValuesToUpdate = {};

    return server
      .put(`${UPDATE_END_POINT}/${givenValidId}`)
      .set({ 'x-access-token': givenValidToken })
      .send(givenEmptyValuesToUpdate)
      .expect(400);
  });

  it('[PUT]/authenticated/venue:id should return 403 given no token', async () => {
    const givenActiveExistingVenue: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const givenValidId = givenActiveExistingVenue.id;

    const givenNameToUpdate = faker.company.companyName();

    const givenValuesToUpdate = {
      name: givenNameToUpdate,
    };

    return server
      .put(`${UPDATE_END_POINT}/${givenValidId}`)
      .send(givenValuesToUpdate)
      .expect(403);
  });

  it('[POST]/venue should create a new venue and return 201 given valid post body', async () => {
    const givenRequestToCreateVenue: CreateVenueRequest =
      generateRandomCreateVenueRequest();

    return server
      .post(CREATE_VENUES_END_POINT)
      .send(givenRequestToCreateVenue)
      .expect(201)
      .then((resp) => {
        const respStatus = resp.body.status;
        const respVenue = resp.body.venue;
        const respVenueWithoutId = { ...respVenue, id: null };
        const expectedRespValue = {
          ...givenRequestToCreateVenue,
          id: null,
          is_soft_deleted: false,
          slug: getSlug(givenRequestToCreateVenue.name),
          gps_alt: null,
          gps_lat: null,
          gps_long: null,
        };

        expect(respStatus).toEqual('success');
        expect(respVenue).toBeTruthy();

        expect(respVenue.id).toBeTruthy();
        expect(respVenue.createdAt).toBeTruthy();
        expect(respVenue.updatedAt).toBeTruthy();

        assertVenuesEqualIgnoringDateStampsAndLatLong(
          respVenueWithoutId,
          expectedRespValue,
        );
      });
  });

  async function createRandomMixOfDeletedAndNonDeletedVenues(): Promise<{
    givenActiveVenues: VenueModel[];
    givenDeletedVenues: VenueModel[];
  }> {
    const nonDeletedVenue1: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const nonDeletedVenue2: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );
    const nonDeletedVenue3: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
    );

    const deletedVenue1: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
      true,
    );
    const deletedVenue2: VenueModel = await insertVenue(
      generateRandomCreateVenueRequest(),
      true,
    );

    return {
      givenActiveVenues: [nonDeletedVenue1, nonDeletedVenue2, nonDeletedVenue3],
      givenDeletedVenues: [deletedVenue1, deletedVenue2],
    };
  }

  function expectIdsEqualInAnyOrder(actualIds: string[], expectedIds) {
    expect(actualIds.length).toEqual(expectedIds.length);

    for (let i = 0; i < expectedIds.length; i++) {
      const expecctedId = expectedIds[i];
      expect(actualIds).toContain(expecctedId);
    }
  }

  function deleteAllAnnouncements(): Promise<number> {
    return venueModel.destroy({ where: {} });
  }

  function insertVenue(
    venue: CreateVenueRequest,
    isSoftDeleted = false,
  ): Promise<VenueModel> {
    const id = uuidv4();
    const slug = getSlug(venue.name);

    return venueModel.create({
      ...venue,
      id,
      slug,
      is_soft_deleted: isSoftDeleted,
    });
  }

  function generateRandomCreateVenueRequest(
    overrides: Partial<CreateVenueRequest> = {},
  ) {
    return {
      name: faker.company.companyName(),
      address: faker.address.streetAddress(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      neighborhood: faker.address.county(),
      g_map_link: faker.datatype.uuid(),
      ...overrides,
    };
  }

  function assertVenuesEqualIgnoringDateStampsAndLatLong(
    actualVenueModel: Record<string, unknown>,
    expectedVenueModel: Record<string, unknown>,
  ) {
    const actualModelWithoutDates = new VenueModel({
      ...actualVenueModel,
      gps_lat: null, // we don't have lat/long service configured when running tests
      gps_long: null,
      updatedAt: null,
      createdAt: null,
    });

    const expectedModelWithoutDates = new VenueModel({
      ...expectedVenueModel,
      updatedAt: null,
      createdAt: null,
    });

    expect(actualModelWithoutDates).toEqual(expectedModelWithoutDates);
  }
});
