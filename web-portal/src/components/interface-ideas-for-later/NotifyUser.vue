<template>
  <v-alert class="deep-purple lighten-1" icon="info" dismissible v-model="notification.visible" transition="slide-y-transition">
    {{ notification.message }}
  </v-alert>
</template>

<script>

import ComponentEventBus from '../helpers/ComponentEventBus.js'

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
    ComponentEventBus.$on('SHOW_ALERT', function(payload){
      //change color!!!
      _self.notification.visible = true
      _self.notification.message = payload.message
    })

    ComponentEventBus.$on('SHOW_INFO', function(payload){
      //change color!!!
      _self.notification.visible = true
      _self.notification.message = payload.message
    })
  }
}
</script>
