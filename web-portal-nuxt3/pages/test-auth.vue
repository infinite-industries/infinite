<template>
  <template>
    <div class="container admin-page">
      <h2>Unverified Events</h2>
      <AdminEventsList :calendar_events="unverifiedEvents" class="unverified-events" />
      <h2>Current Events</h2>
      <Pagination
        :items="verifiedEvents"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-page_current-events-pagination-list"
      >
        <AdminEventsList slot-scope="page" :calendar_events="page" class="current-events" />
      </Pagination>
      <h2>Resources</h2>
      <Pagination
        :items="resourceEvents"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-page_resources-pagination-list"
      >
        <admin-events-list slot-scope="page" :calendar_events="page" class="resources" />
      </Pagination>
    </div>
  </template>
</template>

<script setup>
import { useStore } from 'vuex'
const { user } = useUserSession();

let isLessWindowLessThan900px = false;
let _mediaQueryListener;

const events = ref([])
const store = useStore()

// await callOnce('LoadAdminPageDAta', async function () {
//   await store.dispatch('admin/LoadUnverifiedEvents')
//   await store.dispatch('admin/LoadCurrentEvents')
//   await store.dispatch('admin/LoadResourceEvents')
// }, { mode: 'navigation' })

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
  if (isLessWindowLessThan900px) {
    return 5
  } else {
    return 25
  }
});

 onMounted(async () => {
   console.log('!!! mounted')
   store.dispatch('admin/LoadUnverifiedEvents')
   store.dispatch('admin/LoadCurrentEvents')
   store.dispatch('admin/LoadResourceEvents')


   console.log('!!! mounted done')
   if (window) {
     _mediaQueryListener = window.matchMedia('(max-width: 900px)')
    isLessWindowLessThan900px = _mediaQueryListener.matches

     _mediaQueryListener.addEventListener('change', onMatchMediaChange)
   }
 });

 onUnmounted(() => {
   if (_mediaQueryListener) {
     _mediaQueryListener.removeEventListener('change', onMatchMediaChange)
     _mediaQueryListener = undefined
   }
 });

 function onMatchMediaChange() {
   isLessWindowLessThan900px = t_mediaQueryListener.matches
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
