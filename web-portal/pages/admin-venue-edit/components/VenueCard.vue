<template>
  <div
    class="admin-venue-edit-page__venue-card"
  >
    <section class="admin-venue-edit-page__venue-card__fields">
      <div>
        {{ venue.name }}
      </div>

      <div>
        {{ venue.slug }}
      </div>

      <div>
        {{ venue.address }}
      </div>

      <div>
        {{ venue.g_map_link }}
      </div>

      <div>
        {{ venue.createdAt }}
      </div>

      <div>
        {{ venue.updatedAt }}
      </div>
    </section>

    <div class="admin-venue-edit-page__venue-card__footer">
      <button
        v-if="venue.is_soft_deleted === false"
        class="admin-venue-edit-page__venue-card__button"
        @click="onDeleteVenueClick()"
        :disabled="isDeleting"
      >
        Delete Event
      </button>

      <button
        v-if="venue.is_soft_deleted === true"
        class="admin-venue-edit-page__venue-card__button"
        @click="onUndoDeleteVenueClick()"
        :disabled="isActivating"
      >
        Undelete Event
      </button>

      <div class="admin-venue-edit-page__venue-card__footer-load-bar">
        <VenueSpinner :is-shown="isDeleting">Processing Delete...</VenueSpinner>
      </div>
    </div>
  </div>
</template>

<script>
  import { ACTIVATE_VENUE, DELETE_VENUE } from '../../../store/venues'
  import VenueSpinner from './VenueSpinner'

  export default {
    name: 'VenueCard',
    components: { VenueSpinner },
    props: ['venue'],
    methods: {
      onDeleteVenueClick: function () {
        const id = this.venue.id
        const idToken = this.idToken

        this.$store.dispatch(DELETE_VENUE, { id, idToken })
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
        return this.$auth.$storage.getState('_token.auth0')
      }
    }
  }
</script>

<style>
  .admin-venue-edit-page__venue-card {
    border: black 1px solid;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .admin-venue-edit-page__venue-card__fields,
  .admin-venue-edit-page__venue-card__footer {
    margin-bottom: 1rem;
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
