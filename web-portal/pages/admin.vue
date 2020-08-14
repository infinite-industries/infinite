<template>
  <nuxt-child />
</template>

<script>
  /**
   * Parent / wrapper component for admin routes
   *
   * All routes in pages/admin will use this component as a base
   * (See https://nuxtjs.org/guide/routing#nested-routes)
   */
  export default {
    layout: 'admin'
  }
</script>
