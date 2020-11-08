import {execSync} from "child_process";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./start-database";

function runMigrations(dbPort: number): void {
    console.log('running migrations');

    const numTries = 5;

    let finalEx: Error | null = null;

    for (let i = 0; i < numTries; i++) {
        try {
            doRunMigration(dbPort);

            finalEx = null;

            break;
        } catch (ex) {
            finalEx = ex;
        }
    }

    if (finalEx !== null) {
        throw new Error('failed to run migrations: ' + finalEx);
    }

    console.log('migrations complete');
}

function doRunMigration(dbPort: number) {
    const env = {
        ...process.env,
        DB_HOST,
        DB_PORT: dbPort + '',
        DB_USER_NAME: DB_USERNAME,
        DB_PASSWORD,
        DB_NAME
    };

    execSync('npm run db:migrate', {
        stdio: 'inherit',
        env
    });
}

export default runMigrations;
