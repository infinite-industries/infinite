<script>
  export default {
    mounted() {
      this.$store.dispatch('LoadAllUserData', { idToken: this.$auth.$storage.getState('_token.auth0') })
    }
  }
</script>

<template>
  <div class="container d-flex align-items-center justify-content-center flex-column">
    ...authorizing
  </div>
</template>

<style>
  body {
    color: white;
  }
</style>
