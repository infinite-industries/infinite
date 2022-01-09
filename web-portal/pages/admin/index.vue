<template>
  <div class="container admin-page">
    <h2>Unverified Events</h2>
    <admin-events-list :calendar_events="unverified_events" class="unverified-events" />
    <h2>Current Events</h2>
    <ii-pagination :items="verified_events">
      <admin-events-list slot-scope="page" :calendar_events="page" class="current-events" />
    </ii-pagination>
    <h2>Resources</h2>
    <ii-pagination :items="resource_events">
      <admin-events-list slot-scope="page" :calendar_events="page" class="resources" />
    </ii-pagination>
  </div>
</template>

<script>
  import AdminEventsList from '../../components/AdminEventsList.vue'
  import Pagination from '../../components/Pagination.vue'

  export default {
    name: 'Admin',
    middleware: 'auth',
    head: function () {
      return {
        title: 'Event Management - Infinite Industries'
      }
    },
    data: function () {
      return {

      }
    },
    computed: {
      unverified_events: function () {
        return this.$store.getters['admin/GetUnverifiedEvents']
      },
      verified_events: function () {
        return this.$store.getters['admin/GetVerifiedEvents']
      },
      resource_events: function () {
        return this.$store.getters['admin/GetResourceEvents']
      }
    },
    mounted: function () {
      this.$store.dispatch('admin/LoadUnverifiedEvents', { idToken: this.$auth.$storage.getState('_token.auth0') })
      this.$store.dispatch('admin/LoadCurrentEvents', { idToken: this.$auth.$storage.getState('_token.auth0') })
      this.$store.dispatch('admin/LoadResourceEvents', { idToken: this.$auth.$storage.getState('_token.auth0') })
    },
    components: {
      'admin-events-list': AdminEventsList,
      'ii-pagination': Pagination
    }
  }
</script>

<style scoped>

</style>
