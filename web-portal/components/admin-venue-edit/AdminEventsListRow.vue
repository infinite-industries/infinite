<template>
  <tr>
    <td>
      <img
        v-if="calendar_event.reviewed_by_org"
        :src="ownerLogo"
        width="30"
      />

    </td>

    <td>{{ calendar_event.title }}</td>

    <td>
      <div v-for="(date_time, index) in calendar_event.date_times.slice(0, 2)" :key="index">
        {{ dateFormat(date_time) }}
      </div>

      <small v-if="calendar_event.date_times.length > 2">
        (and {{ calendar_event.date_times.length - 2 }} more)
      </small>

      <template
        v-if="calendar_event.category && calendar_event.category==='online-resource'"
      >
        Online Resource
      </template>
    </td>

    <td>
      <ii-form-button
        style-type="light"
        @click="onEditClicked(calendar_event.id)"
        :test-id="'edit-issue-button-' + calendar_event.id"
      >
        Edit
      </ii-form-button>
    </td>

    <td>
      <input
        type="checkbox"
        :checked="isProblem"
        @change="hasProblemsValueUpdated(calendar_event, $event)"
      >
    </td>
  </tr>
</template>

<script>
  import FormButton from '@/components/FormButton.vue'
  import momenttz from 'moment-timezone'
  import PartnerService from '@/services/PartnerService'

  export default {
    name: 'AdminEventsListRow',
    components: {
      'ii-form-button': FormButton
    },
    props: ['calendar_event', 'isProblemUpdated'],
    computed: {
      isProblem: function() {
        // TODO (THIS IS NOT WORKING FOR UN-VERIFIED EVENTS OR RESOURCES BECAUSE THEY ARE FETCHED WITHOUT METADATA)
        if (!this.calendar_event.event_admin_meta_data) {
          return false
        } else {
          return this.calendar_event.event_admin_meta_data.is_problem
        }
      },
      ownerLogo: function () {
        return PartnerService.getLogoForReviewer(this.calendar_event.reviewed_by_org)
      }
    },
    methods: {
      dateFormat: function(date) {
        return [
          momenttz(date.start_time).tz(date.timezone).format('dddd, MMMM Do h:mma'),
          '-',
          momenttz(date.end_time).tz(date.timezone).format('h:mma z')
        ].join(' ')
      },
      onEditClicked(eventId) {
        this.$router.push({ name: 'admin-event-edit-id', params: { id: eventId } })
      },
      hasProblemsValueUpdated: function(data, event) {
        const value = event.currentTarget.checked
        this.$emit('hasProblemsChanged', { id: data.id, checked: value })
      }
    },
    model: {
      event: 'hasProblemsChanged'
    }
  }
</script>
