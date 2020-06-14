<template>
  <div id="subscribe-container">
    <nuxt-link to="/subscribe?source='internal'">
      Subscribe
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    name: 'Subscribe',
    data: function () {
      return {

      }
    }
  }
</script>

<style scoped>
  @media only screen and (min-width: 640px) {
    #subscribe-container {
      display: none;
    }
  }

  @media only screen and (max-width: 640px) {
    #subscribe-container{
      position: fixed; /* Stay in place */
      z-index: 11; /* Sit on top */
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 60px;
      padding-top:10px;
      padding-bottom:5px;
      font-size: 24px;
      overflow: auto;
      text-align: center;
      background-color: rgba(0,0,0,1.0);
      color: white;
    }

  }

  #subscribe-container a:link,
  #subscribe-container a:visited,
  #subscribe-container a:hover {
    color: white;
  }
</style>
