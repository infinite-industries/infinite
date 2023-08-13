import killApp from './e2e-stack/kill-app';
import stopDatabase from './e2e-stack/stop-database';
import isNotNullOrUndefined from '../../src/utils/is-not-null-or-undefined';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { StartedTestContainer } from 'testcontainers';
import { TestingModule } from '@nestjs/testing';

export async function afterAllStackShutdown(
  appUnderTest: ChildProcessWithoutNullStreams,
  dbContainer: StartedTestContainer,
  testingModule: TestingModule,
): Promise<void> {
  await killApp(appUnderTest);

  appUnderTest.removeAllListeners();

  await stopDatabase(dbContainer);

  if (isNotNullOrUndefined(testingModule)) {
    await testingModule.close();
  }
}
