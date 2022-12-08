<template>
  <div class="container info-page calendar-page">
    <v-app>
      <client-only>
        <FullCalendar class="calendar" ref="fullCalendar" :options="calendarOptions" />
      </client-only>
    </v-app>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'

  export default {
    components: {
      FullCalendar
    },
    data: function () {
      return {
        timeInterval: null,
        calendarOptions: {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          nowIndicator: true,
          editable: false,
          headerToolbar: {
            left: 'dayGridMonth,dayGridWeek,timeGridDay',
            center: 'title',
            right: 'prev,next'
          },
          titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
          dateClick: this.handleDateClick,
          eventClick: this.handleEventClick,
          eventBackgroundColor: '#b7b09c',
          eventBorderColor: '#fff',
          eventTextColor: '#fff'
        }
      }
    },
    async fetch({ store }) {
      await store.dispatch('LoadAllCalendarEventData')
    },
    computed: {
      ...mapGetters({ getAllCalendarEvents: 'GetAllCalendarEvents' })
    },
    mounted() {
      this.setUpdateCalendarEvents()

      this.timeInterval = setInterval(() => {
        this.$store.dispatch('LoadAllCalendarEventData').then(() => {
          this.setUpdateCalendarEvents()
        })
      }, 5 * 60 * 1000)
    },
    methods: {
      setUpdateCalendarEvents() {
        const parsedEvents = []

        this.getAllCalendarEvents.forEach((event) => {
          event.date_times.forEach((eventDate) => {
            parsedEvents.push({
              title: event.title,
              start: eventDate.start_time,
              end: eventDate.end_time,
              groupId: event.id,
              editable: false,
              originId: event.id
            })
          })
        })

        this.calendarOptions.events = parsedEvents
      },
      handleDateClick(info) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.changeView('timeGridDay', info.dateStr)
      },
      handleEventClick(info) {
        this.$router.push({ path: `/events/${info.event.extendedProps.originId}` })
      }
    },
    beforeDestroy() {
      if (this.timeInterval) { window.clearInterval(this.timeInterval) }
    }
  }
</script>

<style>
.calendar-page .fc-button-primary {
  background: #5c5c5c;
}
.calendar-page .fc-button-primary:hover {
  background: #131212;
}
.calendar-page .fc-daygrid-event {
  color: #5c5c5c;
}
.calendar-page .fc-col-header-cell-cushion {
  color: #000;
}
.calendar-page .fc-daygrid-day-number {
  color: #000;
}
</style>
