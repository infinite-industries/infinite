<template>
  <div class="container admin-page">
    <h2>Unverified Events</h2>
    <admin-events-list :calendar_events="unverified_events"></admin-events-list>
    <h2>Current Events</h2>
    <admin-events-list :calendar_events="verifiedEventsPage"></admin-events-list>
    <v-pagination v-model="verifiedPage" :length="verifiedPageCount" />
    <h2>Resources</h2>
    <admin-events-list :calendar_events="resourceEventsPage" />
    <v-pagination v-model="resourcePage" :length="resourcePageCount" />
  </div>
</template>

<script>
  import AdminEventsList from '../../components/AdminEventsList.vue'

  const PAGE_SIZE = 10

  export default {
    name: 'Admin',
    middleware: 'auth',
    head: {
      title: 'Event Management - Infinite Industries'
    },
    data: function () {
      return {
        verifiedPage: 1,
        resourcePage: 1
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
      },
      verifiedPageCount: function () {
        const events = this.verified_events
        return events && events.length > 0 ? Math.ceil(events.length / PAGE_SIZE) : 0
      },
      verifiedEventsPage: function () {
        const page = this.verifiedPage - 1
        const events = this.verified_events
        if (page < 0 || !events || events.length === 0) return []
        else return events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
      },
      resourcePageCount: function () {
        const resources = this.resource_events
        return resources && resources.length > 0 ? Math.ceil(resources.length / PAGE_SIZE) : 0
      },
      resourceEventsPage: function () {
        const page = this.resourcePage - 1
        const resources = this.resource_events
        if (page < 0 || !resources || resources.length === 0) return []
        else return resources.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
      }
    },
    mounted: function () {
      this.$store.dispatch('admin/LoadUnverifiedEvents', { idToken: this.$auth.$storage.getState('_token.auth0') })
      this.$store.dispatch('admin/LoadCurrentEvents', { idToken: this.$auth.$storage.getState('_token.auth0') })
      this.$store.dispatch('admin/LoadResourceEvents', { idToken: this.$auth.$storage.getState('_token.auth0') })
    },
    components: {
      'admin-events-list': AdminEventsList
    }
  }
</script>

<style scoped>
  .admin-page {
    background: white;
    color: black;
    border-radius: 10px;
  }

  @media only screen and (min-width: 993px) {
    .admin-page {
      max-width: 80%;
    }
  }

  /* >>> overrides scoping, allowing the targeting of child components */
  .admin-page >>> .v-pagination .v-pagination__item--active {
    color: white;
    background-color: black;
  }
</style>
