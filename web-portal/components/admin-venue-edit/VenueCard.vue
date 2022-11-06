<template>
  <div
    class="admin-venue-edit-page__venue-card"
  >
    <section class="admin-venue-edit-page__venue-card__fields">
      <div class="admin-venue-edit-page__venue-card__field">
        <input type="text" :value="venue.name" placeholder="name" @change="onFieldChanged()">

        <div>
          <span class="admin-venue-edit-page__venue-card__slug admin-venue-edit-page__venue-card__readonly">
            {{ venue.slug }}
          </span>
        </div>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <input type="text" :value="venue.address" placeholder="address" @change="onFieldChanged()">
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <input type="text" :value="venue.g_map_link" placeholder="google maps link" @change="onFieldChanged()">
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <span class="admin-venue-edit-page__venue-card__readonly">{{ venue.createdAt }}</span>
      </div>

      <div class="admin-venue-edit-page__venue-card__field">
        <span class="admin-venue-edit-page__venue-card__readonly">{{ venue.updatedAt }}</span>
      </div>
    </section>

    <div class="admin-venue-edit-page__venue-card__footer">
      <div class="admin-venue-edit-page__venue-card__update-wrapper">
        <button
          class="admin-venue-edit-page__venue-card__button"
          :disabled="isActivating || isPristine"
          title="Creates a new venue based on the entries and soft deletes the old venue, useful if a venue moves or changes names."
        >
          Replace Venue (Venue Moved)
        </button>

        <button
          class="admin-venue-edit-page__venue-card__button"
          :disabled="isActivating || isPristine"
          title="Updates the value of the venue in place, useful when you want fix a typo."
        >
          Correct Venue Values
        </button>
      </div>

      <div class="admin-venue-edit-page__venue-card__delete-wrapper">
        <button
          v-if="venue.is_soft_deleted === false"
          class="admin-venue-edit-page__venue-card__button"
          @click="onDeleteVenueClick()"
          :disabled="isDeleting"
          title="Soft deletes this venue. It will no longer be shown to users in the ui but is still in the database and linked to past events for the historical record."
        >
          Delete Venue
        </button>

        <button
          v-if="venue.is_soft_deleted === true"
          class="admin-venue-edit-page__venue-card__button"
          @click="onUndoDeleteVenueClick()"
          :disabled="isActivating"
          title="Restores a previously soft deleted venue. It will again be shown to users as an option to select when choosing a venue."
        >
          Undelete Venue
        </button>
      </div>

      <div class="admin-venue-edit-page__venue-card__footer-load-bar">
        <VenueSpinner :is-shown="isDeleting">Processing Delete...</VenueSpinner>
      </div>
    </div>
  </div>
</template>

<script>
  import { ACTIVATE_VENUE, DELETE_VENUE } from '../../store/venues'
  import VenueSpinner from './VenueSpinner'
  import getToken from '../../helpers/getToken'

  export default {
    name: 'VenueCard',
    components: { VenueSpinner },
    props: ['venue'],
    data: function () {
      return {
        isChanged: false
      }
    },
    methods: {
      onDeleteVenueClick: function () {
        const id = this.venue.id
        const idToken = this.idToken

        this.$store.dispatch(DELETE_VENUE, { id, idToken })
      },
      onFieldChanged: function () {
        this.isChanged = true
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
      idToken: function () {
        return getToken(this.$auth)
      },
      isPristine: function () {
        return !this.isChanged
      }
    }
  }
</script>

<style scoped>
  .admin-venue-edit-page__venue-card__field {
    margin-bottom: 1rem;
  }

  .admin-venue-edit-page__venue-card__readonly {
    font-style: italic;
    color: dimgray;
  }

  .admin-venue-edit-page__venue-card__slug {
    margin-left: 1rem;
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
    display: inline-block;
  }
</style>
