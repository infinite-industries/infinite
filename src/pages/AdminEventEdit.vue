// AdminEditEvent.vue
<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>Edit Event Settings</h1>
      </v-flex>
      <v-flex xs12>
        <table>
          <tr>
            <td>ID:</td>
            <td>{{values_to_edit.id}}</td>
          </tr>
          <tr>
            <td>Title:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.title"></td>
          </tr>
          <tr>
            <td>Slug:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.slug"></td>
          </tr>
          <tr>
            <td>When:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.when"></td>
          </tr>
          <tr>
            <td>Start Time:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.time_start"></td>
          </tr>
          <tr>
            <td>End Time:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.time_end"></td>
          </tr>
          <tr>
            <td>Address:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.address"></td>
          </tr>
          <tr>
            <td>Admission Fee:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.admission_fee"></td>
          </tr>
          <tr>
            <td>Bitly Link:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.bitly_link"></td>
          </tr>
          <tr>
            <td>EventBrite Link:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.eventbrite_link"></td>
          </tr>
          <tr>
            <td>Facebook Link:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.fb_event_link"></td>
          </tr>
          <tr>
            <td>Map Links:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.map_link"></td>
          </tr>
          <tr>
            <td>Organizers:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.organizers"></td>
          </tr>
          <tr>
            <td>Tags:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.tags"></td>
          </tr>
          <tr>
            <td>Ticket Link:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.ticket_link"></td>
          </tr>
          <tr>
            <td>Venues:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.venues"></td>
          </tr>
          <tr>
            <td>Event Website:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.website_link"></td>
          </tr>
          <tr>
            <td>Additional Web Links:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.links"></td>
          </tr>
        </table>
        <v-btn @click="UpdateEvent()">Save</v-btn>
        <v-btn @click="VerifyEvent()">Verify</v-btn>
        <v-btn @click="ConfirmDeleteEvent()">Delete</v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">U shure you wanna kill it?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="DeleteEvent()">Kill</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>


  export default {
      data: function(){
        return{
          dialog: false
        }
      },
      props:['id'],
      mounted:function() {
        this.$store.dispatch('LoadCurrentEvent', this.id)
      },
      computed: {
        values_to_edit: function() {
          return this.$store.getters.GetCurrentEvent
        }
      },
      methods: {
        RouteTo: function(route_to_page){
          this.$router.push({ path: route_to_page })
        },
        UpdateEvent: function(){
          this.$store.dispatch('UpdateEvent', {id:this.values_to_edit.id, event_data:this.values_to_edit})
        },
        ConfirmDeleteEvent: function(){
          this.dialog = true
        },
        DeleteEvent: function(){
          this.dialog = false
          this.$store.dispatch('DeleteEvent', {id:this.values_to_edit.id})
          this.RouteTo('/admin')
        },
        VerifyEvent: function(){
          // DISPATCH vuex
          //EventBus.$emit('VERIFY_EVENT', {_id:this.values_to_edit.id});
          this.$store.dispatch('VerifyEvent', {id:this.values_to_edit.id})
          this.RouteTo('/admin')
        }
      }
  }
</script>
