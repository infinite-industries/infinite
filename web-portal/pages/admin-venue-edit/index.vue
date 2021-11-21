import { mapGetters, mapActions } from 'vuex'

<template>
  <div class="container admin-page admin-event-edit-page">
    <div class="admin-event-edit-page__list-filters">
      <div>
        <input v-model="searchByNameValue" type="text" placeholder="search by name" />
      </div>

      <div>
        <select name="venues" v-model="selectedList" @change="onFilter()">
          <option value="Active Venues">Active Venues</option>
          <option value="Deleted Venues">Deleted Venues</option>
        </select>
      </div>
    </div>

    <div class="admin-event-edit-page_venue-list">
      <VenueSpinner :is-shown="isFetching">Loading Venues...</VenueSpinner>

      <ii-pagination v-show="!isFetching" :items="selectedVenueList">
        <template slot-scope="page">
          <venue-card
            v-for="venue in page"
            :venue="venue"
            :key="venue.id"
          />
        </template>
      </ii-pagination>
    </div>
  </div>
</template>

<script>
  import { FETCH_ACTIVE_VENUES, FETCH_DELETED_VENUES } from '../../store/venues'
  import VenueCard from '../../components/admin-venue-edit/VenueCard'
  import VenueSpinner from '../../components/admin-venue-edit/VenueSpinner'
  import Pagination from '../../components/Pagination'

  const ACTIVE_VENUE_SELECTION = 'Active Venues'

  const sortMethod = (venueA, venueB) => venueA.name > venueB.name ? 1 : -1

  export default {
    components: { VenueSpinner, VenueCard, 'ii-pagination': Pagination },
    layout: 'admin',
    middleware: 'auth',
    fetch: function () {
      if (this.selectedList === ACTIVE_VENUE_SELECTION) {
        return this.$store.dispatch(FETCH_ACTIVE_VENUES)
      } else {
        return this.$store.dispatch(FETCH_DELETED_VENUES)
      }
    },

    methods: {
      onFilter() {
        this.$fetch()
      }
    },

    computed: {
      isActiveVenuesFetching: function () {
        return this.$store.state.venues.getActiveVenuesQuery.isFetching
      },

      isDeletedVenuesFetching: function () {
        return this.$store.state.venues.getDeletedVenuesQuery.isFetching
      },

      selectedVenueList: function () {
        const selectedList = this.isShowingActive
          ? this.activeVenues
          : this.deletedVenues

        if (this.isSearchEntered) {
          return selectedList.filter(value => (
            value.name.toLowerCase().indexOf(this.searchByNameValue.toLocaleLowerCase()) >= 0))
        } else {
          return selectedList
        }
      },

      isSearchEntered: function () {
        return this.searchByNameValue.trim().length > 0
      },

      activeVenues: function () {
        return [...this.$store.state.venues.getActiveVenuesQuery.data].sort(sortMethod)
      },

      deletedVenues: function () {
        return [...this.$store.state.venues.getDeletedVenuesQuery.data].sort(sortMethod)
      },

      errorFetchingActiveVenues: function () {
        return this.$store.state.venues.getActiveVenuesQuery.error
      },

      errorFetchingDeletedVenues: function () {
        return this.$store.state.venues.getDeletedVenuesQuery.error
      },

      isShowingActive: function () {
        return this.selectedList === 'Active Venues'
      },

      isFetching: function () {
        return this.$store.state.venues.getDeletedVenuesQuery.isFetching ||
          this.$store.state.venues.getActiveVenuesQuery.isFetching
      }
    },

    data() {
      return {
        selectedList: 'Active Venues',
        searchByNameValue: ''
      }
    }
  }
</script>

<style>
  .admin-event-edit-page__list-filters {
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .admin-event-edit-page__list-filters input, .admin-event-edit-page__list-filters select {
    border: 1px solid black;
    padding: 0.2rem;
  }

  .admin-event-edit-page__list-filters, .admin-event-edit-page_venue-list {
    padding-left: 1rem;
    padding-right: 1rem;
  }
</style>
