<template>
  <table class="calendar-events-table">
    <tr>
      <th>TITLE</th>
      <th>WHEN</th>
      <th>ACTION</th>
    </tr>
    <tr v-for="calendar_event in calendar_events" :key="calendar_event.id">
      <td>{{ calendar_event.title }}</td>
      <td>{{ ShowEventDates(calendar_event) }}</td>
      <td><v-btn @click="EditEvent(calendar_event)">Edit</v-btn></td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'AdminEventsList',
    props: ['calendar_events'],
    data: function () {
      return {}
    },
    methods: {
      EditEvent: function (calendar_event_to_edit) {
        this.$router.push({ path: `/admin-event-edit/${calendar_event_to_edit.id}` })
      },
      ShowEventDates: function () {
        return 'time range work in progress'
      }
    }
  }
</script>

<style scoped>
  .calendar-events-table th{
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: grey;
    color: white;
  }

  .calendar-events-table {
    border-collapse: collapse;
    width: 90%;
  }

  .calendar-events-table td, .calendar-events-table th {
      border: 1px solid #ddd;
      padding: 8px;
  }

  .calendar-events-table tr:nth-child(even){background-color: #f2f2f2;}

  .calendar-events-table tr:hover {background-color: #ddd;}

</style>
