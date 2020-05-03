<template>
  <div class="container">
    <div id="toolbar" style="z-index:21">
      <ii-logo id="logo" icon-color="#fff" width="140" height="55" style="cursor: pointer" />
      <ii-subscribe
        v-if="showCallsToAction"
        id="subscribe"
        icon-color="#fff"
        width="140"
        height="55"
        style="cursor: pointer"
      />
      <ii-submit
        v-if="showCallsToAction"
        id="submit"
        icon-color="#fff"
        width="140"
        height="55"
        style="cursor: pointer"
      />
      <ii-hamburger id="hamburger" width="55" height="55" style="cursor: pointer" />
    </div>
    <ii-navigation>
      <slot name="navigation" />
    </ii-navigation>
    <!-- <ii-navigation /> -->
  </div>
</template>

<script>
  import Logo from './vectors/Logo.vue'
  import Subscribe from './vectors/Subscribe.vue'
  import Submit from './vectors/Submit.vue'
  import Hamburger from './vectors/Hamburger.vue'

  import Navigation from './Navigation.vue'

  const ROUTE_IS_ADMIN = new RegExp('^/admin')

  export default {
    name: 'Toolbar',
    components: {
      'ii-logo': Logo,
      'ii-subscribe': Subscribe,
      'ii-submit': Submit,
      'ii-hamburger': Hamburger,
      'ii-navigation': Navigation
    },
    data: function () {
      return {
        // stuff
      }
    },
    computed: {
      showCallsToAction: function () {
        // hide CTAs on admin routes and when sidebar is open
        return (!this.$route || !ROUTE_IS_ADMIN.test(this.$route.path)) &&
          !this.$store.getters['ui/sidebarOpen']
      }
    }
  }
</script>

<style scoped>

  #toolbar {
    position: fixed;
    z-index: 15;
    top: 0px;
    left: 0px;
    height: 85px;
    width: 100%;
    background: #000000;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) 20px, rgba(0, 0, 0, 0.75) 40px, rgba(0, 0, 0, 0.5) 60px, rgba(0, 0, 0, 0.25) 75px);
  }

  #hamburger{
    position: absolute;
    right: 30px;
    top: 20px;
  }

  #logo{
    position: absolute;
    left: 30px;
    top: 20px;
  }

  #subscribe{
    position: absolute;
    right: 35%;
    top: 20px;
  }

  #submit {
    position: absolute;
    top: 20px;
    right: 18%;
  }

  @media only screen and (max-width: 640px) {
    #subscribe, #submit {
      display: none;
    }
  }

  @media only screen and (max-width: 960px) {
    #subscribe {
      right: 40%
    }
    #submit {
      right: 16%;
    }
  }

</style>
