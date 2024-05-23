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
      <tr v-for="calendar_event in calendar_events" :key="calendar_event.id">
        <td><img v-if="calendar_event.reviewed_by_org" :src="calendar_event.reviewed_by_org | ownerLogo" width="30" /></td>
        <td>{{ calendar_event.title }}</td>
        <td>
          <div v-for="(date_time, index) in calendar_event.date_times.slice(0, 2)" :key="index">{{ date_time | dateFormat }}</div>
          <small v-if="calendar_event.date_times.length > 2">(and {{ calendar_event.date_times.length - 2 }} more)</small>
          <template v-if="calendar_event.category && calendar_event.category==='online-resource'">Online Resource</template>
        </td>
        <td>
          <ii-form-button
            style-type="light"
            @click="onEditClicked(calendar_event.id)"
          >
            Edit
          </ii-form-button>
        </td>
        <td>
          <input
            type="checkbox"
            :checked="isProblem(calendar_event)"
            @change="isProblemUpdated(calendar_event, $event)"
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import momenttz from 'moment-timezone'

  import PartnerService from '@/services/PartnerService'
  import { UPSERT_ADMIN_EVENT_METADATA } from '../store/event-admin-metadata'
  import getToken from '../helpers/getToken'
  import FormButton from '@/components/FormButton.vue'

  export default {
    name: 'AdminEventsList',
    components: {
      'ii-form-button': FormButton
    },
    props: ['calendar_events'],
    data: function () {
      return {
        metadata: {}
      }
    },
    filters: {
      dateFormat: function (date) {
        return [
          momenttz(date.start_time).tz(date.timezone).format('dddd, MMMM Do h:mma'),
          '-',
          momenttz(date.end_time).tz(date.timezone).format('h:mma z')
        ].join(' ')
      },
      ownerLogo: function (owner) {
        return PartnerService.getLogoForReviewer(owner)
      }
    },
    methods: {
      isProblem: function (calenderEvent) {
        if (!calenderEvent.event_admin_meta_data) {
          return false
        } else {
          return calenderEvent.event_admin_meta_data.is_problem
        }
      },

      isProblemUpdated: function ({ id }, event) {
        const idToken = getToken(this.$auth)
        if (!this.metadata[id]) {
          this.metadata[id] = {}
        }

        this.metadata[id].isProblem = event.currentTarget.checked

        this.$store.dispatch(
          UPSERT_ADMIN_EVENT_METADATA,
          { eventId: id, isProblem: event.currentTarget.checked, idToken }
        )
      },
      onEditClicked(eventId) {
        this.$router.push({ name: 'admin-event-edit-id', params: { id: eventId } })
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
