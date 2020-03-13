<template>
  <div v-show="jumbotron.open" id="jumbotron">
    <div id="content">
      <div id="close-jumbotron" @click="CloseJumbotron()">
        X
      </div>
      <p>
        {{ jumbotron.message }}
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
          open: true,
          message: 'Due to the outbreak of Coronavirus disease (COVID-19) we are hitting a pause on our event promotion activities. Keep calm, avoid crowded spaces, wash your hands and stay healthy y'all!''
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
  }

  #close-jumbotron {
    text-align: right;
    font-family: "Open Sans", sans-serif;
  }

</style>
