<template>
  <div class="container admin-page admin-event-edit-page">
    <div class="admin-event-edit-page__list-filters">
      <div>
        <input v-model="searchByNameValue" type="text" placeholder="search by name" />
      </div>

      <div>
        <select
          class="admin-event-edit-page__active-state-filter"
          v-model="selectedList"
          @change="onFilter()"
        >
          <option value="Active Venues">Active Venues</option>
          <option value="Deleted Venues">Deleted Venues</option>
        </select>
      </div>
    </div>

    <div class="admin-event-edit-page_venue-list">
      <VenueSpinner :is-shown="isFetching">Loading Venues...</VenueSpinner>

      <ii-pagination
        v-show="!isFetching"
        :items="selectedVenueList"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-event-edit-page_pagination-list"
      >
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
  import {
    ACTIVE_VENUE_SELECTION,
    COMMIT_VENUE_CHANGE_ACTIVE_FILTER_STATE,
    FETCH_ACTIVE_VENUES,
    FETCH_DELETED_VENUES
  } from '../../store/venues'
  import VenueCard from '../../components/admin-venue-edit/VenueCard'
  import VenueSpinner from '../../components/admin-venue-edit/VenueSpinner'
  import Pagination from '../../components/pagination/Pagination.vue'
  import getToken from '@/helpers/getToken'
  const sortMethod = (venueA, venueB) => venueA.name > venueB.name ? 1 : -1

  export default {
    components: { VenueSpinner, VenueCard, 'ii-pagination': Pagination },
    layout: 'admin',
    middleware: 'auth',
    fetch: function () {
      if (this.isShowingActive) {
        return this.$store.dispatch(FETCH_ACTIVE_VENUES)
      } else {
        return this.$store.dispatch(FETCH_DELETED_VENUES)
      }
    },

    mounted: function () {
      if (window) {
        this._mediaQueryListenerExtralSmall = window.matchMedia('(max-width: 500px)')
        this._mediaQueryListenerSmall = window.matchMedia('(max-width: 900px)')
        this._mediaQueryListenerMedium = window.matchMedia('(max-width: 1660px)')

        this.onMatchMediaChange()

        this._mediaQueryListenerExtralSmall.addEventListener('change', this.onMatchMediaChange)
        this._mediaQueryListenerSmall.addEventListener('change', this.onMatchMediaChange)
        this._mediaQueryListenerMedium.addEventListener('change', this.onMatchMediaChange)
      }
    },
    destroyed() {
      if (this._mediaQueryListenerExtralSmall) {
        this._mediaQueryListenerExtralSmall.removeEventListener('change', this.onMatchMediaChange)
        this._mediaQueryListenerExtralSmall = undefined
      }

      if (this._mediaQueryListenerSmall) {
        this._mediaQueryListenerSmall.removeEventListener('change', this.onMatchMediaChange)
        this._mediaQueryListenerSmall = undefined
      }

      if (this._mediaQueryListenerMedium) {
        this._mediaQueryListenerMedium.removeEventListener('change', this.onMatchMediaChange)
        this._mediaQueryListenerMedium = undefined
      }
    },

    methods: {
      onFilter() {
        this.$store.commit(COMMIT_VENUE_CHANGE_ACTIVE_FILTER_STATE, this.selectedList)

        this.$fetch()
      },
      onMatchMediaChange() {
        this.isWindowExtraSmall = this._mediaQueryListenerExtralSmall.matches
        this.isWindowSmall = this._mediaQueryListenerSmall.matches
        this.isWindowMedium = this._mediaQueryListenerMedium.matches
      }
    },

    computed: {
      isActiveVenuesFetching: function () {
        return this.$store.state.venues.getActiveVenuesQuery.isFetching
      },

      isDeletedVenuesFetching: function () {
        return this.$store.state.venues.getDeletedVenuesQuery.isFetching
      },

      maxNumberOfPageShortcuts() {
        if (this.isWindowExtraSmall) {
          return 2
        } else if (this.isWindowSmall) {
          return 5
        } else if (this.isWindowMedium) {
          return 10
        } else {
          return 25
        }
      },

      selectedVenueList: function () {
        const selectedList = this.isShowingActive
          ? this.activeVenues
          : this.deletedVenues

        if (this.isSearchEntered) {
          return selectedList.filter(value => (
            value.name.toLowerCase().includes(this.searchByNameValue.toLocaleLowerCase())))
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
        selectedList: ACTIVE_VENUE_SELECTION,
        searchByNameValue: '',
        isWindowExtraSmall: false,
        isWindowSmall: false,
        isWindowMedium: false
      }
    }
  }
</script>

<style scoped>
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

  select.admin-event-edit-page__active-state-filter {
    -moz-appearance: auto;
    -webkit-appearance: auto;
  }
</style>

<style>
.ii-pagination__list.ii-admin-event-edit-page_pagination-list {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
}

.ii-pagination__list-wrapper {
  display: flex;
}
</style>
