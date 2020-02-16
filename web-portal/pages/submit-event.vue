<template>

  <div class="container info-page">
    <v-app>
      <div class="content">
        <div class="main">
          <h1>Submit Your Event</h1>
          <p>
            Please enter your event information below.
            As soon as we review your submission, we will post it to the site and send you a confirmation email.
          </p>
        </div>
        <div v-if="partner" class="partner">
          <div>Partnering with</div>
          <img :src="partner.logo" :alt="partner.name" width="200" />
        </div>
      </div>
      <client-only>
        <submission-form :user_action="'upload'" :user_role="'regular'"></submission-form>
      </client-only>
    </v-app>
  </div>

</template>

<script>
  import SubmissionForm from '@/components/SubmissionForm.vue'
  import PartnerService from '@/services/PartnerService'

  export default {
    data: function () {
      return {
        partner: null
      }
    },
    asyncData: function ({ query }) {
      const partner = PartnerService.getPartnerForQuery(query.partner)
      return partner ? { partner } : {}
    },
    fetch: function ({ store }) {
      store.dispatch('CreateNewEvent')
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
  .container {
    width: 95%;
    max-width: unset;
  }

  .content {
    display: flex
  }

  .content .main {
    flex-grow: 1;
  }

  .content .partner {
    margin: 0 50px;
  }
</style>
