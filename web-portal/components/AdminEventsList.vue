<template>
  <table class="calendar-events-table">
    <thead>
      <tr>
        <th>TITLE</th>
        <th>WHEN</th>
        <th>ACTION</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="calendar_event in calendar_events" :key="calendar_event.id">
        <td>{{ calendar_event.title }}</td>
        <td>{{ ShowEventDates(calendar_event) }}</td>
        <td><v-btn nuxt :to="{ name: 'admin-event-edit-id', params: { id: calendar_event.id } }">Edit</v-btn></td>
      </tr>
    </tbody>
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
