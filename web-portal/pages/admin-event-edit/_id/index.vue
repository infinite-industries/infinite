<template>
  <div class="container admin-page">
    <v-app>
      <client-only>
        <submission-form :user_action="'edit'" :user_role="'admin'" :event_id="id"></submission-form>
      </client-only>
    </v-app>
  </div>
</template>

<script>
  import SubmissionForm from '@/components/SubmissionForm.vue'
  import { FETCH_ACTIVE_VENUES } from '../../../store/venues'

  export default {
    props: [
      'id'
    ],
    middleware: 'auth',
    layout: 'admin',
    head: function () {
      const event = this.$store.getters.GetCurrentEvent
      return {
        title: 'Edit event - ' + (event ? event.title : '')
      }
    },
    validate: function ({ params }) {
      return !!params.id
    },
    data: function () {
      return {
        venues: []
      }
    },
    fetch: function ({ store, params, app }) {
      const idToken = app.$auth.$storage.getState('_token.auth0')

      return Promise.all([
        store.dispatch('admin/LoadEvent', { id: params.id, idToken }),
        store.dispatch(FETCH_ACTIVE_VENUES)
      ])
    },
    components: {
      'submission-form': SubmissionForm
    }
  }
</script>

<style scoped>
  .admin-page {
    width: 95%;
    max-width: unset;
  }
</style>
