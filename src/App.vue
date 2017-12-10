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
          <v-list-tile v-for="item in nav_items" :key="item.title" @click="RouteTo(item.route)">
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

export default {
  data () {
    return {
      drawer: false,
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
    OpenEventSubmitter: function(){
      window.location.assign('https://event-add.glitch.me/');
    },
    RouteTo: function(route_to_page){
      this.$router.push({ path: route_to_page })
    }
  }
}
</script>
