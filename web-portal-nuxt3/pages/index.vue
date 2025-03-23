<template>
  <div>
    <div class="info-page">

      <h1>Home page</h1>

      <pre>
        APP_URL: {{ $config.public.APP_URL }}
        API_URL: {{ $config.public.API_URL }}
        $apiService is set: {{ !!$apiService }}
        <!-- data is {{ JSON.stringify(events, null, 2) }} -->
        events are {{ JSON.stringify(events, null, 2) }}
        resources are {{ JSON.stringify($store.getters.GetAllRemoteEvents, null, 2)}}
      </pre>

      <h2>Online Resources / Projects</h2>
    </div>
  </div>
</template>

<script>
  import { useStore } from 'vuex'

  export default defineNuxtComponent({
    async setup () {
      const config = useRuntimeConfig()
      const { $apiService } = useNuxtApp()
      const store = useStore()
      await callOnce('fetchHomeData', async () =>
        Promise.all([
          store.dispatch('LoadAllLocalEventData'),
          store.dispatch('LoadAllStreamingEventData')
        ]),
        { mode: 'navigation' }
      )
      // const { data, status } = await useFetch(`${config.public.API_URL}/events/verified`)
      // const [
      //   { data: eventsData },
      //   { data: resourcesData }
      // ] = await Promise.all([
      //   useAsyncData('events', () => $apiService.get('events/verified?embed=Venue')),
      //   useAsyncData('resources', () => nuxtApp.$apiService.get('/events/verified?category=online-resources'))
      // ])

      return {}
    },
    created () {
      console.log(!!this.$apiService)
    },
    computed: {
      events: function () {
        return this.$store.getters.GetAllLocalEvents
      },
      streamEvents: function () {
        return this.$store.getters.GetAllStreamEvents
      }
    },
  })
</script>

<style scoped>
  h2 {
    text-align: center;
    color: white;
  }

  @media only screen and (min-width: 480px) {
    h2 {
      text-align: left;
      padding: 0 20px;
    }
  }
</style>
