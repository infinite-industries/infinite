<template>
  <div class="container admin-page partner-admins-page">
    <div v-if="isLoading" class="loading-message">
      Loading events...
    </div>

    <div v-else-if="hasErrorsOnPage" class="infinite-error">
      <p v-if="!!errorFetchingUnverifiedEvents">
        {{errorFetchingUnverifiedEvents || errorFetchingVerifiedEvents}}
      </p>
    </div>

    <div v-else>
      <h2>Unverified Events</h2>

      <Pagination
        :items="unverifiedEventsForPartners"
        v-slot="page"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-partner-admins-page_pagination-list"
      >
        <AdminEventsList :calendar_events="page" class="unverified-events" />
      </Pagination>

      <h2>Verified Events</h2>

      <Pagination
        :items="verifiedEventsForPartners"
        v-slot="page"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-partner-admins-page_verified-events-pagination-list"
      >
        <AdminEventsList :calendar_events="page" class="verified-events" />
      </Pagination>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'admin',
    middleware: [
      'auth'
    ]
  })

  useHead({ title: 'Partner Admin Events - Infinite Industries' })

  const { $apiService } = useNuxtApp()

  const { user } = useUserSession()
  const isLessWindowLessThan900px = ref(false);
  const unverifiedEventsForPartners = ref(null);
  const isLoadingUnverifiedPartners = ref(true);
  const errorFetchingUnverifiedEvents = ref(null);
  const verifiedEventsForPartners = ref(null);
  const isLoadingVerifiedPartners = ref(true);
  const errorFetchingVerifiedEvents = ref(null);

  const isLoading = computed(() => {
    return isLoadingUnverifiedPartners.value || isLoadingVerifiedPartners.value;
  });

  const hasErrorsOnPage = computed(() => {
    return !!errorFetchingUnverifiedEvents.value || !!errorFetchingVerifiedEvents.value;
  });


  const maxNumberOfPageShortcuts = computed(() => {
    return isLessWindowLessThan900px.value ? 5: 25;
  });

  // === Life Cycle Hooks
  let mediaQueryListener;
  onMounted(async () => {
    if (import.meta.client) {
      // create a change handler for screen size
      mediaQueryListener = window.matchMedia('(max-width: 900px)')
      isLessWindowLessThan900px.value = mediaQueryListener.matches
      mediaQueryListener.addEventListener('change', onMatchMediaChange)
    }
  });

  onUnmounted(() => {
    if (mediaQueryListener) {
      mediaQueryListener.removeEventListener('change', onMatchMediaChange)
      mediaQueryListener = undefined
    }
  });

  // === Load Form Data ===
  const { data, error } = await useAsyncData('non-verified-events-fetch', async () =>
    $apiService.get('/authenticated/events/non-verified-for-partners'));

  if (error.value) {
    console.error('error fetching non-verified-for-partner: ', error.value);
    isLoadingUnverifiedPartners.value = false;
    errorFetchingUnverifiedEvents.value = error.value;
  } else {
    console.info('successfully loaded non-verified-for-partner')
    isLoadingUnverifiedPartners.value = false;
    unverifiedEventsForPartners.value = data.value.events;
  }

  // === Load Verified Events ===
  const { data: verifiedData, error: verifiedError } = await useAsyncData('verified-events-fetch', async () => { 
    const partnerIds = user.value.partners.map(partner => `owning_partner_id=${partner.id}`);
    const queryParam = '?' + partnerIds.join('&')
    
    return $apiService.get('/events/verified' + queryParam, {
      params: {
        owning_partner_id: partnerIds
      }
    });
  });

  if (verifiedError.value) {
    console.error('error fetching verified events: ', verifiedError.value);
    isLoadingVerifiedPartners.value = false;
    errorFetchingVerifiedEvents.value = verifiedError.value;
  } else {
    console.info('successfully loaded verified events')
    isLoadingVerifiedPartners.value = false;
    verifiedEventsForPartners.value = verifiedData.value.events || [];
  }

  // === Helper Functions ===
  function onMatchMediaChange() {
    isLessWindowLessThan900px.value = mediaQueryListener.matches
  }
</script>

<style>
.calendar-events-table.unverified-events {
  background: white;
}

.calendar-events-table.verified-events {
  background: white;
}

.ii-pagination__list.ii-partner-admins-page_pagination-list,
.ii-pagination__list.ii-partner-admins-page_verified-events-pagination-list {
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
