<template>
  <div class="container admin-page">
    <div v-if="isLoadingUser" class="loading-placeholder">
      loading...
    </div>

    <v-app v-else>
      <h1>Manage Partners</h1>

      <Pagination
        v-slot="pageItems"
        v-show="!isFetchingPartners"
        :items="partners"
        :max-number-of-page-shortcuts="maxNumberOfPageShortcuts"
        class-name-page-list="ii-admin-event-edit-page_pagination-list"
      >
        <partner-card
          v-for="partner in pageItems"
          :key="partner.id"
          :partner="partner"
          @upload-logo="handleLogoUpload"
        />
      </Pagination>
    </v-app>
  </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { FETCH_PARTNERS } from "~/store/partner.js"
  import PartnerCard from '~/components/admin-partner-edit/PartnerCard.vue'

  const store = useStore()
  const { $apiService } = useNuxtApp()

  // --- State & Computed ---

  const isLoadingUser = computed(() => store.getters.GetUserDataLoading)
  const isFetchingPartners = computed(() => store.state.partner.getPartnersQuery?.isFetching)

  const partners = computed(() => {
    const data = store.state.partner.getPartnersQuery?.data

    if (!Array.isArray(data)) {
      return []
    }
    return [...data]
  })

  const maxNumberOfPageShortcuts = 5

  const handleLogoUpload = async ({ partnerId, type, file }) => {
    console.log(`Uploading ${type} logo for partner ${partnerId}:`, file.name)

    try {
      await $apiService.uploadPartnerLogo(partnerId, type, file)
      await store.dispatch(FETCH_PARTNERS)
    } catch (error) {
      console.error('Failed to upload partner logo:', error)
    }
  }

  // --- Lifecycle ---

  onMounted(async () => {
    await store.dispatch(FETCH_PARTNERS)
  })

  // --- Meta ---

  definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
  })
</script>

<style scoped>
.admin-page {
  width: 95%;
  max-width: unset;
}

.loading-placeholder {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>
