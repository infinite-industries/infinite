<template>
  <div class="container admin-page">
    <h2>Unverified Events</h2>
    <admin-events-list :calendar_events="unverified_events" class="unverified-events" />
    <h2>Current Events</h2>
    <ii-pagination
      :items="verified_events"
      :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
      class-name-page-list="ii-admin-page_current-events-pagination-list"
    >
      <admin-events-list slot-scope="page" :calendar_events="page" class="current-events" />
    </ii-pagination>
    <h2>Resources</h2>
    <ii-pagination
      :items="resource_events"
      :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
      class-name-page-list="ii-admin-page_resources-pagination-list"
    >
      <admin-events-list slot-scope="page" :calendar_events="page" class="resources" />
    </ii-pagination>
  </div>
</template>

<script>
  import AdminEventsList from '../../components/AdminEventsList.vue'
  import Pagination from '../../components/pagination/Pagination.vue'
  import getToken from '../../helpers/getToken'

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
        isLessWindowLessThan900px: false
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
      maxNumberOfPageShortcuts() {
        if (this.isLessWindowLessThan900px) {
          return 5
        } else {
          return 25
        }
      }
    },
    mounted: function () {
      this.$store.dispatch('admin/LoadUnverifiedEvents', { idToken: getToken(this.$auth) })
      this.$store.dispatch('admin/LoadCurrentEvents', { idToken: getToken(this.$auth) })
      this.$store.dispatch('admin/LoadResourceEvents', { idToken: getToken(this.$auth) })

      if (window) {
        this._mediaQueryListener = window.matchMedia('(max-width: 900px)')
        this.isLessWindowLessThan900px = this._mediaQueryListener.matches

        this._mediaQueryListener.addEventListener('change', this.onMatchMediaChange)
      }
    },
    destroyed() {
      if (this._mediaQueryListener) {
        this._mediaQueryListener.removeEventListener('change', this.onMatchMediaChange)
        this._mediaQueryListener = undefined
      }
    },
    components: {
      'admin-events-list': AdminEventsList,
      'ii-pagination': Pagination
    },
    methods: {
      onMatchMediaChange() {
        this.isLessWindowLessThan900px = this._mediaQueryListener.matches
      }
    }
  }
</script>

<style>
.ii-pagination__list.ii-admin-page_current-events-pagination-list,
.ii-pagination__list.ii-admin-page_resources-pagination-list {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
}

.ii-pagination__list-wrapper {
  display: flex;
}
</style>
