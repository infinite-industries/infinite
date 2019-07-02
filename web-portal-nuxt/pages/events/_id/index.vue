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
      <div class="event-time"></div>
      <div class="event-actions"></div>
    </div>
    <div class="event-description">
      <div v-if="event.admission_fee && event.admission_fee !== 'none'" class="row event-admission-fee">
        <div class="col s11">
          <em>Admission Fee: {{ event.admission_fee }}</em>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ApiService } from '@/services/ApiService'

  export default {
    props: {
      id: {
        type: String
      }
    },
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
          { hid: 'canonical', rel: 'canonical', href: 'https://infinite.industries/event/' + eventId }
        ]
      }
    },
    data() {
      return {
        event: null
      }
    },
    asyncData({ error, params }) {
      // TODO: can we enforce this param as required?
      //       pages are structured as docs say to do but it's
      //       still routing without it
      if (!params.id) return error({ status: 404, message: 'Not Found' })
      return ApiService.get('/events/' + params.id).then((response) => {
        return { event: response.data.event }
      }).catch((err) => {
        error({ statusCode: err.response.status, message: 'Not Found' })
      })
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
</style>
