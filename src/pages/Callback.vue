<template>
    <div></div>
</template>

<script>
  import { setIdToken, setAccessToken } from '../helpers/auth'

  export default {
    name: '',
    mounted () {
      this.$nextTick(() => {
        setAccessToken()
        setIdToken()
        window.location.href = '/'
      })
    }
  }
</script>
