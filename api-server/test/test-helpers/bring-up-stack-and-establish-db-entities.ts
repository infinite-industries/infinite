import startDatabase from './e2e-stack/start-database';
import runMigrations from './e2e-stack/run-migrations';
import startApplication from './e2e-stack/start-application';
import buildDbConnectionsForTests from './e2e-stack/build-db-connection-for-tests';

export default async function bringUpStackAndEstablishDbEntities() {
  console.info('bring up the stack for test suite');
  const dbInfo = await startDatabase();

  const dbContainer = dbInfo.dbContainer;
  const dbHostPort = dbInfo.dbHostPort;

  await runMigrations(dbHostPort);

  const appUnderTest = await startApplication(dbHostPort);

  const databaseModels = await buildDbConnectionsForTests(dbHostPort);

  const eventModel = databaseModels.eventModel;
  const venueModel = databaseModels.venueModel;
  const datetimeVenueModel = databaseModels.datetimeVenueModel;
  const partnerModel = databaseModels.partnerModel;
  const userModel = databaseModels.userModel;

  const testingModule = databaseModels.testingModule;

  console.info('stack is ready for test suite');

  return {
    dbContainer,
    dbHostPort,
    appUnderTest,
    eventModel,
    venueModel,
    datetimeVenueModel,
    partnerModel,
    userModel,
    testingModule,
  };
}
