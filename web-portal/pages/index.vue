<template>
  <div>
    <!-- So sometimes we have pandemics in this world -->
    <ii-jumbotron />

    <ii-list-viewer :calendar_events="events" />
  </div>
</template>

<script>
  import ListViewer from '../components/ListViewer.vue'
  import Jumbotron from '../components/Jumbotron.vue'

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
      'ii-list-viewer': ListViewer,
      'ii-jumbotron': Jumbotron
    }
  }
</script>

<style scoped>

</style>
