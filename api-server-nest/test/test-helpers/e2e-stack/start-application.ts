import {ChildProcessWithoutNullStreams, spawn} from "child_process";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./start-database";

async function startApplication(dbPort: number): Promise<ChildProcessWithoutNullStreams> {
    const appReadyMessage = 'Nest application successfully started'
    const timeOut = 10000

    const appUnderTest = spawn('node', ['/home/chris/projects/infinite/api-server-nest/dist/main'],  {
        env: {
            ...process.env,
            DB_HOST,
            DB_PORT: dbPort + '',
            DB_USER_NAME: DB_USERNAME,
            DB_PASSWORD,
            DB_NAME
        }
    });

    console.info(`waiting on app ${appUnderTest.pid} to finnish loading`)

    return new Promise((resolve, reject) => {
        appUnderTest.stdout.on('data', (data) => {
            console.log(`running-app -> ${data}`);

            if (data && data.indexOf(appReadyMessage) >= 0) {
                console.log('the app is ready')
                resolve(appUnderTest)
            }
        });

        appUnderTest.stderr.on('data', (data) => {
            console.error(`running-app -> ${data}`);
        });

        setTimeout(() => reject(new Error('timed out waiting on app to start')), timeOut)
    })
}

export default startApplication
