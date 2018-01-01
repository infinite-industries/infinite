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
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.website"></td>
          </tr>
          <tr>
            <td>Additional Web Links:</td>
            <td><input type="text" class="admin-value-to-edit" v-model="values_to_edit.links"></td>
          </tr>
        </table>
        <v-btn @click="UpdateEvent()">Save</v-btn>
        <v-btn @click="VerifyEvent()">Verify</v-btn>
        <v-btn @click="DeleteEvent()">Delete</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>


  export default {
      data: function(){
        return{
          values_to_edit: {}
        }
      },
      props:['id'],
      mounted:function(){
        this.$vlf.getItem(this.id)
          .then((result) => {
              console.log("got value:",result)
              this.values_to_edit = result
          })
      },
      methods: {
        UpdateEvent: function(){
          // DISPATCH vuex
          //EventBus.$emit('UPDATE_EVENT', {_event:this.values_to_edit});
        },
        DeleteEvent: function(){
          // DISPATCH vuex
          //EventBus.$emit('DELETE_EVENT', {_id:this.values_to_edit.id});
        },
        VerifyEvent: function(){
          // DISPATCH vuex
          //EventBus.$emit('VERIFY_EVENT', {_id:this.values_to_edit.id});
        }
      }
  }
</script>
