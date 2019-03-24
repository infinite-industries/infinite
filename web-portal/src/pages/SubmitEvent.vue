// SubmitEvent.vue
<template>
  <div>
    <submission-form :user_action="'upload'" :user_role="'regular'" :venues="venues"></submission-form>
  </div>
</template>

<script>
import SubmissionForm from '../components/SubmissionForm.vue'
export default {
  data: function () {
    return {
      venues: [],
    }
  },
  components:{
    'submission-form': SubmissionForm
  }
}
</script>
