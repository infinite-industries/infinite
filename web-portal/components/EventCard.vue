<template>
  <div class="card-container">
    <div class="card-overlay" v-show="showCalendars" @click.stop="CloseCalendars()"></div>
    <div class="infinite-card" :class="{ '-postponed': isPostponed, '-cancelled': isCancelled }">
      <div class="image-container">
        <nuxt-link :to="{ name: 'events-id', params: { id: calendar_event.id } }">
          <div class="image-surface" :style="backGroundImage"></div>
        </nuxt-link>
      </div>
      <div class="info-container">
        <h3>
          <template v-if="statusMessage">[{{ statusMessage }}] - </template>
          {{ calendar_event.title | truncate(statusMessage ? 30 : 40) }}
        </h3>
        <h4 v-if="showVenue">
          <!-- TODO: replace this span with the new ii-remote icon -->
          <span v-if="isRemote || isOnlineResource" style="font-size: 1.5em; color: #B7B09C">(( o ))</span>
          <ii-location v-else iconColor="#B7B09C" width="20" height="20" />
          {{ venue_info.name }}
        </h4>

        <p class="date">{{ when_date }}</p>
        <p class="time">{{ when_time }}</p>

        <p class="description">{{ calendar_event.brief_description | truncate(120) }} </p>

        <div class="btn-actions">
          <nuxt-link class="card-btn more-info" :to="{ name: 'events-id', params: { id: calendar_event.id } }">
            More Info
          </nuxt-link>
          <span class="card-btn add-to-calendar" style="cursor: pointer" @click.stop="OpenCalendars()"><ii-calendar iconColor="#fff" width="16" height="16" class="ii-calendar" />Add to Calendar</span>
        </div>

        <div class="drop-down" v-show="showCalendars">
          <div @click.stop="AddEventToCalendar('iCal')">iCal</div>
          <div @click.stop="AddEventToCalendar('Outlook')">Outlook</div>
          <div @click.stop="AddEventToCalendar('Google Cal')">Google Cal</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import moment from 'moment'

  import Location from './vectors/Location.vue'
  import Calendar from './vectors/Calendar.vue'
  //   import Remote from './vectors/Remote.vue'

  import CalendarService from '@/services/CalendarService'

  const _hasTag = (event, tag) => event && event.tags && event.tags.includes(tag)

  export default {
    name: 'Card',
    props: ['calendar_event'],
    data: function () {
      return {
        showCalendars: false
      }
    },
    methods: {
      OpenCalendars: function () {
        this.showCalendars = true
      },
      CloseCalendars: function () {
        this.showCalendars = false
      },
      AddEventToCalendar(calType) {
        CalendarService.generate(this.calendar_event, calType)
      }
    },
    computed: {
      backGroundImage: function () {
        return 'background: url(\'' + this.calendar_event.image + '\') center center / cover no-repeat; cursor: pointer;'
      },
      statusMessage: function () {
        if (this.isCancelled) return 'Cancelled'
        else if (this.isPostponed) return 'Postponed'
        else return null
      },
      showVenue: function () {
        return !!this.calendar_event.venue_id && !!this.venue_info && !!this.venue_info.id
      },
      venue_info: function () {
        const all_venues = this.$store.getters.GetAllVenues

        const current_venue = all_venues.find((venue) => {
          return venue.id === this.calendar_event.venue_id
        })

        if (current_venue === undefined) {
          return {}
        } else {
          return current_venue
        }
      },
      when_date: function () {
        const calendar = this.calendar_event
        const dateTimes = calendar.date_times
        const firstDay = dateTimes[0]
        return moment(firstDay.start_time).format('dddd, MMMM Do')
      },
      when_time: function () {
        const calendar = this.calendar_event
        const dateTimes = calendar.date_times
        const firstDay = dateTimes[0]
        const output_string = moment(firstDay.start_time).format('h:mma - ') + moment(firstDay.end_time).format('h:mma')
        return output_string
      },
      isCancelled: function () {
        return this.calendar_event &&
          this.calendar_event.tags &&
          this.calendar_event.tags.includes('cancelled')
      },
      isPostponed: function () {
        // 'cancelled' supersedes 'postponed' for purposes of displaying event status
        return this.calendar_event &&
          this.calendar_event.tags &&
          this.calendar_event.tags.includes('postponed') &&
          !this.calendar_event.tags.includes('cancelled')
      },
      isRemote: function () {
        return _hasTag(this.calendar_event, 'remote')
      },
      isOnlineResource: function () {
        return _hasTag(this.calendar_event, 'online-resource')
      }
    },
    filters: {
      truncate: function (text, stop, clamp) {
        return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
      }
    },
    components: {
      'ii-location': Location,
      'ii-calendar': Calendar
      //  'ii-remote': Remote
    }

  }
</script>

<style scoped>

  /* TODO fix me on iPhones!  https://stackoverflow.com/questions/46313640/iphone-x-8-8-plus-css-media-queries */
  .card-overlay{
    position: fixed;
    z-index: 4;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
  }

  .card-container {
    min-width: 240px;
    min-height: 400px;

    padding:5px;
  }

  .infinite-card {
    position: relative;
    display:flex;

    width: 240px;
    min-height: 400px;

    margin-left: auto;
    margin-right: auto;

    border-radius: 10px;

    background-color: white;
    color: black;
  }

  .infinite-card.-postponed {
    opacity: 0.9;
  }

  .infinite-card.-cancelled {
    opacity: 0.5;
  }

  .image-container{
    position: absolute;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    min-height: 150px;
    min-width: 240px;

    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: hidden;

    text-align: center;

    /* border: 1px solid black;  */
  }

  .image-container .image-surface{

    min-width: 240px;
    min-height: 150px;

    -moz-transition: -moz-transform 0.3s, transform 0.3s;
    -webkit-transition: -webkit-transform 0.3s, transform 0.3s;
    transition: transform 0.3s;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .image-container:hover .image-surface {
    -moz-transform: scale(1.1);
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .info-container{
    position: absolute;
    top: 150px;
    left: 0;

    min-height: 230px;
    min-width: 240px;

    padding: 20px;
    padding-top: 15px;
  }

  .info-container h3 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 15px;
    margin-top: 0px;

    padding-right: 10px;
  }

  .info-container h4 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 200;
    font-size: 11px;
    margin-bottom: 10px;
  }

  .info-container .date, .info-container .time {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-style: italic;
    font-size: 11px;
    margin-bottom: 0px;
  }

  .info-container .description {
    font-family: 'EB Garamond', serif;
    font-size: 11px;
    padding-right: 12px;

    margin-top: 10px;
  }

  .btn-actions {
    position: absolute;
    bottom: 5px;

    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    color: white;
  }

  .ii-calendar {
    position: relative;
    top: 3px;
    margin-right: 5px;
  }

  .card-btn {
    border-radius: 5px;
    padding: 7px 11px;
  }

  .add-to-calendar {
    background-color: #B7B09C;
    margin-left: 5px;
  }

  .more-info {
    color: white;
    background-color: #000;
    text-decoration: none;
  }

  .drop-down{
    position: absolute;
    bottom: -70px;
    right: 20px;
    z-index: 5;
    /* border: 2px solid white; */

    color: white;
    background-color: #B7B09C;
    border-radius: 10px;
    padding-top: 5px;
    padding-right:45px;
    padding-left: 10px;
    padding-bottom: 10px;

    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
  }

  .drop-down div {
    margin-top: 5px;
    width:100%;
  }

  .drop-down div:hover {
    text-decoration: underline;
  }

@media only screen and (max-width: 350px) {
  /* on very small screens the calendar button wraps awkwardly */
  .card-btn {
    padding: 7px;
  }

  .ii-calendar {
    display: none;
  }
}

@media only screen and (max-width: 480px) {
  .card-container {
    /* border: 1px solid red; */
    min-width: 85%;
    min-height: 520px;

    padding:5px;
    margin-bottom: 20px;
  }

  .infinite-card{

    width: 85%;
    min-height: 520px;

    border-radius: 10px;

    margin-left: auto;
    margin-right: auto;
  }

  .image-container{

    min-height: 200px;
    min-width: 100%;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;

  }

  .image-container .image-surface{

    min-width: 100%;
    min-height: 200px;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;

  }

  .info-container{

    top: 200px;
    left: 0px;

    min-height: 300px;
    min-width: 240px;

    padding: 18px;
    padding-top: 15px;
  }

  .info-container h3 {
    font-size: 20px;
    padding-right: 10px;
    margin-top: 0px;
  }

  .info-container h4 {

    font-size: 16px;
    margin-bottom: 10px;
  }

  .info-container .date, .info-container .time {
    font-size: 15px;
    margin-bottom: 0px;
  }

  .info-container .description {
    font-size: 15px;
    padding-right: 12px;

    margin-top: 13px;
    min-width: 225px;
  }

  .add-to-calendar {
    background-color: #B7B09C;
    margin-left: 5px;
  }

  .more-info {
    background-color: #000;
  }

  .drop-down{
    bottom: -110px;
    right: 20px;

    border-radius: 10px;
    padding-top: 5px;
    padding-right:45px;
    padding-left: 10px;
    padding-bottom: 10px;

    font-size: 18px;
  }

  .btn-actions {
    bottom: 8px;
    right: 20px;
    font-size: 1em;

  }

  .ii-calendar {
    position: relative;
    top: 1px;
    margin-right: 6px;
    margin-left: 2px;
  }

}

</style>
