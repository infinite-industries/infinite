<template>
  <table class="admin-table">
    <tr>
      <th>TITLE</th>
      <th>WHEN</th>
      <th>ACTION</th>
    </tr>
    <tr v-for="event in events">
      <td>{{event.title}}</td>
      <td>{{When(event.when)}}</td>
      <td><v-btn @click="EditEvent(event)">Edit</v-btn></td>
    </tr>
  </table>
</template>

<script>

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

        this.$vlf.setItem(event_id, event_to_edit)
          .then((result) => {
            this.$router.push({ path: `/admin-event-edit/${event_id}` })
          })
          .catch((err) => {
            window.alert("Unable to edit event! Holler at the bugs department on the contact page.")
            console.log(err);
          })

      },
      When: function(event_string){
        return event_string.replace(" <br /> ", " ")
      }
    }
}
</script>
