// EventsList.vue
// Listing and sorting options for raw events scoped by location
// Soon by type of event, phase of the moon, etc.


<template>
  <v-layout row wrap>
   <v-flex sm4 lg3 event-card-container v-for= "event in events">
     <event-card :event="event"></event-card>
    </v-flex>
  </v-layout>
</template>

<script>

import EventCard from './EventCard.vue'

  export default {
    name:'EventsList',
    props: ['events'],
    data: function() {
      return {

      }
    },
    components:{
      'event-card': EventCard
    }
  }
</script>
