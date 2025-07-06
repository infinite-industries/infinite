<template>
  <div class="container admin-page admin-event-edit-page">
    <div class="admin-event-edit-page__list-filters">
      <div>
        <input v-model="searchByNameValue" type="text" placeholder="search by name" />
      </div>

      <div>
        <select
          class="admin-event-edit-page__active-state-filter"
          v-model="selectedList"
          @change="onFilter()"
        >
          <option value="Active Venues">Active Venues</option>
          <option value="Deleted Venues">Deleted Venues</option>
        </select>
      </div>
    </div>

    <div class="admin-event-edit-page_venue-list">
      <VenueSpinner :is-shown="isFetching">Loading Venues...</VenueSpinner>

      <Pagination
        v-slot="page"
        v-show="!isFetching"
        :items="selectedVenueList || []"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-event-edit-page_pagination-list"
      >
        <venue-card v-for="venue in page" :venue="venue" :key="venue.id" />
      </Pagination>
    </div>
  </div>
</template>

<script setup>
  import { useStore } from 'vuex'
  import {
    ACTIVE_VENUE_SELECTION,
    COMMIT_VENUE_CHANGE_ACTIVE_FILTER_STATE,
    FETCH_ACTIVE_VENUES,
    FETCH_DELETED_VENUES
  } from "~/store/venues.js";
  import VenueSpinner from "~/components/admin-venue-edit/VenueSpinner.vue";
  import VenueCard from "~/components/admin-venue-edit/VenueCard.vue";

  const store = useStore();

  definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
  })

  const selectedList = ref(ACTIVE_VENUE_SELECTION)
  const searchByNameValue = ref('')
  const isWindowExtraSmall = ref(false)
  const isWindowSmall = ref(false)
  const isWindowMedium = ref(false)

  const mediaQueryListenerExtraSmall = ref(null);
  const mediaQueryListenerSmall = ref(null);
  const mediaQueryListenerMedium = ref(null);

  const maxNumberOfPageShortcuts = computed(() => {
    if (isWindowExtraSmall.value) {
      return 2;
    } else if (isWindowSmall.value) {
      return 5;
    } else if (isWindowMedium.value) {
      return 10;
    } else {
      return 25;
    }
  });

  const isSearchEntered = computed(() => {
    return searchByNameValue.value.trim().length > 0;
  });

  const activeVenues = computed(() => {
    return [...store.state.venues.getActiveVenuesQuery.data].sort(sortMethod);
  });

  const deletedVenues = computed(() => {
    return [...store.state.venues.getDeletedVenuesQuery.data].sort(sortMethod);
  });

  const isShowingActive = computed(() => {
    return selectedList.value === 'Active Venues';
  });

  const isFetching = computed(() => {
    return store.state.venues.getDeletedVenuesQuery.isFetching ||
      store.state.venues.getActiveVenuesQuery.isFetching;
  });

  const selectedVenueList = computed(() => {
    const selectedList = isShowingActive.value
      ? activeVenues.value
      : deletedVenues.value;

    if (isSearchEntered.value) {
      return selectedList.filter(value =>
        value.name.toLowerCase().includes(searchByNameValue.value.toLowerCase())
      );
    } else {
      return selectedList || [];
    }
  });

  onMounted(async () => {
    if (isShowingActive.value) {
      store.dispatch(FETCH_ACTIVE_VENUES)
    } else {
      store.dispatch(FETCH_DELETED_VENUES)
    }

    mediaQueryListenerExtraSmall.value = window.matchMedia('(max-width: 500px)');
    mediaQueryListenerSmall.value = window.matchMedia('(max-width: 900px)');
    mediaQueryListenerMedium.value = window.matchMedia('(max-width: 1660px)');

    // Initial call to handle the current state
    onMatchMediaChange();

    // Add event listeners
    mediaQueryListenerExtraSmall.value.addEventListener('change', onMatchMediaChange);
    mediaQueryListenerSmall.value.addEventListener('change', onMatchMediaChange);
    mediaQueryListenerMedium.value.addEventListener('change', onMatchMediaChange);
  });

  onUnmounted(() => {
    if (mediaQueryListenerExtraSmall.value) {
      mediaQueryListenerExtraSmall.value.removeEventListener('change', onMatchMediaChange);
      mediaQueryListenerExtraSmall.value = null;
    }

    if (mediaQueryListenerSmall.value) {
      mediaQueryListenerSmall.value.removeEventListener('change', onMatchMediaChange);
      mediaQueryListenerSmall.value = null;
    }

    if (mediaQueryListenerMedium.value) {
      mediaQueryListenerMedium.value.removeEventListener('change', onMatchMediaChange);
      mediaQueryListenerMedium.value = null;
    }
  });

  function onFilter() {
    store.commit(COMMIT_VENUE_CHANGE_ACTIVE_FILTER_STATE, selectedList)

    if (selectedList.value === 'Active Venues') {
      store.dispatch(FETCH_ACTIVE_VENUES);
    } else if (selectedList.value === 'Deleted Venues') {
      store.dispatch(FETCH_DELETED_VENUES);
    }
  }

  function sortMethod (venueA, venueB) {
    return venueA.name > venueB.name ? 1 : -1
  }

  function onMatchMediaChange() {
    isWindowExtraSmall.value = mediaQueryListenerExtraSmall.value.matches
    isWindowSmall.value = mediaQueryListenerSmall.value.matches
    isWindowMedium.value = mediaQueryListenerMedium.value.matches
  }
</script>

<style>
.ii-pagination__list.ii-admin-event-edit-page_pagination-list {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
}

.ii-pagination__list-wrapper {
  display: flex;
}

.container.admin-page.admin-event-edit-page {
  max-width: 1446px;
}
</style>
