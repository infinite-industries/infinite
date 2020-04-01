<template>
  <div v-show="jumbotron.open" id="jumbotron">
    <div id="content">
      <div id="close-jumbotron" @click="CloseJumbotron()">
        X
      </div>
      <p>
        Due to the outbreak of Coronavirus disease (COVID-19) we are hitting a pause on
        our live event promotion activities. We're on the lookout for interesting things
        happening online, though; check out our new
        <nuxt-link to="/remote">remote events page</nuxt-link>.
      </p>
      <p>
        Keep calm, avoid crowded spaces, wash your hands and stay healthy y'all!
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Jumbotron',
    data: function () {
      return {
        jumbotron: {
          open: true
        }
      }
    },
    methods: {
      CloseJumbotron: function () {
        this.jumbotron.open = false
      }
    }
  }
</script>

<style scoped>
  #jumbotron {
    position:fixed;
    padding:0;
    margin:0;

    top:0;
    left:0;

    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.8);

    color: white;
    z-index: 1024;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  #content {
    border: 1px white solid;
    margin-left: auto;
    margin-right: auto;

    width: 50%;

    padding: 20px;
    border-radius: 5px;

    font-family: "EB Garamond";
    font-size: 1.25em;

    background-color: white;
    color: black;
  }

  #close-jumbotron {
    text-align: right;
    font-family: "Open Sans", sans-serif;
  }

</style>
