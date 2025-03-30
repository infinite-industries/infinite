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
  import { mapGetters, useStore } from 'vuex'
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'

  export default {
    components: {
      FullCalendar
    },
    setup: async function () {
      await useLegacyStoreFetch('LoadAllLocalEventData', 'LoadAllLocalEventData')
    },
    data: function () {
      return {
        timeInterval: null,
        initialCalendarOptions: {
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
          eventTextColor: '#fff',
          initialDate: new Date().toISOString(),
          validRange: {
            start: new Date().toISOString()
          },
          height: 'auto'
        }
      }
    },
    computed: {
      ...mapGetters({ getAllLocalEvents: 'GetAllLocalEvents' }),
      calendarOptions: function () {
        const events = []

        this.getAllLocalEvents.forEach((event) => {
          event.date_times.forEach((eventDate) => {
            events.push({
              title: event.title,
              start: eventDate.start_time,
              end: eventDate.end_time,
              groupId: event.id,
              editable: false,
              originId: event.id
            })
          })
        })
        return {
          ...this.initialCalendarOptions, events
        }
      }
    },
    mounted() {
      if (window.screen.width < 640) {
        this.initialCalendarOptions.initialView = 'timeGridDay'
      }

      this.timeInterval = setInterval(() => {
        this.$store.dispatch('LoadAllLocalEventData')
      }, 5 * 60 * 1000)
    },
    methods: {
      handleDateClick(info) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.changeView('timeGridDay', info.dateStr)
      },
      handleEventClick(info) {
        this.$router.push({ path: `/events/${info.event.extendedProps.originId}` })
      }
    },
    beforeUnmount() {
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

  @media only screen and (max-width: 639px) {
    .calendar-page .fc-header-toolbar {
      flex-wrap: wrap;
    }
    .calendar-page .fc-toolbar-chunk:nth-child(2) {
      order: -1;
      width: 100%;
      text-align: center;
    }
  }

  @media only screen and (min-width: 640px) {
    .calendar-page .fc-daygrid-event {
      display: block;
      padding: 5px;
      background: rgba(0,0,0,0.1);
    }
    .calendar-page .fc-daygrid-dot-event:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    .calendar-page .fc-daygrid-event .fc-event-title{
      white-space: normal;
      display: inline;
    }
    .calendar-page .fc-daygrid-event .fc-daygrid-event-dot {
      display: none;
    }
    .calendar-page .fc-daygrid-event .fc-event-time {
      display: inline;
    }
  }
</style>
