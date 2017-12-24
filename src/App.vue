<template>
  <v-app id="infinite-industries">
    <v-toolbar class="indigo" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Infinite Industries</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline class="indigo lighten-2" @click.stop="OpenEventSubmitter()">Submit Your Event</v-btn>
      <nav-menu></nav-menu>
    </v-toolbar>
    <main id="content-wrapper">
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>

import EventBus from './helpers/EventBus.js';

import Axios from 'axios';

import NavMenu from './components/NavMenu.vue'

export default {
  data () {
    return {
      //
    }
  },
  mounted: function(){

    // -------------- EVENT BUS --------------

    // Add event card to my events list
    EventBus.$on('ADD_EVENT_TO_MY_LIST', function(payload){
      window.alert("event:"+payload._event.id+" added to list:"+payload._list.id)
    })

    // Remove event card from my events list
    EventBus.$on('REMOVE_EVENT_FROM_MY_LIST', function(payload){
      window.alert("event:"+payload._event.id+" removed to list:"+payload._list.id)
    })



    // Create a new list
    EventBus.$on('CREATE_NEW_LIST', function(){

      Axios.post('/lists/create-new', {eventList: {name: 'sample name'}})
        .then(function (_response) {
          let _list={id:"new list ID - wll get from server"}
          window.alert("Created a list with ID: "+_response.data.id)
        })
        .catch(function (error) {
          console.log(error);
        });
    })

    // Follow List
    EventBus.$on('FOLLOW_LIST', function(payload){
      window.alert("Followed List:"+payload._id)
    })

    // Unfollow list from the List of Lists I follow
    EventBus.$on('UNFOLLOW_LIST', function(payload){
      window.alert("Unfollowed List:"+payload._id)
    })

    // Invite another user to my list
    EventBus.$on('INVITE_TO_LIST', function(payload){
      window.alert("Invite Another User to List:"+payload._list.id)
    })

    // Create event
    EventBus.$on('CREATE_EVENT', function(payload){
      window.alert("event updated:"+payload._event.id)
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
  },
  components: {
    'nav-menu': NavMenu
  }
}
</script>
