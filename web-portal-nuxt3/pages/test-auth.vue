<template>
  <div v-if="loggedIn">
    <p>
      Welcome User: {{user.login}}
    </p>

    <div>
      <NuxtLink @click="clear">logout</NuxtLink>
    </div>

    <div class="test-class">
      <ul>
        <li v-for="event in events" :key="event.title">
          {{ event.title }}
        </li>
      </ul>
    </div>


    <h2>Unverified Events</h2>
    <admin-events-list :calendar_events="unverifiedEvents" class="unverified-events" />
  </div>

  <div v-else>
    <p>
      you are not logged in <NuxtLink to="/login">login</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const { loggedIn, clear, user } = useUserSession()
const config = useRuntimeConfig();

const events = ref([])

const store = useStore()

await callOnce('LoadAdminPageDAta', async function () {
  store.dispatch('admin/LoadUnverifiedEvents')
  store.dispatch('admin/LoadCurrentEvents')
  store.dispatch('admin/LoadResourceEvents')
}, { mode: 'navigation' })

const unverifiedEvents = computed(() => {
  return store.getters['admin/GetUnverifiedEvents']
});

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

<style>
  .test-class { color: white }
</style>
