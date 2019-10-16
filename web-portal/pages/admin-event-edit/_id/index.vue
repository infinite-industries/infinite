<template>
  <div class="container admin-page">
    <client-only>
      <submission-form :user_action="'edit'" :user_role="'admin'" :event_id="id"></submission-form>
    </client-only>
  </div>
</template>

<script>
  import SubmissionForm from '@/components/SubmissionForm.vue'
  // import { ApiService } from '../services/ApiService'

  export default {
    middleware: 'auth',
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
    fetch: function ({ store, params }) {
      return Promise.all([
        store.dispatch('admin/LoadCurrentEvent', params.id),
        store.dispatch('LoadAllVenueData')
      ])
    },
    props: [
      'id'
    ],
    mounted: function () {
      console.log('MY ID:', this.id)
      // this.$store.dispatch('LoadCurrentEvent', this.id)
    },
    // computed: {
    //   values_to_edit: function() {
    //     return this.$store.getters.GetCurrentEvent
    //   }
    // },
    // methods: {
    //
    // },
    components: {
      'submission-form': SubmissionForm
    }
  }
</script>

<style scoped>
  .admin-page {
    background: white;
    color: black;
    border-radius: 10px;
    width: 95%;
    max-width: unset;
  }
</style>
