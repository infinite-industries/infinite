// EventsList.vue
// Listing and sorting options for raw events scoped by location
// Soon by type of event, phase of the moon, etc.


<template>
  <div>
    <v-layout row wrap>
     <v-flex sm4 lg3 event-card-container v-for= "event in events_from_current_list">
       <event-card :event="event"></event-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-toolbar class="deep-purple">
         <v-toolbar-title style="color:white">Event Options</v-toolbar-title>
       </v-toolbar>
        <!-- <v-card-title class="headline">Event Options</v-card-title> -->
        <v-card-text>
          You can add this event to the following lists:
        <v-list>
          <template v-for="list in my_other_lists">
            <v-list-tile avatar @click="">
              <v-list-tile-avatar>
                <v-icon v-show="AlreadyOnTheList(list.id)">check_circle</v-icon>
                <v-icon v-show="!AlreadyOnTheList(list.id)">panorama_fish_eye</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html = "list.list_name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-divider style="margin-top:10px;margin-bottom:15px;"></v-divider>
          <v-btn block v-show="type==='mine'" class="deep-purple" style="color:white;" @click.native="RemoveEventFromList()">REMOVE FROM YOUR LIST</v-btn>
          <v-btn block @click.native="dialog = false">Cancel</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import EventCard from './EventCard.vue'

  export default {
    name:'EventsList',
    props: ['type', 'id'],
    data: function() {
      return {
        dialog: false,
        active_event:''
      }
    },
    mounted: function(){
      console.log("LIST ID:",this.id)
      console.log("load state: ", this.$store.state.loaded_from_api);

    },
    methods:{
      CallEventCard: function(){

        // this.$bus.$emit(event_id, {action:'hide'})
      },
      AddEventToList: function(list_id){
        this.$store.dispatch('AddEventToList', {list_id:list_id, event_data:active_event})
      },
      RemoveEventFromList: function(){
        this.dialog = false

        // this.events = this.events.filter(list => list.id !== this.active_event)
        // this.$bus.$emit(this.active_event, {action:'hide'})
        this.$store.dispatch('RemoveEventFromList', {list_id:this.id, event_id:this.active_event.id})
      },

      AlreadyOnTheList: function(list_id){
        const selected_list = this.$store.getters.GetMyLists.filter(list => list.list_id === list_id)
        // TODO complete this feature
        // selected_list this.active_event
        return false
      }
    },
    computed:{
      events_from_current_list: function(){
        if(this.$store.state.loaded_from_api){
          if(this.type === 'mine'){
            // let my_lists = this.$store.getters.GetMyLists
            // return my_lists.filter(list => list.id === this.id)
            return this.$store.getters.GetCurrentList.events
          }
          else if(this.type === 'following'){
            // let followed_lists = this.$store.getters.GetListsIFollow
            // return followed_lists.filter(list => list.id === this.id)
            return this.$store.getters.GetCurrentList.events
          }
          else {
            return this.$store.getters.GetAllLocalEvents
          }
        }

      },
      my_lists: function(){
        return this.$store.getters.GetMyLists
      },
      my_other_lists: function(){
      // This list excludes current active list
        if(this.$store.state.loaded_from_api){
          const all_lists = this.$store.getters.GetMyLists
          return all_lists.filter(list => list.id !== this.id)
        }
        else{
          return this.$store.getters.GetMyLists
        }

      }
    },
    beforeUpdate: function(){
      //
    },
    $bus: {
      'OPEN_OPTIONS_DIALOG' : function(payload){
        this.dialog = true
        this.active_event = payload.calling_event
        console.log(this.active_event)

        //this.CallEventCard(this.active_event)
      }
    },
    components:{
      'event-card': EventCard
    }
  }
</script>
