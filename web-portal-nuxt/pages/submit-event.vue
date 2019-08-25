<template>

  <div class="container info-page">
    <v-app>
      <h1>Submit Your Event</h1>

      <p>
        Please enter your event information below.
        As soon as we review your submission, we will post it to the site and send you a confurmation email.
      </p>
      <no-ssr>
        <div>
          <submission-form :user_action="'upload'" :user_role="'regular'" :venues="venues"></submission-form>
        </div>
      </no-ssr>
    </v-app>
  </div>

</template>

<script>
  import SubmissionForm from '@/components/SubmissionForm.vue'

  export default {
    data: function () {
      return {
        venues: []
      }
    },
    methods: {

    },
    fetch: function ({ store }) {
      return Promise.all([
        store.dispatch('LoadAllVenueData')
      ])
    },
    components: {
      'submission-form': SubmissionForm
    }
  }
</script>

<style scoped>

</style>
