<template>
  <div class="container admin-page">
    <div v-if="$store.getters.GetUserDataLoading">
      loading...
    </div>

    <v-app v-if="!$store.getters.GetUserDataLoading">
      <client-only>
        <submission-form :user_action="'edit'" :user_role="'admin'" :event_id="id"></submission-form>
      </client-only>
    </v-app>
  </div>
</template>

<script>
  import { useStore } from "vuex"
  import SubmissionForm from '@/components/SubmissionForm.vue'
  import { FETCH_ACTIVE_VENUES } from '../../../store/venues'

  export default {
    props: [
      'id'
    ],
    async setup () {
      definePageMeta({
        layout: 'admin',
        middleware: ['auth'],
        validate: function ({ params }) {
          return !!params.id
        }
      })

      const { params } = useRoute()
      const store = useStore()
      await callOnce('fetchEventEditData', async () => {
        await Promise.all([
          store.dispatch('admin/LoadEvent', { id: params.id }),
          store.dispatch(FETCH_ACTIVE_VENUES)
        ])
      }, { mode: 'navigation' })

      const eventTitle = store.getters.GetCurrentEvent?.title
      useHead({
        title: 'Edit event - ' + (eventTitle ?? "")
      })

      return {}
    },
    data: function () {
      return {
        venues: []
      }
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
