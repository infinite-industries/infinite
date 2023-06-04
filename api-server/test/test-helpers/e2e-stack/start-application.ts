import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from './start-database';
import fs from 'fs';

async function startApplication(
  dbPort: number,
): Promise<ChildProcessWithoutNullStreams> {
  const logFilePath = `${__dirname}/../../logs/api-server.logs`;

  const logging = fs.createWriteStream(logFilePath, { flags: 'a' });

  const appReadyMessage = 'Nest application successfully started';
  const timeOut = 10000;

  const testPem = './test-keys/1nfinite_testing_rsa256.rsa';

  const appUnderTest = spawn(
    'node',
    [__dirname + '/../../../dist/src/main.js'],
    {
      env: {
        ...process.env,
        DB_HOST,
        DB_PORT: dbPort + '',
        DB_USER_NAME: DB_USERNAME,
        DB_PASSWORD,
        DB_NAME,
        JWT_PEM: testPem,
      },
    },
  );

  appUnderTest.stdout.pipe(logging);
  appUnderTest.stderr.pipe(logging);

  console.info(`waiting on app ${appUnderTest.pid} to finnish loading`);

  return new Promise((resolve, reject) => {
    appUnderTest.stdout.on('data', (data) => {
      if (data && data.indexOf(appReadyMessage) >= 0) {
        console.log(
          `The API Server  is running - logs are sent to ${logFilePath}`,
        );
        resolve(appUnderTest);
      }
    });

    setTimeout(() => {
      failCleanup();
      reject(new Error('timed out waiting on app to start'));
    }, timeOut);
  });

  function failCleanup() {
    try {
      if (logging) {
        logging.close();
      }
    } catch (ex) {}
  }
}

export default startApplication;
