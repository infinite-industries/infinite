// NavMenu.vue
<template>
  <v-menu class="main-nav" absolute bottom :nudge-top="40">
    <v-btn outline offset-y slot="activator">
      <v-icon>account_circle</v-icon>
    </v-btn>
    <v-list style="background-color: white;">
      <v-list-tile v-for="item in nav_items" :key="item.title" @click.stop="RouteTo(item.route)">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>


<script>
  import EventBus from '../helpers/EventBus.js';

  import Axios from 'axios';

  export default {
    name:'NavMenu',
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
    methods: {
      RouteTo: function(route_to_page){
        this.$router.push({ path: route_to_page })
      }
    }
  }
</script>
