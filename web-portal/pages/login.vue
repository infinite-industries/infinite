<script>
  export default {
    created() {
      this.$auth.loginWith('auth0')
    },
    render() {
      return null
    }
  }
</script>
