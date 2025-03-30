<template>
  <event-view :event="event" />
</template>

<script>
  import EventView from '@/components/EventView.vue'
  import JsonLdService from '@/services/JsonLdService'

  export default {
    async setup () {
      definePageMeta({
        layout: 'no-mobile-cta',
        validate: function ({ params }) {
          return !!params.id
        }
      })

      // fetch event and handle errors/missing
      const { $apiService, $urlFor } = useNuxtApp()
      const { params } = useRoute()
      const { data, error } = await useAsyncData('event', () => $apiService.get('/events/' + params.id + '?embed=Venue'))
      if (error.value) {
        // TODO: current implementation doesn't neccessarily 404;
        // TBD what to do
        throw createError({ statusCode: error.value.statusCode, message: 'Not Found' })
      }

      // construct head metadata
      const event = data.value.event
      const eventId = event?.id ?? null
      const title = event?.title ?? 'no event loaded'
      // TODO: current view sanitizes brief_description; does vue-meta do that automatically?
      // useHeadSafe's docs says it does
      const description = event?.brief_description ?? ''
      const url = $urlFor('/events/' + eventId)
      const defaultImage = $urlFor('/images/default.jpg')

      const eventImage = event?.image && event.image !== 'none' ? event.image : defaultImage
      const socialImage = (event && event.social_image && event.social_image !== 'none'
        ? event.social_image
        : eventImage)

      const jsonLdData = JsonLdService.forEvent(event)

      useHead({
        title, // TODO: why doesn't this work with useHeadSafe?
      })
      useHeadSafe({
        // title,
        meta: [
          { name: 'title', content: title },
          { name: 'description', content: description },

          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: url },
          { property: 'og:type', content: 'article' },
          { property: 'og:image', content: socialImage },
          { property: 'og:image:alt', content: 'Check out ' + title },

          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image:src', content: socialImage },

          // TODO: is this setting actually what we want?
          { hid: 'robots', name: 'robots', content: 'index, noarchive, nocache' }
        ],
        link: [
          { rel: 'canonical', href: $urlFor('/events/' + event.id)}
        ],
        ...(jsonLdData
          ? {
            script: [
              { type: 'application/ld+json', textContent: jsonLdData }
            ]
          }
          : null)
      })

      return {
        event
      }
    },
    components: {
      'event-view': EventView
    }
  }
</script>
