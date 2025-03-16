<template>
  <div v-if="loggedIn">
    <p>
      Welcome User: {{user.login}}
    </p>

    <div>
      <NuxtLink v-if="loggedIn" to="#" @click="clear">logout</NuxtLink>
    </div>

    <div>
      <ul>
        <li v-for="event in events" :key="event.title">
          {{ event.title }}
        </li>
      </ul>
    </div>
  </div>

  <div v-else>
    <p>
      you are not logged in <NuxtLink to="/login">login</NuxtLink>
    </p>
  </div>
</template>

<script setup>
const { loggedIn, clear, user } = useUserSession()
const config = useRuntimeConfig();

const events = ref([])

const { data, error } = await useAsyncData('apiData', async () => {
  if (loggedIn.value) {
    const token = user.value?.token
    const apiUrl = config.public.apiUrl;

    return await $fetch(`${apiUrl}/authenticated/events`, {
      headers: {
        'x-access-token': token
      }
    })
  } else {
    return Promise.resolve({ data: [], error: null })
  }
})

const eventData = data?.value?.events || []
events.value = eventData.sort((a, b) => a.id.localeCompare(b.id)).slice(0, 10)
</script>
