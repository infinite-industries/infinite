<template>
  <div>
    <!-- Notifications -->
    <ii-notifications />

    <!-- Toolbar and Nav -->
    <ii-toolbar>
      <template #navigation>
        <ii-site-navigation slot="navigation" />
      </template>
    </ii-toolbar>
    <main>
      <!-- Content -->
      <slot />
    </main>
    <!-- PopUps and Modals -->
    <!-- Regular Old Modal -->
    <ii-modal />
    <!-- Phone-specific call-to-action ("submit your event") -->
    <ii-submit />
    <!-- iPhone-specific save button to desktop -->
    <!-- <ii-iphone-save-button /> -->
  </div>
</template>

<script>
  import Toolbar from '../components/Toolbar.vue'
  import Notifications from '../components/Notifications.vue'
  import Submit from '../components/Submit.vue'
  import Modal from '../components/Modal.vue'
  import SiteNavigation from '../components/SiteNavigation.vue'
  // import getToken from '../helpers/getToken'

  export default {
    components: {
      'ii-toolbar': Toolbar,
      'ii-site-navigation': SiteNavigation,
      'ii-notifications': Notifications,
      'ii-modal': Modal,
      'ii-submit': Submit
    },

    // mounted: async function () {
    //   // Inhale mock user data
    //   // TODO: does this belong in the layout, or should it be in route-level component?
    //   //       Looks like the answer is route-level, because this doesn't run if you change this to `fetch`
    //   if (this.$auth.loggedIn) {
    //     try {
    //       await this.$store.dispatch('LoadAllUserData', { idToken: getToken(this.$auth) })
    //     } catch (error) {
    //       console.log(`error fetching user data: "${error}"`)
    //       if (error.response && error.response.status === 403) {
    //         // clear tokens they are not valid
    //         this.$auth.logout()
    //       }
    //     }
    //   }
    // }
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

  /*
   * Vuetify's light theme uses a slight off-white, which creates a slight
   * issue on the submission page
   * This rule can be removed when Vuetify is
   */
  .application.theme--light {
    background: white;
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
