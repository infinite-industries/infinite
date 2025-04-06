<template>
  <div class="container admin-page">
    <ClientOnly fallback-tag="span" fallback="Loading Admin Page...">
      <h2>Unverified Events</h2>
      <AdminEventsList :calendar_events="unverifiedEvents" />
      <h2>Current Events</h2>
      <Pagination
        :items="verifiedEvents"
        v-slot="page"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-page_current-events-pagination-list"
      >
        <AdminEventsList :calendar_events="page" class="current-events" />
      </Pagination>
      <h2>Resources</h2>
      <Pagination
        :items="resourceEvents"
        v-slot="page"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-page_resources-pagination-list"
      >
        <admin-events-list :calendar_events="page" class="resources" />
      </Pagination>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const { user } = useUserSession();

useHead({ title: 'Event Management - Infinite Industries' })

const isLessWindowLessThan900px = ref(false);
const store = useStore()

const unverifiedEvents = computed(() => {
  return store.getters['admin/GetUnverifiedEvents']
});

const verifiedEvents = computed(() => {
  return store.getters['admin/GetVerifiedEvents']
});

const resourceEvents = computed(() => {
  return store.getters['admin/GetResourceEvents']
});

const maxNumberOfPageShortcuts = computed(() => {
  return isLessWindowLessThan900px.value ? 5: 25;
});

let mediaQueryListener;
onMounted(async () => {
  if (process.client) {
    console.log('!!! on client')
    // create a change handler for screen size
    mediaQueryListener = window.matchMedia('(max-width: 900px)')
    isLessWindowLessThan900px.value = mediaQueryListener.matches
    mediaQueryListener.addEventListener('change', onMatchMediaChange)

    // load data
    await store.dispatch('admin/LoadUnverifiedEvents')
    await store.dispatch('admin/LoadCurrentEvents')
    await store.dispatch('admin/LoadResourceEvents')
  } else {
    console.log('!!! on server')
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

  .ii-pagination__list.ii-admin-page_current-events-pagination-list,
  .ii-pagination__list.ii-admin-page_resources-pagination-list {
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
  }

  .ii-pagination__list-wrapper {
    display: flex;
  }
</style>
