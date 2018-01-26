<template>
  <v-app id="infinite-industries">
    <v-toolbar class="deep-purple" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Infinite Industries</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline @click.stop="RouteTo('/submit-event')">Submit Your Event</v-btn>
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

import EventsFromStore from './helpers/NotificationEventBus.js'

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
  mounted: function(){

    const _self = this
    // Inhale mock user data
    this.$store.dispatch('LoadAllUserData')

    // Clean up localForage if admin pannel deletes an event
    EventsFromStore.$on('CALENDAR_EVENT_DELETED', function(data){
      console.log("Delete the Event ", data.id);
      this.$vlf.removeItem(data.id)
    })

    // Clean up localForage if admin verifies the event
    EventsFromStore.$on('CALENDAR_EVENT_VERIFIED', function(data){
      console.log("Remove Verified Event", data.id);
      this.$vlf.removeItem(data.id)
    })

  },
  methods: {
    OpenEventSubmitter: function(){
      window.location.assign('https://event-add.glitch.me/');
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
