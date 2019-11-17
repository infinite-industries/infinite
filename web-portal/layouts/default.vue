<template>
  <div>
    <!-- Notifications -->
    <ii-notifications />

    <!-- Toolbar and Nav -->
    <ii-toolbar />

    <main>
      <!-- Content -->
      <nuxt />
    </main>
    <!-- PopUps and Modals -->
    <!-- Regular Old Modal -->
    <ii-modal />
    <ii-subscribe />
    <!-- iPhone-specific save button to desktop -->
    <!-- <ii-iphone-save-button /> -->
  </div>
</template>

<script>
  import Toolbar from '../components/ii-toolbar'
  import Notifications from '../components/ii-notifications.vue'
  import Subscribe from '../components/ii-subscribe.vue'
  import Modal from '../components/ii-modal.vue'

  export default {
    components: {
      'ii-toolbar': Toolbar,
      'ii-notifications': Notifications,
      'ii-modal': Modal,
      'ii-subscribe': Subscribe
    },
    data() {
      return {
        // notification: {
        //   visible: false,
        //   type: '',
        //   message: '',
        //   timeout: false
        // }
      }
    },

    mounted: async function () {
      // Inhale mock user data
      // TODO: does this belong in the layout, or should it be in route-level component?
      //       Looks like the answer is route-level, because this doesn't run if you change this to `fetch`
      if (this.$auth.loggedIn) {
        try {
          await this.$store.dispatch('LoadAllUserData', { idToken: this.$auth.$storage.getState('_token.auth0') })
        } catch (error) {
          console.log(`error fetching user data: "${error}"`)
          if (error.response && error.response.status === 403) {
            // clear tokens they are not valid
            this.$auth.logout()
          }
        }
      }

      // this.$store.dispatch('LoadAllVenueData')

      // // Clean up localForage if admin pannel deletes an event
      // EventsFromStore.$on('CALENDAR_EVENT_DELETED', function(data){
      //   console.log("Delete the Event ", data.id);
      // })
      //
      // // Clean up localForage if admin verifies the event
      // EventsFromStore.$on('CALENDAR_EVENT_VERIFIED', function(data){
      //   console.log("EVENT CENTRAL cleanup --- Remove Verified Event", data.id);
      // })
    },
    methods: {
      OpenEventSubmitter: function () {
        window.location.assign('https://event-add.glitch.me/')
      },
      OpenEmailSubscribe: function () {
        window.location.assign('/subscribe-email')
      },
      RouteTo: function (route_to_page) {
        this.$router.push({ path: route_to_page })
      }
      // ConfirmAction: function(action_confirmation_message){
      //   // DISPATCH vuex
      //   // EventBus.$emit(action_confirmation_message);
      //   // this.notification = {
      //   //   visible: true,
      //   //   type: 'info',
      //   //   message: action_confirmation_message
      //   // }
      // }

    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=EB+Garamond|Open+Sans:400,400i,600,600i,700');

  /* TODO: this is related to upgrading Vuetify during the Nuxt refactor */
  /* The version we used to use set the base font to 16px, but the current version uses 14px */
  html {
    font-size: 16px;
  }

  body {
    background-color: black;
  }

  #app {

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

  }

  main {
    padding-top: 55px;
  }

  .info-page {
    background: white;
    color: black;
    border-radius: 10px;

    max-width: 95%;
  }

  h4 {
    font-family: "Open Sans", sans-serif;
    font-size: 1.1em;
    margin-bottom: 10px;
  }

  a:link, a:hover, a:visited {
    color: black;
  }

  @media only screen and (min-width: 993px) {
    .info-page {
      max-width: 80%;
    }
  }

  @media only screen and (max-width: 576px) {
    .info-page {
        margin-bottom: 30px;
    }
  }

  @media only screen and (max-width: 640px) {
    main {
      padding-bottom: 60px;
    }
  }

  h1, h2, h3 {
    font-family: "Open Sans", sans-serif;
    letter-spacing: .02em;

  }

  h1{
    font-size: 1.9em;
    font-weight: bold;
    margin-bottom: 0.7em;
  }

  h2, h3{
    font-size: 1.5em;
    font-weight: 700;
    margin-top: 1.5em;
    margin-bottom: .5em;
  }

  .info-page p {
    font-family: "EB Garamond";
    font-size: 1.25em;
  }
</style>
