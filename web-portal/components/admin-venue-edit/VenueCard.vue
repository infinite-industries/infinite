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
            placeholder="name"
            @change="onFieldChanged($event)"
            :disabled="!isActiveListShowing"
          >
        </label>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <label>Address:
          <input
            name="address"
            type="text"
            :value="venue.address"
            placeholder="address"
            @change="onFieldChanged($event)"
            :disabled="!isActiveListShowing"
          >
        </label>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <label>Google Maps Link:
          <input
            name="g_map_link"
            type="text"
            :value="venue.g_map_link"
            placeholder="google maps link"
            @change="onFieldChanged($event)"
            :disabled="!isActiveListShowing"
          >
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

  export default {
    name: 'VenueCard',
    components: { VenueSpinner },
    props: ['venue'],
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
      onFieldChanged: function (event) {
        const fieldName = event.target.name
        const newValue = event.target.value

        const venue = {
          ...this.venue,
          [fieldName]: newValue
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

  .admin-venue-edit-page__venue-card__button:disabled {
   background-color: lightgray;
  }

  .admin-venue-edit-page__venue-card__footer button {
    color: white;
    background-color: #000;
    border-radius: 5px;
    padding: 7px 11px;
    margin-right: 1rem;
  }

  .admin-venue-edit-page__venue-card__footer-load-bar {
    width: 100%;
  }
</style>
