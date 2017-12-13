// Admin.vue
<template>
  <v-container fluid>
    <h3>Unverified Events</h3>
    <admin-events-list :events="events"></admin-events-list>
    <h3>Active Events</h3>
    <admin-events-list :events="events"></admin-events-list>
  </v-container>
</template>

<script>
import Axios from 'axios';
import AdminEventsList from '../components/AdminEventsList.vue'

export default {
  data: function () {
    return {
      events: [],
      events_verified: [],
      events_UN_verified: []
    }
  },
  mounted: function(){
    const _self=this;
    Axios.get('/events/listings')
      .then(function (response) {
        console.log("data from server: ",response.data.events);

        _self.events=response.data.events;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  components:{
      'admin-events-list': AdminEventsList
  }
}
</script>
