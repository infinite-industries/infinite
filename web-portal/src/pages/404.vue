// 404.vue
// Redirects to infinite-404

<script>
export default {
  created: function() {
    // Redirect outside the app to custom 404
    window.location.href = '/404'
  }
}
</script>

<style scoped>

</style>
