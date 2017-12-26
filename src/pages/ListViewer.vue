// ListViewer.vue
// Preview individual lists before
<template>
  <v-container grid-list-xs id="static-page-wrapper">
    <h2>Sample List</h2>
  // List name
  // Descriptions
  // Contact options if public

  // Listing of Events
  </v-container>
</template>

<script>

  import EventBus from '../helpers/EventBus.js'

  export default {
    data: function () {
      return {
        events: []
      }
    }
  }

</script>
