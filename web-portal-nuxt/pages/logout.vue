<script>
  export default {
    mounted() {
      this.$auth.logout()
      this.dispatchEvent('LOGOUT')
    },
    render() {
      return null
    }
  }
</script>
