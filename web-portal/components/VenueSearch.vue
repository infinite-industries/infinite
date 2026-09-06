<template>
  <div class="component-container">
    <input
      type="text"
      class="text-input venue"
      v-model="searchterm"
      placeholder="Search for a venue"
      @focusin="showDropdownContent"
      @focusout="hideDropdownContent"
      @keyup.enter="hitEnter"
    />
    <div class="results-container" v-if="show">

      <!-- Existing Venue Results -->
      <div
        v-for="venue in queryResults"
        :key="venue.id"
        class="venue-result"
        @mousedown="selectVenue(venue)"
      >
        {{ venue.name }}
        <p>{{ venue.address }}</p>
      </div>

      <!-- Always-visible "Add New" Option -->
      <div
        class="add-new-option"
        @mousedown="openNewVenueModal"
      >
        + Add new venue...
      </div>

    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'

  const props = defineProps({
    venues: {
      type: Array,
      default: () => []
    },
    initial_venue_id: {
      type: [Number, String],
      default: null
    },
    modelValue: {
      type: [String, Number],  // Allow both
      default: ''
    }
  })

  const emit = defineEmits(['selectVenue', 'openNewVenueModal', 'update:modelValue'])

  const show = ref(false)

  // Helper: resolve ID or name → always returns name
  const resolveToName = (value) => {
    if (!value && value !== 0) return ''
    const strValue = String(value)
    const venueById = props.venues?.find(v => String(v.id) === strValue)
    return venueById ? venueById.name : strValue
  }

  // Initialize with resolved name
  const searchterm = ref(resolveToName(props.modelValue))

  const showDropdownContent = () => {
    show.value = true
  }

  const hideDropdownContent = () => {
    show.value = false
  }

  const selectVenue = (venue) => {
    searchterm.value = venue.name
    hideDropdownContent()
    emit('selectVenue', venue)
  }

  const openNewVenueModal = () => {
    hideDropdownContent()
    searchterm.value = ''
    emit('openNewVenueModal')
  }

  const handleNewVenue = (venue) => {
    searchterm.value = venue.name
  }

  const hitEnter = () => {
    if (queryResults.value.length === 1) {
      selectVenue(queryResults.value[0])
    }
  }

  const initToVenueId = () => {
    const venue = props.venues.find(v => v.id === props.initial_venue_id)
    if (venue) {
      searchterm.value = venue.name
    }
  }

  const queryResults = computed(() => {
    if (!props.venues || props.venues.length === 0) {
      return []
    }
    return props.venues.filter((venue) => {
      return venue.name.toLowerCase().includes(searchterm.value.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchterm.value.toLowerCase())
    })
  })

  onMounted(() => {
    if (props.initial_venue_id && props.venues?.length > 0) {
      initToVenueId()
    }
  })

  watch(() => props.initial_venue_id, (newId, oldId) => {
    if (!oldId && newId && props.venues?.length > 0) {
      initToVenueId()
    }
  })

  watch(() => props.venues, (newVenues, oldVenues) => {
    if ((!oldVenues || oldVenues.length === 0) && newVenues?.length > 0 && props.initial_venue_id) {
      initToVenueId()
    }
    // Also re-resolve current searchterm in case venues just loaded
    if (newVenues?.length > 0 && searchterm.value) {
      const resolved = resolveToName(searchterm.value)
      if (resolved !== searchterm.value) {
        searchterm.value = resolved
      }
    }
  })

  // Resolve modelValue to name (handles both ID and name being passed)
  watch(() => props.modelValue, (newVal) => {
    const resolvedName = resolveToName(newVal)
    if (resolvedName !== searchterm.value) {
      searchterm.value = resolvedName
    }
  })

  // Sync typing back to parent (always sends name, never ID)
  watch(searchterm, (newVal) => {
    emit('update:modelValue', newVal)
  })

  defineExpose({
    handleNewVenue
  })
</script>

<style scoped>
.component-container {
  display: inline-block;
  margin: 15px 0;
  width: 100%;
  position: relative;
}
.text-input {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
}
.results-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 2;
  max-height: 250px;
  overflow-y: auto;
}
.venue-result {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}
.venue-result:hover {
  background-color: #f1f1f1;
}
.venue-result p {
  font-size: 0.8em;
  color: rgb(88, 88, 88);
  margin: 0px;
}

.add-new-option {
  color: #1976d2;
  padding: 12px 16px;
  display: block;
  cursor: pointer;
  font-style: italic;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}
.add-new-option:hover {
  background-color: #e3f2fd;
}
</style>
