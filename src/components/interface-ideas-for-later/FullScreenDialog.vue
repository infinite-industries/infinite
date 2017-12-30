// Cool idea but currently unused -- need to rethink the whole interface
<template>
  <v-dialog
    v-model="visible"
    fullscreen
    transition="dialog-bottom-transition"
    :overlay="false"
    scrollable
  >
    <h1>{{title}}</h1>
    <h3>{{description}}</h3>
    <slot name="content"> </slot>
    <slot name="buttons"> </slot>
  </v-dialog>
</template>

<script>
  import EventBus from '../helpers/EventBus.js'

  export default {
    name:'FullScreenDialog',
    props: ['title', 'description'],
    data: function() {
      return {
        visible: true

      }
    }
  }
</script>
