<script>
  export default {
    mounted() {
      this.$auth.logout()
      this.$store.dispatch('LOGOUT')
    },
    render() {
      return null
    }
  }
</script>
