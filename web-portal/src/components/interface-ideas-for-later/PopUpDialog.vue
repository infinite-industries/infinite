
<template>
  <v-dialog
    v-model="visible"
    max-width="500px"
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
