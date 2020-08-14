<template>
  <table class="calendar-events-table">
    <thead>
      <tr>
        <th>OWNER</th>
        <th>TITLE</th>
        <th>WHEN</th>
        <th>ACTION</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="calendar_event in calendar_events" :key="calendar_event.id">
        <td><img v-if="calendar_event.reviewed_by_org" :src="calendar_event.reviewed_by_org | ownerLogo" width="30" /></td>
        <td>{{ calendar_event.title }}</td>
        <td>
          <div v-for="(date_time, index) in calendar_event.date_times" :key="index">{{ date_time | dateFormat }}</div>
          <template v-if="calendar_event.tags && calendar_event.tags.includes('online-resource')">Online Resource</template>
        </td>
        <td><v-btn nuxt :to="{ name: 'admin-event-edit-id', params: { id: calendar_event.id } }">Edit</v-btn></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import moment from 'moment'

  import PartnerService from '@/services/PartnerService'

  export default {
    name: 'AdminEventsList',
    props: ['calendar_events'],
    data: function () {
      return {}
    },
    filters: {
      dateFormat: function (date) {
        return [
          moment(date.start_time).format('dddd, MMMM Do'),
          moment(date.start_time).format('h:mma'),
          '-',
          moment(date.end_time).format('h:mma')
        ].join(' ')
      },
      ownerLogo: function (owner) {
        return PartnerService.getLogoForReviewer(owner)
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

  .calendar-events-table td, .calendar-events-table th {
      border: 1px solid #ddd;
      padding: 8px;
  }

  .calendar-events-table td:first-child {
    text-align: center;
  }

  .calendar-events-table tr:nth-child(even){background-color: #f2f2f2;}

  .calendar-events-table tr:hover {background-color: #ddd;}

</style>
