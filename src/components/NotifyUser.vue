<template>
  <v-alert icon="info" dismissible v-model="notification.visible" transition="slide-y-transition">
    {{ notification.message }}
  </v-alert>

</template>

<script>

import NotificationEventBus from '../helpers/NotificationEventBus.js'

  export default {
    name:'NotifyUser',
    data: function() {
      return {
        notification: {
          visible: false,
          message: ''
        }
      }
    },
    mounted: function() {
      
      NotificationEventBus.$on('test-event', function(payload){
        window.alert("interesteing")
      })
    }
  }
</script>
