<template>
  <div class="sidebar">
    <ul id="nav-list">
       <li v-for="item in getVisibleItems(nav_items)" :key="item.title" @click.stop="RouteTo(item)">
         {{ item.title }}
       </li>
    </ul>
    <div id="nav-social-media" style="text-align:center;">
      <div>
        <facebook-icon id="facebook" class="social-media-icon" iconColor="#fff" width="40" height="40" style="cursor: pointer" />
        <twitter-icon id="twitter" class="social-media-icon" iconColor="#fff" width="40" height="40" style="cursor: pointer" />
        <instagram-icon id="instagram" class="social-media-icon" iconColor="#fff" width="40" height="40" style="cursor: pointer" />
      </div>
      <div style="text-align:center;">
        <ii-nav-subscribe id="subscribe" iconColor="#fff" width="140" height="55" style="cursor: pointer" />
      </div>
    </div>
  </div>
</template>

<script>
  import { TweenMax, Power4 } from 'gsap'
  import { isLoggedIn, login, logout, isAdmin } from '../helpers/Auth.js'

  import NavSubscribe from './vectors/NavSubscribe.vue'
  import Facebook from './vectors/Facebook.vue'
  import Instagram from './vectors/Instagram.vue'
  import Twitter from './vectors/Twitter.vue'

  export default {
    name: 'ii-nav',
    props: ['nav_elements'],
    data () {
      return {
        nav_items: [
          { title: 'Home', route:'/' },
          { title: 'Login', route: '/login', isUnAuthOnly: true },
          { title: 'Admin', route: '/admin', isAdminOnly: true },
          { title: 'Who We Are', route: '/who-we-are'},
          { title: 'Our Mission', route: '/our-mission'},
          { title: 'Legal', route: '/legal'},
          //{ title: 'Your Events', route: '/your-events', isAdminOnly: true }, // isAuthOnly: true
          // { title: 'Your Settings', route: '/your-settings'},
          { title: 'Contact', route: '/contact'},
          { title: 'Logout', route: '/logout', isAuthOnly: true },

        ]
      }
    },
    mounted () {
      TweenMax.set(this.$el, {
        x: this.$el.offsetWidth
      })
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
    },
    computed: {
      open () {
        return this.$store.state.ui.sidebarOpen
      }
    },
    watch: {
      open: function (open) {
        const dX = open ? 0 : this.$el.offsetWidth

        TweenMax.to(this.$el, 0.6, {
          x: dX,
          ease: Power4.easeOut
        })

        TweenMax.to(document.getElementById("LINE__nav"), 1, {autoAlpha:1})
      }
    },
    components: {
      'ii-nav-subscribe': NavSubscribe,
      'facebook-icon': Facebook,
      'instagram-icon': Instagram,
      'twitter-icon': Twitter
    }
  }
</script>

<style scoped>

  .sidebar{
    position: fixed;
    right: 0;
    top: 0;
    z-index: 10;
    width: 300px;
    height: 100vh;
    max-width: 90vw;
    background-color: black;
    opacity: 0.85;
    color: white;
  }

  #nav-list {
    margin-top: 150px;
  }

  #nav-list li {
    list-style: none;
    font-family: 'Open Sans', sans-serif;
    font-size: 1.2em;
    padding: 10px;
  }

  #nav-social-media {
    margin-top: 50px;
  }

  .social-media-icon {
    margin: 5px;
  }

</style>
