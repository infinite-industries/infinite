import {ChildProcessWithoutNullStreams, execSync, spawn} from "child_process";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./start-database";

const isShowingMessagesFromApp = !!process.env.DEBUG_APP

async function startApplication(dbPort: number): Promise<ChildProcessWithoutNullStreams> {
    const appReadyMessage = 'Nest application successfully started'
    const timeOut = 10000

    const testPem = './test-keys/1nfinite_testing.pem'

    const appUnderTest = spawn('node', [__dirname + '/../../../dist/main'],  {
        env: {
            ...process.env,
            DB_HOST,
            DB_PORT: dbPort + '',
            DB_USER_NAME: DB_USERNAME,
            DB_PASSWORD,
            DB_NAME,
            JWT_PEM: testPem
        }
    });

    console.info(`waiting on app ${appUnderTest.pid} to finnish loading`)

    return new Promise((resolve, reject) => {
        appUnderTest.stdout.on('data', (data) => {
            if (isShowingMessagesFromApp) {
                console.info(`running-app -> ${data}`);
            }

            if (data && data.indexOf(appReadyMessage) >= 0) {
                console.log('the app is ready')
                resolve(appUnderTest)
            }
        });

        appUnderTest.stderr.on('data', (data) => {
            if (isShowingMessagesFromApp) {
                console.error(`running-app -> ${data}`);
            }
        });

        setTimeout(() => reject(new Error('timed out waiting on app to start')), timeOut)
    })
}

export default startApplication
