<template>
    <v-container fluid>
      <events-list :events="events"></events-list>
    </v-container>
</template>

<script>
import Axios from 'axios';

import EventsList from '../components/EventsList.vue'

export default {
  data: function () {
    return {
      events: []
    }
  },
  mounted: function(){
    var _self = this;
    Axios.get('/events/listings')
      .then(function (response) {
        // console.log("data from server: ",response.data.events);
        _self.events = response.data.events;

        if (window.addtocalendar)if(typeof window.addtocalendar.start == "function")return;
        if (window.ifaddtocalendar == undefined) {
          window.ifaddtocalendar = 1;
          var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
          s.type = 'text/javascript';s.charset = 'UTF-8';s.async = true;
          s.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
          var h = d[g]('body')[0];h.appendChild(s);
        }

      })
      .catch(function (error) {
        console.log(error);
      });
  },
  components:{
    'events-list': EventsList
  }

}
</script>
