<template>
    <div></div>
</template>

<script>
  import { setIdToken, setAccessToken } from '../helpers/Auth'

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
