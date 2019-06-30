<template>
  <div>
    <h1>Admin</h1>
    <div>This page is only accessible by admin users</div>
  </div>
</template>

<script>
  export default {
    name: 'Admin',

    middleware: 'auth',

    metaInfo: {
      title: 'Admin - Infinite Sandbox'
    }
  }
</script>
