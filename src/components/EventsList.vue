// EventsList.vue
// Listing and sorting options for raw events scoped by location
// Soon by type of event, phase of the moon, etc.


<template>
  <div>
    <v-layout row wrap>
     <v-flex sm4 lg3 event-card-container v-for= "event in events">
       <event-card :event="event" v-on:options="ShowOptionsDialog()"></event-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Event Options</v-card-title>
        <v-card-text>
          You can add this event to the following lists:
        </v-card-text>

          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Agree</v-btn>

          <br />
          Or remove it from the current list

          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Agree</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import EventCard from './EventCard.vue'

  export default {
    name:'EventsList',
    props: ['events'],
    data: function() {
      return {
        dialog: false
      }
    },
    methods:{
      ShowOptionsDialog: function(){
        console.log('testing');
        this.dialog = true
      }
    },
    components:{
      'event-card': EventCard
    }
  }
</script>
