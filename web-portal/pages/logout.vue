<script>
  export default {
    mounted() {
      this.$auth.logout()
      this.$store.dispatch('Logout')
    },
    render() {
      return null
    }
  }
</script>
