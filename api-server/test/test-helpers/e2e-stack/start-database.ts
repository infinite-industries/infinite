import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

export const DB_HOST = 'localhost';
export const DB_INTERNAL_PORT = 5432;
export const DB_USERNAME = 'infinite';
export const DB_PASSWORD = 'infinite';
export const DB_NAME = 'infinite';

const TMP_FS = { '/temp_pgdata': 'rw,noexec,nosuid,size=65536k' };

async function startDatabase(): Promise<DatabaseInformation> {
  console.info('starting a database for e2e tests');

  const databaseReadyMessage = 'database system is ready to accept connections';

  const dbContainer = await new GenericContainer('postgres', '9.6.2-alpine')
    .withExposedPorts(DB_INTERNAL_PORT)
    .withTmpFs(TMP_FS)
    .withEnv('POSTGRES_USER', DB_USERNAME)
    .withEnv('POSTGRES_PASSWORD', DB_PASSWORD)
    .withEnv('POSTGRES_DB', DB_NAME)
    .withWaitStrategy(Wait.forLogMessage(databaseReadyMessage))
    .start();

  const dbHostPort = dbContainer.getMappedPort(DB_INTERNAL_PORT);

  console.info('database running on port: ' + dbHostPort);

  return {
    dbContainer,
    dbHostPort,
  };
}

export default startDatabase;

export type DatabaseInformation = {
  dbContainer: StartedTestContainer;
  dbHostPort: number;
};
