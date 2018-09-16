// SubmitEvent.vue
<template>
  <div>
    <submission-form :user_action="'upload'" :user_role="'regular'" :venues="venues"></submission-form>
  </div>
</template>

<script>
  import Axios from 'axios'
  import SubmissionForm from '../components/SubmissionForm.vue'
  export default {
    data: function () {
      return {
        venues: [],
      }
    },
    beforeRouteEnter (to, from, next) {
      Axios.get('/venues').then( response => {     // need to move into vuex
        next(vm => vm.venues = response.data.venues) 
      })
      .catch(function(error) {
        console.log(error)
        window.alert("Ooops... We were not able to load a list of venues. Please reload the page. If the problem continues, contact us. We will fix this ASAP!")
        next()
      })
    },
    components:{
      'submission-form': SubmissionForm
    }
  }
</script>
