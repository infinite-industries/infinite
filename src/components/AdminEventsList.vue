<template>
  <table class="admin-table">
    <tr>
      <th>TITLE</th>
      <th>WHEN</th>
      <th>ACTION</th>
    </tr>
    <tr v-for="event in events">
      <td>{{event.title}}</td>
      <td>{{when(event)}}</td>
      <td><v-btn @click="EditEvent(event)">Edit</v-btn></td>
    </tr>
  </table>
</template>

<script>
  import moment from 'moment'

  export default {
    name:'AdminEventsList',
    props: ['events'],
    data: function() {
      return {

      }
    },
    methods:{
      EditEvent: function(event_to_edit){
        const event_id = event_to_edit.id
        this.$router.push({ path: `/admin-event-edit/${event_id}` })

        // this.$vlf.setItem(event_id, event_to_edit)
        //   .then((result) => {
        //     this.$router.push({ path: `/admin-event-edit/${event_id}` })
        //   })
        //   .catch((err) => {
        //     window.alert("Unable to edit event! Holler at the bugs department on the contact page.")
        //     console.log(err);
        //   })

      },
      when: function(ii_event){
        let when_date = moment(ii_event.time_start).format('dddd, MMMM Do, YYYY')
        let when_time = moment(ii_event.time_start).format('h:mma') + " - " + moment(ii_event.time_end).format('h:mma')
        return when_date + ', ' + when_time;
      }
    }
}
</script>
