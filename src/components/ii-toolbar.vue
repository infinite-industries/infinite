<template>
  <div class="container">
    <div id="toolbar" style="z-index:21">
      <ii-logo id="logo" iconColor="#fff" width="140" height="55" style="cursor: pointer" />
      <ii-subscribe v-if="nav_closed" id="subscribe" iconColor="#fff" width="140" height="55" style="cursor: pointer" />
      <ii-hamburger id="hamburger" width="55" height="55" style="cursor: pointer" />
    </div>
    <ii-nav />
  </div>
</template>


<script>

import Logo from './vectors/Logo.vue'
import Subscribe from './vectors/Subscribe.vue'
import Hamburger from './vectors/Hamburger.vue'

import Navigation from './ii-nav.vue'

export default {
  name: 'Toolbar',
  data: function(){
    return {
      //stuff
    }
  },
  computed: {
    nav_closed: function(){
      return !this.$store.state.ui.sidebarOpen
    }
  },
  methods:{
    NavigateTo: function(route_name){
      console.log("clicked");
      window.alert("Open page --> "+ route_name)
    }
  },
  components: {
    'ii-logo': Logo,
    'ii-subscribe': Subscribe,
    'ii-hamburger': Hamburger,
    'ii-nav': Navigation
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
    /* border: 1px solid red; */
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
    right: 25%;
    top: 20px;
  }
  @media only screen and (max-width: 640px) {
    #subscribe {
      display: none;
    }
  }


</style>
