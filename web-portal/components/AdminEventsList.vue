<template>
  <table class="calendar-events-table">
    <thead>
      <tr>
        <th>OWNER</th>
        <th>TITLE</th>
        <th>WHEN</th>
        <th>ACTION</th>
        <th>PROBLEMS</th>
      </tr>
    </thead>
    <tbody>
      <ii-admin-events-list-row
        v-for="calendarEvent in calendar_events"
        :key="calendarEvent.id"
        :calendar-event="calendarEvent"
        @hasProblemsChanged="isProblemUpdatedChanged"
      />
    </tbody>
  </table>
</template>

<script>
  import { UPSERT_ADMIN_EVENT_METADATA } from '../store/event-admin-metadata'
  import getToken from '../helpers/getToken'
  import AdminEventsListRow from '~/components/AdminEventsListRow.vue'

  export default {
    name: 'AdminEventsList',
    components: {
      'ii-admin-events-list-row': AdminEventsListRow
    },
    props: ['calendar_events'],
    data: function () {
      return {
        metadata: {}
      }
    },
    methods: {
      isProblemUpdatedChanged: function ({ id, checked }) {
        const idToken = getToken(this.$auth)
        if (!this.metadata[id]) {
          this.metadata[id] = {}
        }

        this.metadata[id].isProblem = checked

        this.$store.dispatch(
          UPSERT_ADMIN_EVENT_METADATA,
          { eventId: id, isProblem: checked, idToken }
        )
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
    font-family: "Open Sans", sans-serif;
  }

  .calendar-events-table >>> td, .calendar-events-table th {
      border: 1px solid #ddd;
      padding: 8px;
  }

  .calendar-events-table >>> td:first-child {
    text-align: center;
  }

  .calendar-events-table tr:nth-child(even){background-color: #f2f2f2;}

  .calendar-events-table tr:hover {background-color: #ddd;}

</style>
