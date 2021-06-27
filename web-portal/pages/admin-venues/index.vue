<template>
  <div class="container admin-page">
    <v-app>
      <client-only>
        <div>
          testing 123
        </div>
      </client-only>
    </v-app>
  </div>
</template>

<script>
  export default {
    props: [
      'id'
    ],
    middleware: 'auth',
    layout: 'admin',
    head: function () {
      return { title: 'Admin Venues' }
    }
  }
</script>
