<template>
  <v-app id="infinite-industries">
    <v-toolbar class="deep-purple" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Infinite Industries</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline @click.stop="OpenEventSubmitter()">Submit Your Event</v-btn>
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
    this.$store.dispatch('LoadUserData')

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
