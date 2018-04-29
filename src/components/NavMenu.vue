// NavMenu.vue
<template>
  <v-menu class="main-nav" absolute bottom :nudge-top="40">
    <v-btn outline offset-y slot="activator">
      <v-icon>account_circle</v-icon>
    </v-btn>
    <v-list style="background-color: white;">
      <v-list-tile v-for="item in getVisibleItems(nav_items)" :key="item.title" @click.stop="RouteTo(item)">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>


<script>
  // import Axios from 'axios';
  import { isLoggedIn, login, logout, isAdmin } from '../helpers/Auth.js'

  export default {
    name:'NavMenu',
    data () {
      return {
        nav_items: [
          { title: 'Home', route:'/' },
          { title: 'Login', route: '/login', isUnAuthOnly: true },
          { title: 'Admin', route: '/admin', isAdminOnly: true },
          { title: 'About', route: '/about'},
          { title: 'Your Events', route: '/your-events', isAdminOnly: true }, // isAuthOnly: true
          // { title: 'Your Settings', route: '/your-settings'},
          { title: 'Contact', route: '/contact'},
          { title: 'Logout', route: '/logout', isAuthOnly: true },
        ]
      }
    },
    methods: {
      getVisibleItems(navItems) {
        const loggedIn = isLoggedIn()
        const isShown = item => {
          if (item.isAdminOnly && (!loggedIn || !isAdmin())) {
            return false
          } else if (item.isAuthOnly && !loggedIn)
            return false

          if (item.isUnAuthOnly &&  loggedIn)
            return false

          return true
        }

        return navItems.filter(item => isShown(item))
      },
      RouteTo: function(item){
        if (item.title === 'Login') {
          login()
        } else if (item.title === 'Logout') {
          this.$store.dispatch('Logout')
        } else {
          this.$router.push({path: item.route})
        }
      }
    }
  }
</script>
