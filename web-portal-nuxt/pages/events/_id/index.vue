<template>
  <div class="container event">
    <div class="event-heading">
      <img :src="event.image" alt="" width="100%" height="auto">
      <div class="event-heading-text">
        <h1>{{ event.title }}</h1>
        <!-- TODO: this should be an H2 or something other than a heading -->
        <h3>{{ event.venue.name }}</h3>
      </div>
    </div>
    <div class="event-time-actions">
      <div class="event-time">
        <div>
          <!-- TODO (NUXT): we were generating formatted times on the server -->
          <!-- how do we want to handle that going forward? -->
          <div
            v-for="(date_time, index) in formattedDates"
            :key="index"
            class="date-time-container"
          >
            <em>{{ date_time.when_date }}</em> <br>
            <em>{{ date_time.when_time }}</em> <i>Eastern Time</i>
          </div>
        </div>
      </div>
      <div class="event-actions">
        <button
          id="calMenu"
          class="infinite-dropdown ii-social-button add-event-to-cal dropbtn"
          :aria-expanded="showCalendarDropdown.toString()"
          @click="toggleCalendar"
        >
          <i class="fas fa-calendar-alt ii-social-icon" />
          <span>Add to Calendar</span>
          <div v-show="showCalendarDropdown" id="calDropdown" class="infinite-dropdown-content calendar-dropdown">
            <a href="#" @click.prevent="addToCalendar('iCal')">iCal</a>
            <a href="#" @click.prevent="addToCalendar('Outlook')">Outlook</a>
            <a href="#" @click.prevent="addToCalendar('Google Cal')">Google Cal</a>
          </div>
        </button>

        <a
          v-if="event.venue && event.venue.g_map_link"
          class="ii-social-button map-event"
          :href="event.venue.g_map_link"
          target="_blank"
        >
          <i class="fas fa-map-marker-alt ii-social-icon" />
          <span>Directions</span>
        </a>

        <button
          id="shareMenu"
          class="infinite-dropdown ii-social-button share-event dropbtn"
          :aria-expanded="showShareDropdown.toString()"
          @click="toggleShare"
        >
          <i class="fas fa-share ii-social-icon" />
          <span>Share</span>
          <div v-show="showShareDropdown" id="shareDropdown" class="infinite-dropdown-content social-dropdown">
            <a
              class="ii-social-button"
              target="_new"
              :href="`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Finfinite.industries%2Fevent%2F${event.id}`"
            >
              <i class="fab fa-facebook-square ii-social-icon" />
              <span>Share</span>
            </a>
            <a
              class="ii-social-button"
              target="_new"
              :href="`https://twitter.com/intent/tweet?text=Check%20out%20this%20event:&url=${event.bitly_link}`"
            >
              <i class="fab fa-twitter ii-social-icon" />
              <span>Tweet</span>
            </a>
            <div
              v-if="event.bitly_link"
              v-clipboard:copy="event.bitly_link"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError"
              class="ii-social-button ii-copy-btn"
            >
              <i class="fas fa-link ii-social-icon" />
              <span>Copy Link</span>
            </div>
          </div>
        </button>
      </div>
    </div>
    <div class="event-description">
      <div v-if="event.admission_fee && event.admission_fee !== 'none'" class="row event-admission-fee">
        <div class="col s11">
          <em>Admission Fee: {{ event.admission_fee }}</em>
        </div>
      </div>
      <div class="row event-description-content">
        <!-- TODO (NUXT): this is supposed to be markup, right? -->
        <!-- what does the "safe" filter (?) in the old template do? -->
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
  import { ApiService } from '@/services/ApiService'
  import CalendarService from '@/services/CalendarService'

  export default {
    head() {
      const eventId = this.event && this.event.id ? this.event.id : null
      const title = this.event && this.event.title ? this.event.title : 'no event loaded'
      // TODO: current view sanitizes brief_description; does vue-meta do that automatically?
      const description = this.event && this.event.brief_description ? this.event.brief_description : ''
      const defaultImage = 'https://infinite.industries/images/default.jpg'
      const socialImage = this.event && this.event.social_image && this.event.social_image !== 'none'
        ? this.event.social_image
        : defaultImage
      return {
        title,
        meta: [
          { hid: 'title', name: 'title', content: title },
          { hid: 'description', name: 'description', content: description },

          { hid: 'og:title', property: 'og:title', content: title },
          { hid: 'og:description', property: 'og:description', content: description },
          { hid: 'og:url', property: 'og:url', content: 'https://infinite.industries/event/' + eventId },
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'og:image', property: 'og:image', content: socialImage },
          { hid: 'og:image:alt', property: 'og:image:alt', content: 'Check out ' + title },

          { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
          { hid: 'twitter:title', name: 'twitter:title', content: title },
          { hid: 'twitter:description', name: 'twitter:description', content: description },
          { hid: 'twitter:image:src', name: 'twitter:image:src', content: socialImage },

          // TODO: is this setting actually what we want?
          { hid: 'robots', name: 'robots', content: 'index, noarchive, nocache' }
        ],
        link: [
          // TODO: should canonical link pull base URL from env / other config?
          { hid: 'canonical', rel: 'canonical', href: 'https://infinite.industries/event/' + eventId } // ,
          // TODO (NUXT): this is probably the time to drop this
          //              we can't control the order in which stylesheets load,
          //              which messes up selector precedence
          // { hid: 'materialize', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css' }
        ],
        script: [
          // TODO (NUXT): is this a license key?
          //              if so, we should move the value to the env file
          // Try this to prevent render mismatch: https://catalin.me/fontawesome-nuxt/
          { src: 'https://use.fontawesome.com/9929e77eb0.js' },
          {
            src: 'https://use.fontawesome.com/releases/v5.0.9/js/all.js',
            defer: true,
            crossorigin: 'anonymous',
            integrity: 'sha384-8iPTk2s/jMVj81dnzb/iFR2sdA7u06vHJyyLlAd4snFpCl/SnyUjRrbdJsw1pGIl'
          }
        ]
      }
    },
    validate({ params }) {
      return !!params.id
    },
    data() {
      return {
        event: null,
        showCalendarDropdown: false,
        showShareDropdown: false
      }
    },
    computed: {
      formattedDates() {
        if (this.event && this.event.date_times) {
          return this.event.date_times.map((dt) => {
            return {
              when_date: (new Date(dt.start_time)).toLocaleDateString(),
              when_time: `${(new Date(dt.start_time)).toLocaleTimeString()} - ${(new Date(dt.end_time)).toLocaleTimeString()}`
            }
          })
        } else return []
      }
    },
    asyncData({ error, params }) {
      return ApiService.get('/events/' + params.id).then((response) => {
        return { event: response.data.event }
      }).catch((err) => {
        error({ statusCode: err.response.status, message: 'Not Found' })
      })
    },
    methods: {
      toggleCalendar() {
        this.showCalendarDropdown = !this.showCalendarDropdown
      },
      addToCalendar(type) {
        CalendarService.generate(this.event, type)
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
    }
  }
</script>

<style scoped>
  .event {
    padding: 0;
    margin-top: 75px;
    border-radius: 10px;
    color: black;
    background-color: white;

    font-size: 1.2rem;
  }

  @media only screen and (min-width: 960px) {

    /* horizontally center event container with extra top and bottom margin on larger screens */
    .event {
      margin: 8rem auto;
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

  .event-time-actions {
    padding: 1rem 2rem;
  }

  @media only screen and (min-width: 600px) {

    .event-time-actions {
      display: flex;
      flex-direction: row;
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

  .social-dropdown {
    min-width: 130px;
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

  .share-event {
    min-width: 130px;
  }
  .event-time-actions .share-event {
    background-color: #131212;
  }

  .share-event .infinite-dropdown-content {
    background-color: #212020;
  }

  .event-description {
    padding: 1rem 2rem 1rem 2rem;
  }

  .event-description .event-description-content {
    font-family: 'EB Garamond', serif;
  }
</style>
