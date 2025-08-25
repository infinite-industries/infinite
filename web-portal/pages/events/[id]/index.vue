<template>
  <event-view :event="event" />
</template>

<script setup>
  import EventView from '@/components/EventView.vue'
  import JsonLdService from '@/services/JsonLdService'

  definePageMeta({
    layout: 'no-mobile-cta',
    validate: function ({ params }) {
      return !!params.id
    }
  })

  const event = ref(null)

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
  event.value = data.value.event
  const eventId = event.value?.id ?? null
  const title = event.value?.title ?? 'no event loaded'
  // TODO: current view sanitizes brief_description; does vue-meta do that automatically?
  // useHeadSafe's docs says it does
  const description = event.value?.brief_description ?? ''
  const url = $urlFor('/events/' + eventId)
  const defaultImage = $urlFor('/images/default.jpg')

  const eventImage = event.value?.image && event.value.image !== 'none' ? event.value.image : defaultImage
  const socialImage = (event.value && event.value.social_image && event.value.social_image !== 'none'
    ? event.value.social_image
    : eventImage)

  const jsonLdData = JsonLdService.forEvent(event.value)

  useHead({
    title, // TODO: why doesn't this work with useHeadSafe?
    // TODO: or link?
    link: [
      { rel: 'canonical', href: $urlFor('/events/' + eventId) }
    ],
    ...(jsonLdData
      ? {
        script: [
          { type: 'application/ld+json', innerHTML: jsonLdData }
        ]
      }
      : null)
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
      { name: 'robots', content: 'index, noarchive, nocache' }
    ]
  })
</script>
