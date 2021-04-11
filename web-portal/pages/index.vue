<template>
  <div>
    <!-- So sometimes we have pandemics in this world -->
    <client-only>
      <ii-jumbotron />
    </client-only>

    <ii-list-viewer :calendar_events="events" />

    <h2>Online Resources / Projects</h2>
    <ii-list-viewer :calendar_events="streamEvents" />
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
      },
      streamEvents: function () {
        return this.$store.getters.GetAllStreamEvents
      }
    },
    fetch: function ({ store }) {
      return Promise.all([
        store.dispatch('LoadAllLocalEventData'),
        store.dispatch('LoadAllStreamingEventData')
      ])
    },
    components: {
      'ii-list-viewer': ListViewer,
      'ii-jumbotron': Jumbotron
    }
  }
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
