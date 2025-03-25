<script>
  import { useStore } from 'vuex'

  export default {
    setup() {
      const { clear } = useUserSession()
      const store = useStore()

      onMounted(() => {
        // TODO: does this do the same thing that
        // $auth.logout()
        // used to?
        // doesn't seem to redirect to / ...
        clear()
        store.dispatch('Logout')
      })
    },
    render() {
      return null
    }
  }
</script>
