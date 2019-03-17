// 404.vue
// Redirects to infinite-404

<template>
  <!-- <v-container grid-list-xs id="static-page-wrapper">
    <h1>404</h1>
    <h4>nope don't have this page</h4>
  </v-container> -->
</template>

<script>
  export default {
    created: function() {
      // Redirect outside the app to custom 404
      window.location.href = "/404";
    }
  }
</script>

<style scoped>

</style>
