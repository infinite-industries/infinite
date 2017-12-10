<template>
    <v-container fluid>
       <v-layout row wrap>

        <template v-for= "event in events">
         <v-flex sm4 lg3 event-card-container v-if="true">
            <v-card style="margin-bottom: 10px; min-height: 100%;" >
              <v-card-media :src="event.image" height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{event.title}}</h3>
                  <div class="event-venue">
                    {{event.venues[0]}}
                  </div>
                  <div class="event-date" v-html="event.when"></div>
                  <div>{{event.brief_description}}...</div>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn flat class="orange--text" @click.stop="ShowEvent(event.id)">More Info</v-btn>
                <span class="addtocalendar atc-style-blue">
                    <var class="atc_event">
                        <var class="atc_date_start">{{event.time_start}}</var>
                        <var class="atc_date_end">{{event.time_end}}</var>
                        <var class="atc_timezone">America/Detroit</var>
                        <var class="atc_title">{{event.title}}</var>
                        <var class="atc_description">{{event.brief_description}}</var>
                        <var class="atc_ical_filename">{{event.slug}}</var>
                        <var class="atc_location">{{event.venues[0]}}</var>
                    </var>
                </span>
              </v-card-actions>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </v-container>

</template>

<script>
import Axios from 'axios';
// import AddToCallendar from 'addtocalendar'; NEED TO WRAP THIS


export default {
  data: function () {
    return {
      events: []
    }
  },
  mounted: function(){
    var self = this;
    Axios.get('/events/listings')
      .then(function (response) {
        console.log("data from server: ",response.data.events);
        self.events = response.data.events;

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
  methods: {
    ShowEvent: function(event_id){
      console.log(event_id);
      window.location.assign('/events/'+ event_id);
    }
  }

}
</script>
