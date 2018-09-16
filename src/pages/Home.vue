<template>
  <div>
    <ii-list-viewer :calendar_events="events"/>
  </div>
</template>

<script>
import axios from 'axios';

import ListViewer from '../components/ii-list-viewer.vue'
// import EventsList from '../components/EventsList.vue'
// import VenuePicker from '../components/VenuePicker.vue'

export default {
  data: function () {
    return {
      // venues: []
    }
  },
  computed:{
    events: function(){
      return this.$store.getters.GetAllLocalEvents
    },
    loggedIn: function() {
      //return this.$store.getters.GetUser.logged_in
    },
    isAdmin: function() {
      return this.$store.getters.GetUser.admin_role
    }
  },
  mounted: function() {
    this.$store.dispatch('LoadAllLocalEventData')
    console.log("TEST HOME");

    // axios.get('/venues').then( response => {
    //   this.venues = response.data.venues;
    // }).catch( err => {
    //   console.log(err);
    // })
  },
  components:{
    'ii-list-viewer': ListViewer
  }

}
</script>


<style scoped></style>
