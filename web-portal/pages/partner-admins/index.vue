<template>
  <div class="container partner-admins-page">
    <h2>Unverified Events for {{ user?.name || 'User' }}</h2>
    
    <div v-if="IsLoading" class="loading-message">
      Loading events...
    </div>
    
    <div v-else-if="!IsInitialized" class="no-data-message">
      No events have been fetched yet.
    </div>
    
    <div v-else>
      <Pagination
        :items="unverifiedEventsForPartners"
        v-slot="page"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-partner-admins-page_pagination-list"
      >
        <AdminEventsList :calendar_events="page" class="unverified-events" />
      </Pagination>
    </div>
  </div>
</template>

<script setup>
  import { useStore } from 'vuex'

  definePageMeta({
    middleware: [
      'auth'
    ]
  })

  useHead({ title: 'Partner Admin Events - Infinite Industries' })

  const { user } = useUserSession()
  const isLessWindowLessThan900px = ref(false);
  const store = useStore()

  const unverifiedEventsForPartners = computed(() => {
    return store.getters['partner-admin/GetUnverifiedEventsForPartners']
  });

  const IsInitialized = computed(() => {
    return store.getters['partner-admin/IsInitialized']
  });

  const IsLoading = computed(() => {
    return store.getters['partner-admin/IsLoading']
  });

  const maxNumberOfPageShortcuts = computed(() => {
    return isLessWindowLessThan900px.value ? 5: 25;
  });

  let mediaQueryListener;
  onMounted(async () => {
    if (import.meta.client) {
      // create a change handler for screen size
      mediaQueryListener = window.matchMedia('(max-width: 900px)')
      isLessWindowLessThan900px.value = mediaQueryListener.matches
      mediaQueryListener.addEventListener('change', onMatchMediaChange)

      // load data
      await store.dispatch('partner-admin/LoadUnverifiedEventsForPartners')
    }
  });

  onUnmounted(() => {
    if (mediaQueryListener) {
      mediaQueryListener.removeEventListener('change', onMatchMediaChange)
      mediaQueryListener = undefined
    }
  });

  function onMatchMediaChange() {
    isLessWindowLessThan900px.value = mediaQueryListener.matches
  }
</script>

<style>
.calendar-events-table.unverified-events {
  background: white;
}

.ii-pagination__list.ii-partner-admins-page_pagination-list {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
}

.ii-pagination__list-wrapper {
  display: flex;
}

.loading-message,
.no-data-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.partner-admins-page {
  padding: 2rem;
}

.partner-admins-page h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}
</style>
