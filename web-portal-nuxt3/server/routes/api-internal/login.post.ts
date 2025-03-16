const serviceUnavailableError = createError({
  statusCode: 503,
  message: 'Service Unavailable',
})

export default defineEventHandler(async (event) => {
  const { username, password } = (await readBody(event) || {});

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

  await setUserSession(event, {
    user: {
      login: username,
      token
    },
    loggedInAt: Date.now(),
  })

  return setResponseStatus(event, 201)
})
