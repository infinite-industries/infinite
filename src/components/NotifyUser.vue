<template>
  <v-alert icon="info" dismissible v-model="notification.visible" transition="slide-y-transition">
    {{ notification.message }}
  </v-alert>

</template>

<script>

  export default {
    name:'NotifyUser',
    props: ['notification'],
    data: function() {
      return {
        //
      }
    },

  }
</script>
