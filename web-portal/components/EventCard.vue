<template>
  <div class="card-container">
    <div class="card-overlay" v-show="showCalendars" @click.stop="CloseCalendars()"></div>
    <div class="infinite-card" :class="{ '-postponed': isPostponed, '-cancelled': isCancelled }">
      <div class="image-info-container">
        <div class="image-container">
          <nuxt-link :to="eventLink">
            <div class="image-surface" :style="backGroundImage"></div>
            <div v-if="(showVenue && venue.city) || isRemote" class="image-location-city-container">
              <div class="image-location-city">{{ isRemote ? "Online" : venue.city }}</div>
            </div>
          </nuxt-link>
        </div>
        <div class="info-container">
          <h3>
            <template v-if="statusMessage">[{{ statusMessage }}] - </template>
            {{ truncatedTitle }}
          </h3>
          <h4 v-if="showVenue">
            <ii-remote v-if="isRemote || isOnlineResource" iconColor="#B7B09C" width="20" height="20" />
            <ii-location v-else iconColor="#B7B09C" width="20" height="20" />
            {{ truncatedVenueName }}
          </h4>

          <template v-if="showTime">
            <p class="date">{{ when_date }}</p>
            <p class="time">{{ when_time }}</p>
          </template>
          <p class="description">{{ truncatedBriefDescription }} </p>
        </div>
      </div>
      <div class="btn-actions">
        <nuxt-link class="card-btn more-info" :class="{ '-resource': isOnlineResource}" :to="eventLink">
          More Info
        </nuxt-link>
        <span v-if="showTime" class="card-btn add-to-calendar" style="cursor: pointer" @click.stop="OpenCalendars()">
          <ii-calendar iconColor="#fff" width="16" height="16" class="ii-calendar" /><span>Add to Calendar</span>
        </span>
      </div>

      <div class="drop-down" v-show="showCalendars">
        <div @click.stop="AddEventToCalendar('iCal')">iCal</div>
        <div @click.stop="AddEventToCalendar('Outlook')">Outlook</div>
        <div @click.stop="AddEventToCalendar('Google Cal')">Google Cal</div>
      </div>
    </div>
  </div>

</template>

<script>
  import momenttz from 'moment-timezone'

  import Location from './vectors/Location.vue'
  import Calendar from './vectors/Calendar.vue'
  import Remote from './vectors/Remote.vue'

  import CalendarService from '@/services/CalendarService'

  export default {
    name: 'Card',
    props: {
      calendar_event: {
        required: true
      },
      preview: {
        type: Boolean,
        default: false
      }
    },
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
        const event = this.calendar_event && this.calendar_event.venue
          ? this.calendar_event
          : Object.assign({}, this.calendar_event, { venue: this.venue })
        CalendarService.generate(this.$config.API_URL, event, calType)
      },
      truncate(fullText, truncationLength) {
        if (!fullText) {
          return ''
        }

        fullText = fullText.trim()

        if (fullText.length <= truncationLength) {
          return fullText
        }

        return fullText.slice(0, truncationLength) + '...'
      }
    },
    computed: {
      eventLink: function () {
        return !this.preview ? { name: 'events-id', params: { id: this.calendar_event.id } } : { name: 'index' }
      },
      backGroundImage: function () {
        return 'background: url(\'' + this.calendar_event.image + '\') center center / cover no-repeat; cursor: pointer;'
      },
      statusMessage: function () {
        if (this.isCancelled) return 'Cancelled'
        else if (this.isSoldOut) return 'Sold Out'
        else if (this.isPostponed) return 'Postponed'
        else return null
      },
      truncatedTitle: function () {
        // leave extra length for status messages like 'Sold Out'
        const truncationLength = this.statusMessage ? 30 : 40

        return this.truncate(this.calendar_event?.title, truncationLength)
      },
      truncatedVenueName() {
        return this.truncate(this.venue?.name, 60)
      },
      truncatedBriefDescription() {
        return this.truncate(this.calendar_event?.brief_description, 120)
      },
      showVenue: function () {
        return !!this.calendar_event.venue_id && (!!this.calendar_event.venue || (!!this.venue && !!this.venue.id))
      },
      venue: function () {
        return this.calendar_event.venue || {}
      },
      showTime: function () {
        return !this.isOnlineResource &&
          (this.calendar_event && this.calendar_event.date_times.length > 0)
      },
      when_date: function () {
        const calendar = this.calendar_event
        const dateTimes = calendar.date_times
        const firstDay = dateTimes[0]
        return firstDay ? momenttz(firstDay.start_time).tz(firstDay.timezone || this.$config.TIMEZONE_DEFAULT).format('dddd, MMMM Do') : null
      },
      when_time: function () {
        const calendar = this.calendar_event
        const dateTimes = calendar.date_times
        const firstDay = dateTimes[0]
        const output_string = firstDay ? momenttz(firstDay.start_time).tz(firstDay.timezone || this.$config.TIMEZONE_DEFAULT).format('h:mma - ') + momenttz(firstDay.end_time).tz(firstDay.timezone || this.$config.TIMEZONE_DEFAULT).format('h:mma z') : null
        return output_string
      },
      isCancelled: function () {
        return this.calendar_event &&
          this.calendar_event.condition &&
          this.calendar_event.condition.includes('cancelled')
      },
      isPostponed: function () {
        // 'cancelled' supersedes 'postponed' for purposes of displaying event status
        return this.calendar_event &&
          this.calendar_event.condition &&
          this.calendar_event.condition.includes('postponed') &&
          !this.calendar_event.condition.includes('cancelled')
      },
      isSoldOut: function () {
        return this.calendar_event &&
          this.calendar_event.condition &&
          this.calendar_event.condition.includes('sold-out')
      },
      isRemote: function () {
        return this.calendar_event &&
          this.calendar_event.mode &&
          this.calendar_event.mode === 'online'
      },
      isOnlineResource: function () {
        return this.calendar_event &&
          this.calendar_event.category &&
          this.calendar_event.category === 'online-resource'
      }
    },
    components: {
      'ii-location': Location,
      'ii-calendar': Calendar,
      'ii-remote': Remote
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
    display: flex;
    flex-direction: column;
    min-width: 240px;
    min-height: 400px;
    padding:5px;
  }

  .infinite-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    justify-content: space-between;

    width: 240px;
    /* this makes the card fill the vertical space available in its container */
    /* it roughly accomplishes what you would think height: 100% would do */
    flex-grow: 1;

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
    /* position: absolute; */

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

  .image-container a {
    text-decoration: none;
  }

  .image-container:hover .image-surface {
    -moz-transform: scale(1.1);
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .image-container .image-location-city-container {
    position:relative;
    top: -1em;
    display: flex;
    justify-content: flex-end;
  }

.image-location-city-container .image-location-city {
    /* background-color: #B7B09C; */
    background-image: linear-gradient(to left, #fff, #B7B09C);
    max-width: 220px;
    min-width: 120px;
    padding: 6px 2em;

    font-family: 'Open Sans', sans-serif;
    /* font-weight: 600; */
    font-style: italic;
    text-decoration: none;

    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;

    /* linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1)); */
  }

  .info-container{
    /* position: absolute; */
    /* top: 150px;
    left: 0; */

    min-height: 130px;
    min-width: 240px;

    padding: 20px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .info-container h3 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 15px;
    margin-top: 10px;
    margin-bottom: 0px;
    padding-right: 10px;
  }

  .info-container h4 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 200;
    font-size: 11px;
    margin-top: 5px;
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
    padding-bottom: 30px;
  }

  .btn-actions {
    /* position: absolute;
    bottom: 5px; */

    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    justify-content: space-between;

    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    color: white;

    text-align: center;
    max-height: 50px;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 20px;
  }

  .ii-calendar {
    margin-right: 5px;
    vertical-align:middle;
    padding-bottom: 2px;
  }

  .card-btn {
    border-radius: 5px;
    padding: 7px 11px;
  }

  .add-to-calendar {
    background-color: #B7B09C;
    margin-left: 5px;
    min-width: 120px;
  }

  .more-info {
    color: white;
    background-color: #000;
    text-decoration: none;
  }

  .more-info.-resource {
    width: 100%;
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
    padding: 12px;
    padding-top: 6px;
    font-size: 0.9em;
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
    /* position: relative;
    top: 1px; */
    margin-right: 6px;
    margin-left: 2px;
  }

  .image-container .image-location-city-container {
    font-size: 1.2em;
  }

}

</style>
