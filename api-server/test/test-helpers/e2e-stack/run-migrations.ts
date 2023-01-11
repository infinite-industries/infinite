import {execSync, ExecSyncOptions} from "child_process";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USER_NAME} from "./start-database";
import sleep from "../sleep";
import {DEBUG_MIGRATION} from "../../../src/constants";

async function runMigrations(dbPort: number): Promise<void> {
    console.log('running migrations');

    const numTries = 10;

    let finalEx: Error | null = null;

    for (let i = 0; i < numTries; i++) {
        try {
            doRunMigration(dbPort);

            finalEx = null;

            break;
        } catch (ex) {
            finalEx = ex;
        }

        await sleep(1000)
    }

    if (finalEx !== null) {
        throw new Error(`failed to run migrations after ${numTries} tries: ${finalEx}`);
    }

    console.log('migrations complete');
}

function doRunMigration(dbPort: number) {
    const env = {
        ...process.env,
        DB_HOST,
        DB_PORT: dbPort + '',
        DB_USER_NAME: DB_USER_NAME,
        DB_PASSWORD,
        DB_NAME
    };

    const options: ExecSyncOptions= {
        env,
        stdio: 'ignore'
    }

    if (DEBUG_MIGRATION) {
        options.stdio = 'inherit'
    }

    execSync('npm run db:migrate', options);
}

export default runMigrations;
