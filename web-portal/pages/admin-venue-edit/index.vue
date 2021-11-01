import { mapGetters, mapActions } from 'vuex'

<template>
  <div class="container admin-page admin-event-edit-page">
    <div class="admin-venue-edit-page__num_venues">
      {{ activeVenues.length }}
    </div>

    <div class="">
      <img class="loading-spinner" src="~/assets/images/spinner.gif">
    </div>

    <venue-card
      v-for="venue in activeVenues"
      :key="venue.id"
      :venue="venue"
    />
  </div>
</template>

<script>
  import { FETCH_ACTIVE_VENUES } from '../../store/venues'
  import VenueCard from './components/VenueCard'

  export default {
    components: { VenueCard },
    layout: 'admin',

    fetch: ({ store }) => (Promise.all([
      store.dispatch(FETCH_ACTIVE_VENUES)])),

    computed: {
      isActiveVenuesFetching: function () {
        return this.$store.state.venues.getActiveVenuesQuery.isFetching
      },

      isDeletedVenuesFetching: function () {
        return this.$store.state.venues.getDeletedVenuesQuery.isFetching
      },

      activeVenues: function () {
        console.log('!!! WTF: ' + JSON.stringify(this.$store.state.venues.getActiveVenuesQuery, null, 4))
        return this.$store.state.venues.getActiveVenuesQuery.data
      },

      errorFetchingActiveVenues: function () {
        return this.$store.state.venues.getActiveVenuesQuery.error
      },

      errorFetchingDeletedVenues: function () {
        return this.$store.state.venues.getDeletedVenuesQuery.error
      }
    },

    data: () => ({
      selectedList: 'active'
    })
  }
</script>
