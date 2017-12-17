<template>
  <v-app id="infinite-industries">
    <v-toolbar class="indigo" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Infinite Industries</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline class="indigo lighten-2" @click.stop="OpenEventSubmitter()">Submit Your Event</v-btn>
      <v-menu class="main-nav">
        <v-btn outline class="indigo lighten-2" offset-y slot="activator">
          <v-icon>account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="item in nav_items" :key="item.title" @click.stop="RouteTo(item.route)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <main id="content-wrapper">
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>

import EventBus from './helpers/EventBus.js';

export default {
  data () {
    return {
      nav_items: [
        { title: 'Home', route:'/'},
        { title: 'Login', route: '/login'},
        { title: 'Admin', route: '/admin'},
        { title: 'About', route: '/about'},
        { title: 'Your Events', route: '/your-events'},
        { title: 'Your Settings', route: '/your-settings'},
        { title: 'Contact', route: '/contact'},
        { title: 'Logout', route: '/logout'},
      ]
    }
  },
  mounted: function(){

    // -------------- EVENT BUS --------------

    // Add event card to my events list
    EventBus.$on('ADD_EVENT_TO_MY_LIST', function(event_id){

    })

    // Remove event card from my events list
    EventBus.$on('REMOVE_EVENT_FROM_MY_LIST', function(event_id){

    })

    // Create a new list
    EventBus.$on('CREATE_NEW_LIST', function(list_id){

    })

    // Add list to the List of Lists I follow
    EventBus.$on('ADD_LIST', function(list_id){

    })

    // Remove list from the List of Lists I follow
    EventBus.$on('REMOVE_LIST', function(list_id){

    })

    // Invite another user to my list
    EventBus.$on('INVITE_TO_LIST', function(list_id){

    })

    // Follow List
    EventBus.$on('FOLLOW_LIST', function(list_id){

    })

    // Create event
    EventBus.$on('CREATE_EVENT', function(_event){

    })

    // Update event
    EventBus.$on('UPDATE_EVENT', function(payload){
      window.alert("event updated:"+payload._event.id)
    })

    // Delete event
    EventBus.$on('DELETE_EVENT', function(payload){
      window.alert("event deleted:"+payload._id)
    })

    // Verify event
    EventBus.$on('VERIFY_EVENT', function(payload){
      window.alert("event verified:"+payload._id)
    })
  },
  methods: {
    OpenEventSubmitter: function(){
      window.location.assign('https://event-add.glitch.me/');
    },
    RouteTo: function(route_to_page){
      this.$router.push({ path: route_to_page })
    }
  }
}
</script>
