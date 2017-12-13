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
    data () {
      return {
        //
      }
    },
    methods:{
      EditEvent: function(event_to_edit){
        //window.alert("Edit"+id)
        this.$router.push({ path: '/admin-event-edit/:id', props: { id: 'dog' }})

      },
      When: function(event_string){
        return event_string.replace(" <br /> ", " ")
      }
    }
}
</script>
