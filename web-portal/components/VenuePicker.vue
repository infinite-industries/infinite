<template>
  <div id="venue-container">
    <venue-search
      ref="venueSearch"
      :venues="venues"
      :initial_venue_id="initial_venue_id"
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
  import { ref } from 'vue'

  defineProps({
    venues: {
      type: Array,
      default: () => []
    },
    initial_venue_id: {
      type: [String, Number],
      default: null
    }
  })

  const emit = defineEmits(['selectVenue', 'newVenue'])

  const showVenueModal = ref(false)

  const handleModal = () => {
    showVenueModal.value = true
  }

  const handleNewVenue = (venue) => {
    emit('newVenue', venue)
  }
</script>

<style scoped>
  #venue-container {
    background-color: white;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
  }
</style>
