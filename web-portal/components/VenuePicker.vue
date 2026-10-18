<template>
  <div id="venue-container">
    <venue-search
      ref="venueSearch"
      :venues="venues"
      :initial_venue_id="initial_venue_id"
      v-model="localSearchTerm"
      @select-venue="emit('selectVenue', $event)"
      @open-new-venue-modal="handleModal"
    />
    <add-new-venue
      v-model="showVenueModal"
      @new-venue="handleNewVenue"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    venues: {
      type: Array,
      default: () => []
    },
    initial_venue_id: {
      type: [String, Number],
      default: null
    },
    searchterm: {
      type: [String, Number],
      default: null
    }
  })

  const emit = defineEmits(['selectVenue', 'newVenue'])

  const showVenueModal = ref(false)
  const localSearchTerm = ref(props.searchterm || '')

  watch(() => props.searchterm, (newVal) => {
    if (newVal !== localSearchTerm.value) {
      localSearchTerm.value = newVal || ''
    }
  })

  const handleModal = () => {
    showVenueModal.value = true
  }

  const handleNewVenue = (venue) => {
    emit('newVenue', venue)
    emit('selectVenue', venue)
  }
</script>

<style scoped>
  #venue-container {
    background-color: white;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
  }
</style>
