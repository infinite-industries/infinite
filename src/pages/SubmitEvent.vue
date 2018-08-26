// SubmitEvent.vue
<template>
  <div>
    <submission-form :user_action="'upload'" :user_role="'regular'"></submission-form>
  </div>
</template>

<script>
  import SubmissionForm from '../components/SubmissionForm.vue'
  export default {
    data: function () {
      return {
        //stuff
      }
    },
    components:{
      'submission-form': SubmissionForm
    }
  }
</script>
