<template>
  <div id="venue-container">
    <venue-search
      ref="venueSearch"
      :venues="venues"
      :initial_venue_id="initial_venue_id"
      @select-venue="emit('selectVenue', $event)"
    />
    <add-new-venue
    @new-venue="emit('newVenue', $event)"
    />
  </div>
</template>

<script setup>
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
</script>

<style scoped>
  #venue-container {
    background-color: white;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
  }
</style>
