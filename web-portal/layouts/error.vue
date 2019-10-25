<template>
  <v-app>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <div class="text-wrapper">
      <span v-if="error.statusCode === 404">Hrmm... Something went wrong.</span> <br />
      Please return to the
      <NuxtLink to="/">
        Home page
      </NuxtLink>
      <p> the Management </p>
    </div>

  </v-app>
</template>

<script>
  export default {
    layout: 'empty',
    props: {
      error: {
        type: Object,
        default: null
      }
    },
    head() {
      const title =
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError
      return {
        title
      }
    },
    data() {
      return {
        pageNotFound: '404 Page Not Found',
        otherError: 'An error occurred'
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap');

  #app{
    background: #000;
  }
  h1 {
    margin-top: 40px;
    text-align: center;
    font-size: 50px;
    color: #fff;
  }
  .text-wrapper{
    font-family: 'Permanent Marker', cursive;
    color: #fff;
    text-align: center;
    font-size: 1.2em;
    -ms-transform: rotate(7deg);
    -webkit-transform: rotate(7deg);
    transform: rotate(7deg);
  }

  .text-wrapper p{
    margin-top: 20px;
  }

  a:link, a:visited{
    font-family: 'Permanent Marker', cursive;
    color: #fff;
    font-size: 1.2em;
  }

  p{
    top-margin: 20px;
  }
</style>
