import { logger } from './utils.js'

const serviceUnavailableError = createError({
  statusCode: 503,
  message: 'Service Unavailable',
})

export default defineEventHandler(async (event) => {
  const { username, password } = (await readBody(event) || {});

  logger.info(username, password)

  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  const resp: { token: string } | null = await $fetch(`${apiUrl}/authentication/login`, {
    method: 'POST',
    body: {
      username,
      password
    },
  })

  if (!resp) {
    throw serviceUnavailableError;
  }

  const { token } = resp

  const userInfo = await getDetailedUserInfoFromAPI(token);

  await setUserSession(event, {
    user: {
      login: username,
      ...userInfo,
      token
    },
    loggedInAt: Date.now(),
  })

  return setResponseStatus(event, 201)
})

async function getDetailedUserInfoFromAPI(token: string): Promise<UserInformation> {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  return await $fetch(`${apiUrl}/users/current`, {
    method: 'GET',
    headers: {
      'x-access-token': token
    }
  });
}

export interface UserInformation {
  id: string;
  name: string,
  nickname: string,
  isInfiniteAdmin: boolean,
  venueIDs: string []
}
