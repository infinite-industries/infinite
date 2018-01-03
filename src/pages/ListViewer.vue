// ListViewer.vue
// Preview individual lists before
<template>
  <v-container grid-list-xs id="static-page-wrapper">
    <h2>{{title}}</h2>
    <h4>{{description}}</h4>
   <!--
   List name
   Description
   edit option if "mine"
   abandon option if "mine"
   follow option if "clean"
   Contact options if public
  -->
  <events-list :events="events"></events-list>

  </v-container>
</template>

<script>
import Axios from 'axios';

import EventsList from '../components/EventsList.vue'

  export default {
    props:['id','type'],
    data: function () {
      return {
        title:'',
        description: '',
        events: []
      }
    },
    mounted: function(){
      const _self = this;
      const req_url = "/lists/"+this.id
      Axios.get(req_url)
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          _self.title = _response.data.list_name
          _self.description = _response.data.description
          _self.events = _response.data.events

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
