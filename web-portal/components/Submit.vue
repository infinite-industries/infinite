<template>
  <div id="submit-container">
    <nuxt-link to="/submit-event?source='internal'">
      Submit Your Event
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    name: 'Submit',
    data: function () {
      return {

      }
    }
  }
</script>

<style scoped>
  @media only screen and (min-width: 640px) {
    #submit-container {
      display: none;
    }
  }

  @media only screen and (max-width: 640px) {
    #submit-container{
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

  #submit-container a:link,
  #submit-container a:visited,
  #submit-container a:hover {
    color: white;
  }
</style>
