<template>
  <div class="event">
    <div class="event-heading">
      <img :src="event.image" alt="" width="100%" height="auto">
      <div class="event-heading-text">
        <h1>
          <template v-if="statusMessage">[{{ statusMessage }}] - </template>
          {{ event.title }}
        </h1>
        <!-- TODO: this should be an H2 or something other than a heading -->
        <template v-if="event.venue">
          <h3>
            <template v-if="isRemote && !venueIsRemote">Online Event Presented by</template>
            <template v-if="isOnlineResource && !isRemote && !venueIsRemote">Online Resource Presented by</template>
            {{ venueName }}
          </h3>
          <template v-if="venueAddress">
            <h4>{{ venueAddress }}</h4>
          </template>
        </template>
      </div>
    </div>
    <div class="event-time-actions">
      <div class="event-time">
        <!-- Online Resources technically have no fixed time, so suppress date display for them -->
        <div v-if="!isOnlineResource">
          <div v-for="(date_time, index) in formatted_date_times" :key="index" class="date-time-container">
            <!-- TODO: should we consider Luxon instead of Moment? -->
            <em>{{ date_time.start_date }}</em>
            <br>
            <em>{{ date_time.start_time }} - {{ date_time.end_time }} {{ date_time.timezone }}</em>
          </div>
        </div>
      </div>
      <div class="event-actions">
        <div class="event-actions-content">
          <button
            v-if="!suppressCalendarOptions"
            id="calMenu"
            class="infinite-dropdown ii-social-button add-event-to-cal dropbtn"
            :aria-expanded="showCalendarDropdown.toString()"
            @click="toggleCalendar"
          >
            <ii-calendar-icon class="ii-social-icon" icon-color="#fff" width="20" height="20" />
            <span>Add to Calendar</span>
            <div v-show="showCalendarDropdown" id="calDropdown" class="infinite-dropdown-content calendar-dropdown">
              <a href="#" @click.prevent="addToCalendar('iCal')">iCal</a>
              <a href="#" @click.prevent="addToCalendar('Outlook')">Outlook</a>
              <a href="#" @click.prevent="addToCalendar('Google Cal')">Google Cal</a>
            </div>
          </button>

          <a
            v-if="!suppressMapLink && event.venue && event.venue.g_map_link"
            class="ii-social-button map-event"
            :href="event.venue.g_map_link"
            target="_blank"
          >
            <ii-location-icon class="ii-social-icon" icon-color="#fff" width="20" height="20" />
            <span>Directions</span>
          </a>

          <button
            id="shareMenu"
            class="infinite-dropdown ii-social-button share-event dropbtn"
            :aria-expanded="showShareDropdown.toString()"
            @click="toggleShare"
          >
            <ii-share-icon
              id="share"
              class="ii-social-icon"
              icon-color="#fff"
              width="20"
              height="20"
            />
            <span>Share</span>
            <div v-show="showShareDropdown" id="shareDropdown" class="infinite-dropdown-content social-dropdown">
              <a
                class="ii-social-button"
                target="_new"
                :href="`https://www.facebook.com/sharer/sharer.php?u=${fullEncodedLinkForShare}`"
              >
                <ii-facebook-icon class="ii-social-icon" icon-color="#fff" width="20" height="20" />
                <span>Share</span>
              </a>
              <a
                class="ii-social-button"
                target="_new"
                :href="`https://twitter.com/intent/tweet?text=Check%20out%20this%20event:&url=${fullEncodedLinkForShare}`"
              >
                <ii-twitter-icon class="ii-social-icon" icon-color="#fff" width="20" height="20" />
                <span>Tweet</span>
              </a>
              <div
                v-if="event.bitly_link"
                v-clipboard:copy="event.bitly_link"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError"
                class="ii-social-button ii-copy-btn"
              >
                <ii-link-icon class="ii-social-icon" icon-color="#fff" width="20" height="20" />
                <span>Copy Link</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="event-description">
      <div v-if="event.admission_fee && event.admission_fee !== 'none'" class="row event-admission-fee">
        <div class="col s11">
          <em>Admission Fee: {{ event.admission_fee }}</em>
        </div>
      </div>
      <div class="row event-description-content">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="col s11" v-html="event.description" />
      </div>
      <div v-if="event.website_link && event.website_link !== 'none'" class="row event-website">
        <div class="col s11">
          <a
            :href="event.website_link"
            target="_new"
          >
            Event Website
          </a>
        </div>
      </div>
      <div v-if="event.fb_event_link && event.fb_event_link !== 'none'" class="row event-fb-link">
        <div class="col s11">
          <a :href="event.fb_event_link" target="_new">Facebook Event Link</a>
        </div>
      </div>
      <div v-if="event.eventbrite_link && event.eventbrite_link !== 'none'" class="row event-eventbrite-link">
        <div class="col s11">
          <a :href="event.eventbrite_link" target="_new">Eventbrite Link</a>
        </div>
      </div>
      <div v-if="event.ticket_link && event.ticket_link !== 'none'" class="row event-ticket-link">
        <div class="col s11">
          <a :href="event.ticket_link" target="_new">Buy Tickets</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CalendarService from '@/services/CalendarService'

  import Calendar from '@/components/vectors/Calendar.vue'
  import Facebook from '@/components/vectors/Facebook.vue'
  import Link from '@/components/vectors/Link.vue'
  import Location from '@/components/vectors/Location.vue'
  import momenttz from 'moment-timezone'
  import Share from '@/components/vectors/Share.vue'
  import Twitter from '@/components/vectors/Twitter.vue'

  export default {
    props: {
      event: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        showCalendarDropdown: false,
        showShareDropdown: false
      }
    },
    computed: {
      statusMessage() {
        if (this.event.condition) {
          if (this.event.condition.includes('cancelled')) return 'Cancelled'
          else if (this.event.condition.includes('sold-out')) return 'Sold Out'
          else if (this.event.condition.includes('postponed')) return 'Postponed'
          else return null
        } else return null
      },
      fullEncodedLinkForShare() {
        return encodeURI(this.$config.APP_URL + '/events/' + this.event.id)
      },
      isRemote: function () {
        return this.event &&
          this.event.mode &&
          this.event.mode === 'online'
      },
      isOnlineResource: function () {
        return this.event &&
          this.event.category &&
          this.event.category === 'online-resource'
      },
      // true if the event's venue is the special "remote" venue
      venueIsRemote: function () {
        return this.event && this.event.venue && this.event.venue.name === 'Remote Event'
      },
      venueName: function () {
        return this.event && this.event.venue && this.event.venue.name
      },
      venueAddress: function () {
        const venue = this.event && this.event.venue
        let addr = null
        // abort if street unknown, as that's be the most important part
        if (venue && venue.street) {
          addr = venue.street
          // if city is known, include it too, as well as state
          // (but don't include state w/o city)
          if (venue.city) {
            addr += ' ' + venue.state ? `, ${venue.city}, ${venue.state}` : `, ${venue.city}`
            // and only include zip if city, state is known
            if (venue.zip) addr += ' ' + venue.zip
          }
        }

        return addr
      },
      // don't show calendar options for online resources since they don't have fixed times
      suppressCalendarOptions() {
        return this.isOnlineResource
      },
      suppressMapLink() {
        return this.isRemote || this.isOnlineResource
      },
      formatted_date_times: function () {
        const date_time_elements = []
        for (const date_time of this.event.date_times) {
          date_time_elements.push({
            start_date: momenttz(date_time.start_time).tz(date_time.timezone || this.$config.TIMEZONE_DEFAULT).format('dddd, MMMM Do'),
            start_time: momenttz(date_time.start_time).tz(date_time.timezone || this.$config.TIMEZONE_DEFAULT).format('h:mma'),
            end_time: momenttz(date_time.end_time).tz(date_time.timezone || this.$config.TIMEZONE_DEFAULT).format('h:mma'),
            timezone: momenttz(date_time.end_time).tz(date_time.timezone).format('z')
          })
        }
        return date_time_elements
      }
    },
    methods: {
      toggleCalendar() {
        this.showCalendarDropdown = !this.showCalendarDropdown
      },
      addToCalendar(type) {
        CalendarService.generate(this.$config.API_URL, this.event, type)
      },
      toggleShare() {
        this.showShareDropdown = !this.showShareDropdown
      },
      onCopySuccess(e) {
        console.info('Copied to clipboard:', e.text)
        window.alert('Copied the URL. Now you can paste it into emails, tweets or any other announcements. Enjoy!')
      },
      onCopyError(e) {
        console.error('Action:', e.action)
        console.error('Trigger:', e.trigger)
        window.alert('We were unable to copy URL. Here it is for reference:\n' + this.event.bitly_link)
      }
    },
    components: {
      'ii-calendar-icon': Calendar,
      'ii-facebook-icon': Facebook,
      'ii-link-icon': Link,
      'ii-location-icon': Location,
      'ii-share-icon': Share,
      'ii-twitter-icon': Twitter
    }
  }
</script>

<style scoped>
  .event {
    max-width: 900px;
    padding: 0;
    border-radius: 10px;
    color: black;
    background-color: white;

    font-size: 1.2rem;
  }

  @media only screen and (min-width: 960px) {

    /* horizontally center event container */
    .event {
      margin: auto auto 6rem;
    }
  }

  .event-heading {
    margin-top: 0px;
  }

  .event-heading-text {
    padding: 1rem 2rem;
    color: white;
    background-color: #2a2a2a;
  }

  .event-heading img {
    display: block;
    max-height: 400px;
    object-fit: cover;
    object-position: center;
    border-radius: 10px 10px 0 0;
  }

  .event-heading-text h1 {
    margin: 5px 0;
    font-size: 2em;
    line-height: 110%;
  }

  .event-heading-text h2,
  .event-heading-text h3 {
    margin-top: 20px;
    margin-bottom: 5px;
    font-size: 1.2em;
    font-weight: lighter;
    line-height: 110%;
  }

  .event-heading-text h3 {
    font-weight: normal;
    font-size: 0.875em;
  }

  .event-time-actions {
    padding: 1rem 2rem;
  }

  @media only screen and (min-width: 600px) {

    .event-time-actions {
      display: flex;
      flex-direction: row;
      font-family: "Open Sans", sans-serif;
      line-height: 1.5;
    }

    .event-time-actions .event-time,
    .event-time-actions .event-actions {
      flex-basis: 50%;
      flex-grow: 0;
      min-width: 50%;
    }
  }

  @media only screen and (min-width: 960px) {

    .event-time-actions .event-time {
      flex-basis: 33.33%;
      flex-grow: 0;
      min-width: 33.33%;
    }

    .event-time-actions .event-actions {
      flex-basis: 66.67%;
      flex-grow: 0;
      min-width: 66.67%;
    }
  }

  .event-time-actions .event-time > div {
    display: inline-block;
    margin-left: 0.5em;
  }

  .event-time-actions .event-time > div:first-child {
    vertical-align: top;
  }

  .date-time-container {
    margin-top: 20px;
  }

  .date-time-container:not(:first-child) {
    margin-top: 15px;
  }

  .date-time-container em {
    font-size: 1.5rem;
    font-weight: 400;
  }

  @media only screen and (max-width: 960px) {
    .date-time-container em {
      font-size: 1.3rem;
    }
  }

  .event-actions {
    margin-top: 1em;
    margin-left: 0.5em;
  }

  .event-actions-content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  @media only screen and (min-width: 600px) {
    .event-actions-content {
      justify-content: flex-end;
    }
  }

  /* stuff for makeshift dropdown menu */
  .infinite-dropdown {
    position: relative;
    display: inline-block;
  }

  .infinite-dropdown-content {
    display: none;
    text-align: left;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
    padding: 5px 10px 10px;
    border-radius: 0 0 10px 10px;

    font-family: "Open Sans", sans-serif;
    font-size: 0.75em;
  }

  .infinite-dropdown-content a {
    display: block;
    color: white;
    text-decoration: none;
  }

  .infinite-dropdown-content a:hover {
    text-decoration: underline;
  }

  .calendar-dropdown {
    min-width: 150px;
  }

  .infinite-dropdown[aria-expanded="true"] .infinite-dropdown-content,
  .show {
    display: block;
  }

  .ii-social-button {
    cursor: pointer;
    text-align: center;
    color: white;
    text-decoration: none;
    margin-left: 0.75em;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .ii-social-button:first-child {
    margin-left: 0;
  }

  .ii-social-button[aria-expanded="true"] {
    border-radius: 5px 5px 0 0;
  }

  .ii-social-button:focus {
    outline: rgb(59, 153, 252) auto 5px;
  }

  .ii-social-button .infinite-dropdown-content {
    margin-top: 5px;
  }

  .ii-social-button .ii-social-icon {
    vertical-align: baseline;
  }

  .ii-social-button.add-event-to-cal .ii-social-icon {
    vertical-align: -1px;
  }

  .ii-social-button.map-event .ii-social-icon {
    vertical-align: -2px;
  }

  .ii-social-button.share-event .ii-social-icon {
    vertical-align: -3px;
  }

  /* content of social buttons is hidden on small screens */
  /* screen-reader accesible hiding taken from Bootstrap 4 */
  .ii-social-button > span {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .infinite-dropdown-content .ii-social-icon {
    font-size: 1.5em;
    margin-right: 0.5em;
  }

  .infinite-dropdown-content .ii-social-button {
    font-size: 1.1em;
    text-align: left;
    padding: 5px 0;
    margin: 0;
  }

  .infinite-dropdown-content .ii-social-button:hover {
    text-decoration: underline;
  }

  .infinite-dropdown-content a {
    font-size: 1.4em;
    padding-right: 20px;
  }

  @media only screen and (max-width: 960px) {

    .ii-social-icon {
      font-size: 2.2rem;
      padding: 2px;
    }

    .infinite-dropdown-content a {
      font-size: 1.5em;
      padding-top: 10px;
    }

    .infinite-dropdown-content .ii-social-button {
      font-size: 1.5em;
    }
  }

  @media only screen and (min-width: 960px) {

    /* shift event actions up on larger screens, overlapping with header */
    .event-actions {
      margin-top: -30px;
    }

    .ii-social-button {
      width: auto;
      min-width: 110px;
    }

    /* Show text in social buttons on larger screens */
    .ii-social-button > span {
      position: static;
      width: auto;
      height: auto;
      overflow: auto;
      clip: auto;
      white-space: normal;
    }
  }

  .event-time-actions .add-event-to-cal {
    background-color: #b7b09c;
  }

  .add-event-to-cal .infinite-dropdown-content {
    background-color: #c3bdac;
  }
  .event-heading-text h3 {
    font-size: 1.3em;
    font-weight: normal;
  }
  .event-heading-text h4 {
    font-size: 0.875em;
    font-weight: normal;
  }

  /* this menu has text-only labels, so need more space on smaller screens */
  @media only screen and (max-width: 959px) {

    .add-event-to-cal .infinite-dropdown-content {
      right: auto;
      border-radius: 0 10px 10px 10px;
    }
  }

  .event-time-actions .map-event {
    background-color: #5c5c5c;
  }

  .event-time-actions .share-event,
  .event-time-actions .social-dropdown {
    min-width: 50px;
  }

  .event-time-actions .share-event {
    background-color: #131212;
  }

  .share-event .infinite-dropdown-content {
    background-color: #212020;
  }

  @media screen and (min-width: 960px) {
    .event-time-actions .share-event,
    .event-time-actions .social-dropdown {
      min-width: 130px;
    }
  }

  .event-description {
    padding: 1rem 2rem 1rem 2rem;
  }

  .event-description .row {
    margin-bottom: 20px;
  }

  .event-description .event-admission-fee {
    font-family: "Open Sans", sans-serif;
  }

  .event-description .event-description-content {
    font-family: 'EB Garamond', serif;
  }

  .event-description .row a {
    font-family: "Open Sans", sans-serif;
    color: #039be5;
    text-decoration: none;
  }
</style>
