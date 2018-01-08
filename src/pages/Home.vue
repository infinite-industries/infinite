<template>
    <v-container fluid>
      <events-list></events-list>
    </v-container>
</template>

<script>
import Axios from 'axios';

import EventsList from '../components/EventsList.vue'

export default {
  data: function () {
    return {
      //
    }
  },
  computed:{
    events: function(){
      return this.$store.getters.GetAllLocalEvents
    }
  },
  mounted: function(){
    this.$store.dispatch('LoadAllLocalEventData')

    if (window.addtocalendar)if(typeof window.addtocalendar.start == "function")return;
    if (window.ifaddtocalendar == undefined) {
      window.ifaddtocalendar = 1;
      var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
      s.type = 'text/javascript';s.charset = 'UTF-8';s.async = true;
      s.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
      var h = d[g]('body')[0];h.appendChild(s);
    }
  },
  components:{
    'events-list': EventsList
  }

}
</script>
