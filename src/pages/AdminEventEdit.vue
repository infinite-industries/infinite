// AdminEditEvent.vue
<template>
  <div>
    <submission-form :user_action="'edit'" :user_role="'admin'" :event_id="id"></submission-form>
  </div>
</template>

<script>
  import SubmissionForm from '../components/SubmissionForm.vue'

  export default {
      data: function(){
        return {
          // stuff
        }
      },
      props:['id'],
      mounted:function() {
        console.log("MY ID:",this.id);
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
      components:{
        'submission-form': SubmissionForm
      }
  }
</script>
