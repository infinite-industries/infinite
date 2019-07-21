<template>
  <ii-list-viewer :calendar_events="events"/>
</template>

<script>
  import ListViewer from '../components/ii-list-viewer.vue'

  export default {
    data: function () {
      return {
        // venues: []
      }
    },
    computed: {
      events: function () {
        return this.$store.getters.GetAllLocalEvents
      }
    },
    fetch: function ({ store }) {
      return Promise.all([
        store.dispatch('LoadAllLocalEventData'),
        store.dispatch('LoadAllVenueData')
      ])
    },
    components: {
      'ii-list-viewer': ListViewer
    }
  }
</script>

<style scoped>

</style>
