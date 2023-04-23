import isNotNullOrUndefined from '../../../src/utils/is-not-null-or-undefined';
import { StartedTestContainer, StoppedTestContainer } from 'testcontainers';

async function stopDatabase(
  dbContainer: StartedTestContainer,
): Promise<StoppedTestContainer | void> {
  if (isNotNullOrUndefined(dbContainer)) {
    return dbContainer.stop();
  } else {
    console.warn('stopDatabase passed a null');
    return Promise.resolve();
  }
}

export default stopDatabase;
