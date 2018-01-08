// ListViewer.vue
// Preview individual lists before
<template>
  <v-container fluid>
    <h4>{{list_metadata.list_name}}</h4>
    <p>{{list_metadata.description}}</p>
   <!--
   List name
   Description
   edit option if "mine"
   abandon option if "mine"
   follow option if "clean"
   Contact options if public
  -->
  <events-list :id="id" :type="type"></events-list>

  </v-container>
</template>

<script>
import Axios from 'axios';

import EventsList from '../components/EventsList.vue'

  export default {
    props:['id','type'],
    data: function () {
      return {
        //
      }
    },
    computed:{
      list_metadata: function(){
        return this.$store.getters.GetCurrentList
      }
    },
    mounted: function(){

      this.$store.dispatch('LoadListData',this.id)

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
