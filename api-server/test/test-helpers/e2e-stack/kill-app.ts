import {ChildProcessWithoutNullStreams} from "child_process";
import isNotNullOrUndefined from "../../../src/utils/is-not-null-or-undefined";

function killApp(appUnderTest: ChildProcessWithoutNullStreams): Promise<void> {
    console.info('stopping the test app')

    if (isNotNullOrUndefined(appUnderTest)) {
        return new Promise(resolve => {
            appUnderTest.stdout.removeAllListeners()
            appUnderTest.stderr.removeAllListeners()

            appUnderTest.on('exit', (code) => {
                appUnderTest.removeAllListeners()

                console.log(`child process ${appUnderTest.pid} exited with code ${code}`);

                resolve()
            })

            appUnderTest.kill('SIGINT')
        })
    } else {
        console.warn('null passed to killApp')
        return Promise.resolve()
    }
}

export default killApp;
