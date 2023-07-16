<template>
  <event-view :event="event" />
</template>

<script>
  import EventView from '@/components/EventView.vue'
  import JsonLdService from '@/services/JsonLdService'

  export default {
    head() {
      const eventId = this.event && this.event.id ? this.event.id : null
      const title = this.event && this.event.title ? this.event.title : 'no event loaded'
      // TODO: current view sanitizes brief_description; does vue-meta do that automatically?
      const description = this.event && this.event.brief_description ? this.event.brief_description : ''
      const url = this.$urlFor('/events/' + eventId)
      const defaultImage = this.$urlFor('/images/default.jpg')

      const eventImage = this.event && this.event.image && this.event.image !== 'none' ? this.event.image : defaultImage
      const socialImage = (this.event && this.event.social_image && this.event.social_image !== 'none'
        ? this.event.social_image
        : eventImage)

      const jsonLdData = JsonLdService.forEvent(this.event)

      return {
        title,
        meta: [
          { hid: 'title', name: 'title', content: title },
          { hid: 'description', name: 'description', content: description },

          { hid: 'og:title', property: 'og:title', content: title },
          { hid: 'og:description', property: 'og:description', content: description },
          { hid: 'og:url', property: 'og:url', content: url },
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
          { hid: 'canonical', rel: 'canonical', href: url }
        ],
        ...(jsonLdData
          ? {
            script: [
              { hid: 'json-ld', type: 'application/ld+json', json: jsonLdData }
            ]
          }
          : null)
      }
    },
    validate({ params }) {
      return !!params.id
    },
    layout: 'no-subscribe',
    data() {
      return {
        event: null
      }
    },
    asyncData({ error, params, $apiService }) {
      return $apiService.get('/events/' + params.id + '?embed=Venue').then((response) => {
        return { event: response.data.event }
      }).catch((err) => {
        error({ statusCode: err.response.status, message: 'Not Found' })
      })
    },
    components: {
      'event-view': EventView
    }
  }
</script>
