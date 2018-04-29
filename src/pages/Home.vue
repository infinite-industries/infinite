<template>
    <v-container fluid>
      <!-- <venue-picker :venues="venues"></venue-picker> -->
      <h1>Upcoming Events:</h1>
      <events-list></events-list>
    </v-container>
</template>

<script>
import axios from 'axios';

import EventsList from '../components/EventsList.vue'
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
      return this.$store.getters.GetUser.logged_in
    },
    isAdmin: function() {
      return this.$store.getters.GetUser.admin_role
    }
  },
  methods: {
    debug: function() {
      
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
    'events-list': EventsList,
    // 'venue-picker': VenuePicker
  }

}
</script>
