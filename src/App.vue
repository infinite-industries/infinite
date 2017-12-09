<template>
  <v-app id="example-1" toolbar>
    <!-- <v-navigation-drawer
      persistent
      v-model="drawer"
      light
      enable-resize-watcher
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>lightbulb_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Killer Feature</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Search</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>sentiment_very_satisfied</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <v-toolbar class="indigo" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Infinite Industries</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline class="indigo lighten-2" @click.stop="OpenEventSubmitter()">Submit Your Event</v-btn>
    </v-toolbar>
    <main>
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
    </main>
  </v-app>
</template>

<script>

import Axios from 'axios';
// import AddToCallendar from 'addtocalendar'; NEED TO WRAP THIS

export default {
  data () {
    return {
      events: [],
      drawer: false
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
    },
    OpenEventSubmitter: function(){
      window.location.assign('https://event-add.glitch.me/');
    }
  }
}
</script>
