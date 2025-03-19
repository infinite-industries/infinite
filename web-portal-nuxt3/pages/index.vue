<template>
  <div>
    <div class="info-page">

      <h1>Home page</h1>

      <pre>
        APP_URL: {{ $config.public.APP_URL }}
        API_URL: {{ $config.public.API_URL }}
        $apiService is set: {{ !!$apiService }}
        <!-- data is {{ JSON.stringify(events, null, 2) }} -->
        events are {{ JSON.stringify($store.getters.GetAllLocalEvents, null, 2) }}
        resources are {{ JSON.stringify(resources, null, 2)}}
      </pre>
    </div>
  </div>
</template>

<script>
  import { useStore } from 'vuex'

  export default defineNuxtComponent({
    async setup () {
      const config = useRuntimeConfig()
      const nuxtApp = useNuxtApp()
      const store = useStore()
      // const { data, status } = await useFetch(`${config.public.API_URL}/events/verified`)
      const [
        { data: eventsData },
        { data: resourcesData }
      ] = await Promise.all([
        // useAsyncData('events', () => nuxtApp.$apiService.get('events/verified?embed=Venue')),
        // 'resources' works, but 'events' doesn't yet
        useAsyncData('events', () => store.dispatch('LoadAllLocalEventData')),
        useAsyncData('resources', () => nuxtApp.$apiService.get('events/verified?category=online-resources'))
      ])
      // console.log('data', eventsData)
      // console.log('value?', eventsData.value)
      // console.log('store?', nuxtApp.$store.getters.GetUtilLoading, store.getters.GetUtilLoading)

      return {
        // events: eventsData.value.events,
        resources: resourcesData.value.events
      }
    },
    created () {
      console.log(!!this.$apiService)
    }
  })
</script>
