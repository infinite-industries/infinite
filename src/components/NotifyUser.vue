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
      const _self = this
      NotificationEventBus.$on('SHOW_ALERT', function(payload){
        //change color!!!
        _self.notification.visible = true
        _self.notification.message = payload.message
      })

      NotificationEventBus.$on('SHOW_INFO', function(payload){
        //change color!!!
        _self.notification.visible = true
        _self.notification.message = payload.message
      })
    }
  }
</script>
