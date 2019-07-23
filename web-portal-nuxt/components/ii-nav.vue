<template>
  <div class="sidebar">
    <ul id="nav-list">
      <li v-for="item in getVisibleItems(nav_items)" :key="item.title">
        <a :href="item.route">{{ item.title }}</a>
      </li>
    </ul>
    <div id="nav-social-media" style="text-align:center;">
      <div>
        <!-- TODO: move social URLs to config for easier customization -->
        <a href="https://www.facebook.com/infinite.dot.industries/">
          <facebook-icon
            id="facebook"
            class="social-media-icon"
            icon-color="#fff"
            width="40"
            height="40"
            style="cursor: pointer"
          />
        </a>
        <a href="https://twitter.com/1nfinite_1">
          <twitter-icon
            id="twitter"
            class="social-media-icon"
            icon-color="#fff"
            width="35"
            height="35"
            style="cursor: pointer"
          />
        </a>
        <a href="https://www.instagram.com/1nfinite_1ndustries/">
          <instagram-icon
            id="instagram"
            class="social-media-icon"
            icon-color="#fff"
            width="40"
            height="40"
            style="cursor: pointer"
          />
        </a>
      </div>
      <div style="text-align:center;">
        <ii-nav-subscribe id="subscribe" icon-color="#fff" width="140" height="55" style="cursor: pointer" />
      </div>
    </div>
  </div>
</template>

<script>
  import { TweenMax, Power4 } from 'gsap'
  import { isAdmin } from '../helpers/Auth'
  import NavSubscribe from './vectors/NavSubscribe.vue'
  import Facebook from './vectors/Facebook.vue'
  import Instagram from './vectors/Instagram.vue'
  import Twitter from './vectors/Twitter.vue'

  export default {
    name: 'IiNav',
    components: {
      'ii-nav-subscribe': NavSubscribe,
      'facebook-icon': Facebook,
      'instagram-icon': Instagram,
      'twitter-icon': Twitter
    },
    props: ['navElements'],
    data() {
      return {
        nav_items: [
          { title: 'Home', route: '/' },
          { title: 'Our Mission', route: '/our-mission' },
          { title: 'Submit Event', route: '/submit-event' },
          { title: 'Login', route: '/login', isUnAuthOnly: true },
          { title: 'Admin', route: '/admin', isAdminOnly: true },
          { title: 'Who We Are', route: '/who-we-are' },
          { title: 'Legal', route: '/legal' },
          // { title: 'Your Events', route: '/your-events', isAdminOnly: true }, // isAuthOnly: true
          // { title: 'Your Settings', route: '/your-settings'},
          { title: 'Logout', route: '/logout', isAuthOnly: true },
          { title: 'Contact', route: '/contact' }
        ]
      }
    },
    computed: {
      open() {
        return this.$store.getters['ui/sidebarOpen']
      }
    },
    watch: {
      open: function (open) {
        const dX = open ? 0 : this.$el.offsetWidth

        TweenMax.to(this.$el, 0.6, {
          x: dX,
          ease: Power4.easeOut
        })
      }
    },
    mounted() {
      TweenMax.set(this.$el, {
        x: this.$el.offsetWidth,
        zIndex: 20
      })
    },
    methods: {
      getVisibleItems(navItems) {
        const userIsAdmin = isAdmin()

        const isShown = (item) => {
          if (item.isAuthOnly && !this.$auth.loggedIn) {
            return false
          } else if (item.isUnAuthOnly && this.$auth.loggedIn) {
            return false
          } else if (item.isAdminOnly && !userIsAdmin) {
            return false
          }

          return true
        }

        return navItems.filter(item => isShown(item))
      }
    }
  }
</script>

<style scoped>

  .sidebar{
    position: fixed;
    right: 0;
    top: 0;
    z-index: 20;
    width: 300px;
    height: 100vh;
    max-width: 90vw;
    background-color: rgba(10,10,10,0.95);
    /* opacity: 0.95; */
    color: white;
  }

  #nav-list {
    margin-top: 150px;
    padding-left: 24px;
  }

  #nav-list li {
    list-style: none;
    font-family: 'Open Sans', sans-serif;
    font-size: 1.2em;
    line-height: normal;
    padding: 10px;

  }

@media only screen and (max-width: 480px) {
    #nav-list li {
      font-size: 1.4em;
    }

    #nav-list {
      margin-top: 105px;
    }

  }

  #nav-list a {
    color: white;
    text-decoration: none;
    cursor: pointer;
  }

  #nav-list a:hover {
    text-decoration: underline;
  }

  #nav-social-media {
    margin-top: 50px;
  }

  .social-media-icon {
    margin: 5px;
  }

</style>
