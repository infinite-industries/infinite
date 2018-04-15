<template>
  <v-app id="infinite-industries">
    <v-toolbar class="deep-purple" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title @click="RouteTo('/')" class="clickable">
        <span class="hidden-sm-and-down">Infinite Industries</span>
        <span class="hidden-md-and-up">I.I</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline @click.stop="RouteTo('/submit-event')">
        <span class="hidden-sm-and-down">Submit Your Event</span>
        <span class="hidden-md-and-up">SUBMIT</span>
      </v-btn>
      <v-btn outline @click.stop="OpenEmailSubscribe()">
        <span class="hidden-sm-and-down">Subscribe to our Mail List</span>
        <span class="hidden-md-and-up">SUBSCRIBE</span>
      </v-btn>
      <nav-menu></nav-menu>
    </v-toolbar>
    <main id="content-wrapper">
      <notify-user></notify-user>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>

import NavMenu from './components/NavMenu.vue'
import NotifyUser from './components/NotifyUser.vue'

import EventsFromStore from './helpers/ComponentEventBus.js'

import axios from 'axios'
import { getIdToken } from './helpers/auth'

export default {
  data () {
    return {
      notification: {
        visible: false,
        type: '',
        message: '',
        timeout: false
      }
    }
  },
  // setting access token in created, so that it comes before mounted hooks in child components
  created: function() {
    if (getIdToken()) {
      axios.defaults.headers.common['x-access-token'] = getIdToken();
    }
  },
  mounted: function(){

    const _self = this
    // Inhale mock user data
    this.$store.dispatch('LoadAllUserData')

    // Clean up localForage if admin pannel deletes an event
    EventsFromStore.$on('CALENDAR_EVENT_DELETED', function(data){
      console.log("Delete the Event ", data.id);
    })

    // Clean up localForage if admin verifies the event
    EventsFromStore.$on('CALENDAR_EVENT_VERIFIED', function(data){
      console.log("EVENT CENTRAL cleanup --- Remove Verified Event", data.id);
    })

  },
  methods: {
    OpenEventSubmitter: function(){
      window.location.assign('https://event-add.glitch.me/');
    },
    OpenEmailSubscribe: function() {
      window.location.assign('/subscribe-email');
    },
    RouteTo: function(route_to_page){
      this.$router.push({ path: route_to_page })
    },
    ConfirmAction: function(action_confirmation_message){
      // DISPATCH vuex
      // EventBus.$emit(action_confirmation_message);
      // this.notification = {
      //   visible: true,
      //   type: 'info',
      //   message: action_confirmation_message
      // }
    }

  },
  components: {
    'nav-menu': NavMenu,
    'notify-user': NotifyUser
  }
}
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
</style>
