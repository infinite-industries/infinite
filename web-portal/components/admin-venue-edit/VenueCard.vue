<template>
  <div
    class="admin-venue-edit-page__venue-card"
  >
    <div class="admin-venue-edit-page__venue-card__footer-load-bar">
      <VenueSpinner :is-shown="isDeleting || isUpdating">Processing...</VenueSpinner>
    </div>

    <section class="admin-venue-edit-page__venue-card__fields" v-if="!isDeleting && !isUpdating">
      <div class="admin-venue-edit-page__venue-card__field">
        <label>Name:
          <input
            name="name"
            type="text"
            :value="venue.name"
            placeholder="Name"
            @change="onFieldChanged($event)"
            :disabled="!isActiveListShowing"
          >
        </label>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <label>Address:
          <br/>
          <span class="admin-venue-edit-page__venue-card__readonly">
            {{ venue.address }}
          </span>
          <input
            name="street"
            type="text"
            :value="venue.street"
            placeholder="Street Address"
            @change="onFieldChanged($event)"
            :disabled="!isActiveListShowing"
          >
          <span class="admin-venue-edit-page__venue-card__flex_fields">
            <input
              name="city"
              type="text"
              :value="venue.city"
              placeholder="City"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >
            <input
              name="state"
              type="text"
              :value="venue.state"
              placeholder="State"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >
            <input
              name="zip"
              type="text"
              :value="venue.zip"
              placeholder="Zip"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >
            <input
              name="neighborhood"
              type="text"
              :value="venue.neighborhood"
              placeholder="Neighborhood"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >
          </span>
        </label>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <label>Google Maps Link:
          <input
            name="g_map_link"
            type="text"
            :value="venue.g_map_link"
            placeholder="Google Maps Link"
            @change="onFieldChanged($event)"
            :disabled="!isActiveListShowing"
          >
        </label>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <label>Latitude / Longitude / Altitude:
          <span class="admin-venue-edit-page__venue-card__flex_fields">
            <input
              name="gps_lat"
              type="text"
              :value="venue.gps_lat"
              placeholder="Latitude"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >
            <input
              name="gps_long"
              type="text"
              :value="venue.gps_long"
              placeholder="Longitude"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >
            <input
              name="gps_alt"
              type="text"
              :value="venue.gps_alt"
              placeholder="Altitude"
              @change="onFieldChanged($event)"
              :disabled="!isActiveListShowing"
            >

            <button
              class="admin-venue-edit-page__venue-card__button admin-venue-edit-page__venue-card__find-gps"
              :disabled="this.isActivating"
              @click="onFindUsingMapLinksClick()"
            >
              {{ searchForGpsCoordinatesText }}
            </button>
          </span>
        </label>
      </div>

      <div>
        <label>Slug:</label>
        <span class="admin-venue-edit-page__venue-card__slug admin-venue-edit-page__venue-card__readonly">
          {{ venue.slug }}
        </span>
      </div>

      <div>
        <label>Created At:</label>
        <span class="admin-venue-edit-page__venue-card__readonly">{{ venue.createdAt }}</span>
      </div>

      <div>
        <label>Updated At:</label>
        <span class="admin-venue-edit-page__venue-card__readonly">{{ venue.updatedAt }}</span>
      </div>
    </section>

    <div class="admin-venue-edit-page__venue-card__footer" v-if="!isUpdating && !isDeleting">
      <div class="admin-venue-edit-page__venue-card__update-wrapper">
        <span title="Updates the value of the venue in place, useful when you want to fix a typo.">
          <button
            class="admin-venue-edit-page__venue-card__button"
            :disabled="isUpdateDisabled"
            @click="onVenueUpdateClick()"
          >
            Correct Venue Values
          </button>
        </span>

        <button
          class="admin-venue-edit-page__venue-card__button"
          :disabled="isUpdateDisabled"
          title="Creates a new venue based on the entries and soft deletes the old venue, useful if a venue moves or changes names."
          @click="onVenueReplaceClick()"
        >
          Replace Venue (Venue Moved)
        </button>
      </div>

      <div class="admin-venue-edit-page__venue-card__delete-wrapper">
        <span title="Soft deletes this venue. It will no longer be shown to users in the ui but is still in the database and linked to past events for the historical record.">
          <button
            v-if="venue.is_soft_deleted === false"
            class="admin-venue-edit-page__venue-card__button"
            @click="onDeleteVenueClick()"
            :disabled="isDeleting"
          >
            Delete Venue
          </button>
        </span>

        <span title="Restores a previously soft deleted venue. It will again be shown to users as an option to select when choosing a venue.">
          <button
            v-if="venue.is_soft_deleted === true"
            class="admin-venue-edit-page__venue-card__button"
            @click="onUndoDeleteVenueClick()"
            :disabled="isActivating"
          >
            Undelete Venue
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ACTIVATE_VENUE,
    ACTIVE_VENUE_SELECTION,
    COMMIT_VENUE_UPDATE,
    DELETE_VENUE,
    REPLACE_VENUE,
    UPDATE_VENUE
  } from '@/store/venues'
  import VenueSpinner from './VenueSpinner'
  import getToken from '../../helpers/getToken'
  import { FETCH_GPS_COORDINATES_FROM_URL } from '../../store/venues'

  export default {
    name: 'VenueCard',
    components: { VenueSpinner },
    props: ['venue'],
    data: function () {
      return {
        fetchingGpsCoordinates: false,
        fetchingGpsCoordinatesError: null
      }
    },
    methods: {
      onVenueUpdateClick: function () {
        const venue = {
          ...this.venue
        }
        const idToken = this.idToken

        this.$store.dispatch(UPDATE_VENUE, { venue, idToken })
      },
      onVenueReplaceClick: function () {
        const oldVenue = this.venue
        const newVenue = {
          ...this.venue
        }
        const idToken = this.idToken

        this.$store.dispatch(REPLACE_VENUE, { newVenue, oldVenue, idToken })
      },
      onDeleteVenueClick: function () {
        const id = this.venue.id
        const idToken = this.idToken

        this.$store.dispatch(DELETE_VENUE, { id, idToken })
      },
      onFindUsingMapLinksClick: function () {
        this.fetchingGpsCoordinates = true
        this.fetchingGpsCoordinatesError = null

        this.$store.dispatch(FETCH_GPS_COORDINATES_FROM_URL, this.venue)
          .then((resp) => {
            this.fetchingGpsCoordinates = false

            const venue = {
              ...this.venue,
              gps_lat: resp.latitude,
              gps_long: resp.longitude,
              gps_alt: resp.altitude
            }

            this.$store.commit(COMMIT_VENUE_UPDATE, { venue })
          }).catch((error) => {
            this.fetchingGpsCoordinates = false
            this.fetchingGpsCoordinatesError = error
          })
      },
      onFieldChanged: function (event) {
        const fieldName = event.target.name
        const newValue = event.target.value

        let venue = {
          ...this.venue,
          [fieldName]: newValue
        }

        if (['street', 'city', 'state', 'zip', 'neighborhood'].includes(fieldName)) {
          venue = {
            ...venue,
            'address': [
              venue.street,
              venue.city,
              venue.state,
              venue.zip,
              venue.neighborhood
            ].filter(a => a).join(', ')
          }
        }

        this.$store.commit(COMMIT_VENUE_UPDATE, { venue })
      },
      onUndoDeleteVenueClick: function () {
        const id = this.venue.id
        const idToken = this.idToken

        this.$store.dispatch(ACTIVATE_VENUE, { id, idToken })
      }
    },
    computed: {
      isDeleting: function () {
        return this.$store.state.venues.deleteVenues.isFetching
      },
      isActivating: function () {
        return this.$store.state.venues.activateVenueQuery.isFetching
      },
      isUpdating: function () {
        const queryEntry = this.$store.state.venues.venueUpdateQueries.queriesByVenueId[this.venue.id]

        return !!queryEntry && queryEntry.isFetching
      },
      isSearchForCoordinates: function () {
        return this.fetchingGpsCoordinates ? this.fetchingGpsCoordinates : false
      },
      searchForGpsCoordinatesText: function () {
        return this.isSearchForCoordinates ? '...searching' : 'Find Using Map Links'
      },
      error: function () {
        const queryEntry = this.$store.state.venues.venueUpdateQueries[this.venue.id]

        return queryEntry && queryEntry.error
      },
      idToken: function () {
        return getToken(this.$auth)
      },
      isPristine: function () {
        return !this.$store.state.venues.venuesEdited[this.venue.id]
      },
      isUpdateDisabled: function () {
        return this.isActivating || this.isPristine
      },
      isActiveListShowing: function () {
        return this.$store.state.venues.activeFilterState === ACTIVE_VENUE_SELECTION
      }
    }
  }
</script>

<style scoped>
  .admin-venue-edit-page__venue-card__field {
    margin-bottom: 1rem;
  }
  .admin-venue-edit-page__venue-card__field label {
    display: inline-block;
    font-weight: bold;
    width: 100%;
  }
  .admin-venue-edit-page__venue-card__field input {
    width: 100%;
    border: 1px solid black;
    padding: 0.5rem;
    font-weight: normal;
    margin-top: 0.5rem;
  }
  .admin-venue-edit-page__venue-card__readonly {
    font-style: italic;
    color: dimgray;
  }

  .admin-venue-edit-page__venue-card {
    border: black 1px solid;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .admin-venue-edit-page__venue-card__fields {
    margin-bottom: 1rem;
  }

  .admin-venue-edit-page__venue-card__footer {
    margin-bottom: 1rem;
    display: flex;
  }

  .admin-venue-edit-page__venue-card__delete-wrapper {
    flex: 1;
  }

  .admin-venue-edit-page__venue-card__delete-wrapper .admin-venue-edit-page__venue-card__button {
    float: right;
  }

  .admin-venue-edit-page__venue-card__button {
    color: white;
    background-color: #000;
    border-radius: 5px;
    padding: 7px 11px;
    margin-right: 1rem;
  }

  .admin-venue-edit-page__venue-card__button:disabled {
   background-color: lightgray;
  }

  .admin-venue-edit-page__venue-card__footer-load-bar {
    width: 100%;
  }

  .admin-venue-edit-page__venue-card__flex_fields {
    display: flex;
  }

  .admin-venue-edit-page__venue-card__flex_fields {
    display: flex;
    justify-content: space-between;
  }

  .admin-venue-edit-page__venue-card__flex_fields input {
    margin-right: 1rem;
  }

  .admin-venue-edit-page__venue-card__find-gps {
    width: 100%;
  }

</style>
