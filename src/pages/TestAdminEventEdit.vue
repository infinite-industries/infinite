// FOR TESTING ONLY!!!!!

<template>
  <v-container ii-offset>
      <h1>Edit Event Submission:</h1>
    <submission-form :event_id="TEST_ID" :user_action="'edit'" :user_role="'admin'"></submission-form>
  </v-container>
</template>


<script>
  import SubmissionForm from '../components/SubmissionForm.vue'

  export default {
    data: function () {
      return {
        TEST_ID:"d0858cc0-0478-11e8-808e-07b6d0fe568b"
      }
    },
    components:{
      'submission-form': SubmissionForm
    }
  }
</script>
