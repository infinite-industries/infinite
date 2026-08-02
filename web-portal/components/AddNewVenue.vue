<template>
  <Modal v-model="isModalOpen" title="Add a new venue:">
    <form id="venueForm" @submit.prevent="submitNewVenue">
      <div class="form-group">
        <label for="venueName">
          Venue Name<span class="sr-only"> (required)</span><span class="required-field">*</span>
        </label>
        <input
          type="text"
          id="venueName"
          v-model="new_venue.name"
          required
          placeholder="e.g. The Grand Theater"
        >
      </div>

      <fieldset class="address-fieldset">
        <legend class="sr-only">Address Details</legend>

        <div class="form-group">
          <label for="venueStreet">
            Street Address<span class="sr-only"> (required)</span><span class="required-field">*</span>
          </label>
          <input
            type="text"
            id="venueStreet"
            v-model="new_venue.street"
            required
            placeholder="e.g. 123 Main St"
          >
        </div>

        <div class="form-group autocomplete-wrapper">
          <label id="venueCityLabel" for="venueCity">
            City<span class="sr-only"> (required)</span><span class="required-field">*</span>
          </label>
          <div class="autocomplete-container" ref="cityDropdownContainer">
            <input
              type="text"
              id="venueCity"
              role="combobox"
              aria-autocomplete="list"
              :aria-expanded="showCityDropdown"
              aria-haspopup="listbox"
              aria-controls="venueCityListbox"
              :aria-activedescendant="cityActiveDescendantId"
              v-model="new_venue.city"
              @focus="showCityDropdown = true"
              @input="showCityDropdown = true"
              @keydown="handleCityKeydown"
              @blur="handleCityBlur"
              required
              placeholder="Start typing or select..."
              autocomplete="off"
            >
            <ul
              v-if="showCityDropdown && filteredCities.length > 0"
              id="venueCityListbox"
              class="autocomplete-dropdown"
              role="listbox"
              aria-labelledby="venueCityLabel"
            >
              <li
                role="option"
                v-for="(city, index) in filteredCities"
                :key="city"
                :id="`venueCityOption-${index}`"
                :aria-selected="index === cityHighlightIndex"
                :class="{ 'active': index === cityHighlightIndex }"
                @mousedown.prevent="selectCity(city)"
                @mouseenter="cityHighlightIndex = index"
              >
                {{ city }}
              </li>
            </ul>
          </div>
        </div>

        <div class="form-group autocomplete-wrapper">
          <label id="venueStateLabel" for="venueState">
            State<span class="sr-only"> (required)</span><span class="required-field">*</span>
          </label>
          <div class="autocomplete-container" ref="stateDropdownContainer">
            <input
              type="text"
              id="venueState"
              role="combobox"
              aria-autocomplete="list"
              :aria-expanded="showStateDropdown"
              aria-haspopup="listbox"
              aria-controls="venueStateListbox"
              :aria-activedescendant="stateActiveDescendantId"
              v-model="new_venue.state"
              @focus="showStateDropdown = true"
              @input="showStateDropdown = true"
              @keydown="handleStateKeydown"
              @blur="handleStateBlur"
              required
              placeholder="Start typing or select..."
              autocomplete="off"
            >
            <ul
              v-if="showStateDropdown && filteredStates.length > 0"
              id="venueStateListbox"
              class="autocomplete-dropdown"
              role="listbox"
              aria-labelledby="venueStateLabel"
            >
              <li
                role="option"
                v-for="(state, index) in filteredStates"
                :key="state"
                :id="`venueStateOption-${index}`"
                :aria-selected="index === stateHighlightIndex"
                :class="{ 'active': index === stateHighlightIndex }"
                @mousedown.prevent="selectState(state)"
                @mouseenter="stateHighlightIndex = index"
              >
                {{ state }}
              </li>
            </ul>
          </div>
        </div>

        <div class="form-group">
          <label for="venueZip">
            Zip Code<span class="sr-only"> (required)</span><span class="required-field">*</span>
          </label>
          <input
            type="text"
            id="venueZip"
            inputmode="numeric"
            pattern="[0-9]*"
            v-model="new_venue.zip"
            required
            placeholder="e.g. 40501"
          >
        </div>
      </fieldset>

      <div class="form-group">
        <label for="venueNeighborhood">Neighborhood</label>
        <input
          type="text"
          id="venueNeighborhood"
          v-model="new_venue.neighborhood"
          placeholder="Optional"
        >
      </div>

      <div class="form-group">
        <label for="venueMapLink">Google Maps Link</label>
        <input
          type="url"
          id="venueMapLink"
          v-model="new_venue.g_map_link"
          placeholder="https://maps.google.com/..."
        >
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn-text" @click="close">
        Cancel
      </button>
      <button
        type="submit"
        form="venueForm"
        class="btn-outline"
        :disabled="!venueRequiredFields"
      >
        Add Venue
      </button>
      <div
        v-if="showVenueLoadingSpinner"
        role="status"
        aria-live="polite"
        class="loading-status"
      >
        <img
          class="loading-spinner"
          src="~/assets/images/spinner.gif"
          alt=""
          aria-hidden="true"
        >
        <span class="sr-only">Saving venue...</span>
      </div>
    </template>

  </Modal>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount, defineExpose } from 'vue'
  import { useStore } from 'vuex'
  import { FETCH_ACTIVE_VENUES } from '../store/venues'
  import Modal from '~/components/Modal.vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:modelValue', 'newVenue'])

  const isModalOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const close = () => {
    isModalOpen.value = false
  }

  const store = useStore()
  const { $apiService } = useNuxtApp()

  const showVenueLoadingSpinner = ref(false)
  const new_venue = ref({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    neighborhood: '',
    g_map_link: ''
  })

  // City autocomplete state
  const showCityDropdown = ref(false)
  const cityHighlightIndex = ref(-1)
  const cityDropdownContainer = ref(null)

  // State autocomplete state
  const showStateDropdown = ref(false)
  const stateHighlightIndex = ref(-1)
  const stateDropdownContainer = ref(null)

  const cityActiveDescendantId = computed(() =>
    cityHighlightIndex.value >= 0 ? `venueCityOption-${cityHighlightIndex.value}` : null
  )

  const stateActiveDescendantId = computed(() =>
    stateHighlightIndex.value >= 0 ? `venueStateOption-${stateHighlightIndex.value}` : null
  )

  const venueRequiredFields = computed(() => {
    return new_venue.value.name !== '' &&
      new_venue.value.street !== '' &&
      new_venue.value.city !== '' &&
      new_venue.value.state !== '' &&
      new_venue.value.zip !== ''
  })

  const suggestedCities = [
    'Lexington', 'Danville', 'Versailles', 'Frankfort', 'Berea',
    'Richmond', 'Whitesburg', 'Harrodsburg', 'Georgetown', 'Louisville',
    'Midway', 'Winchester', 'Nicholasville', 'Cincinnati', 'Covington',
    'Morehead', 'Pikeville', 'Hazard', 'Paris', 'Mount Sterling'
  ]

  const suggestedStates = [
    'Kentucky', 'Ohio', 'West Virginia', 'Tennessee'
  ]

  const filteredCities = computed(() => {
    const query = new_venue.value.city.toLowerCase()
    if (!query) return suggestedCities
    return suggestedCities.filter(city => city.toLowerCase().includes(query))
  })

  const filteredStates = computed(() => {
    const query = new_venue.value.state.toLowerCase()
    if (!query) return suggestedStates
    return suggestedStates.filter(state => state.toLowerCase().includes(query))
  })

  // Helper to ensure active options scroll into view
  const scrollOptionIntoView = (optionId) => {
    if (optionId) {
      const element = document.getElementById(optionId)
      if (element) {
        element.scrollIntoView({ block: 'nearest' })
      }
    }
  }

  const selectCity = (city) => {
    new_venue.value.city = city
    showCityDropdown.value = false
    cityHighlightIndex.value = -1
  }

  const selectState = (state) => {
    new_venue.value.state = state
    showStateDropdown.value = false
    stateHighlightIndex.value = -1
  }

  const handleCityKeydown = (e) => {
    if (!showCityDropdown.value || filteredCities.value.length === 0) {
      showCityDropdown.value = true
      return
    }

    switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      cityHighlightIndex.value = Math.min(
        cityHighlightIndex.value + 1,
        filteredCities.value.length - 1
      )
      scrollOptionIntoView(cityActiveDescendantId.value)
      break
    case 'ArrowUp':
      e.preventDefault()
      cityHighlightIndex.value = Math.max(cityHighlightIndex.value - 1, -1)
      scrollOptionIntoView(cityActiveDescendantId.value)
      break
    case 'Home':
      e.preventDefault()
      cityHighlightIndex.value = 0
      scrollOptionIntoView(cityActiveDescendantId.value)
      break
    case 'End':
      e.preventDefault()
      cityHighlightIndex.value = filteredCities.value.length - 1
      scrollOptionIntoView(cityActiveDescendantId.value)
      break
    case 'Enter':
      e.preventDefault()
      if (cityHighlightIndex.value >= 0) {
        selectCity(filteredCities.value[cityHighlightIndex.value])
      }
      break
    case 'Escape':
      showCityDropdown.value = false
      cityHighlightIndex.value = -1
      break
    }
  }

  const handleStateKeydown = (e) => {
    if (!showStateDropdown.value || filteredStates.value.length === 0) {
      showStateDropdown.value = true
      return
    }

    switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      stateHighlightIndex.value = Math.min(
        stateHighlightIndex.value + 1,
        filteredStates.value.length - 1
      )
      scrollOptionIntoView(stateActiveDescendantId.value)
      break
    case 'ArrowUp':
      e.preventDefault()
      stateHighlightIndex.value = Math.max(stateHighlightIndex.value - 1, -1)
      scrollOptionIntoView(stateActiveDescendantId.value)
      break
    case 'Home':
      e.preventDefault()
      stateHighlightIndex.value = 0
      scrollOptionIntoView(stateActiveDescendantId.value)
      break
    case 'End':
      e.preventDefault()
      stateHighlightIndex.value = filteredStates.value.length - 1
      scrollOptionIntoView(stateActiveDescendantId.value)
      break
    case 'Enter':
      e.preventDefault()
      if (stateHighlightIndex.value >= 0) {
        selectState(filteredStates.value[stateHighlightIndex.value])
      }
      break
    case 'Escape':
      showStateDropdown.value = false
      stateHighlightIndex.value = -1
      break
    }
  }

  const handleCityBlur = () => {
    window.setTimeout(() => {
      if (cityDropdownContainer.value && !cityDropdownContainer.value.contains(document.activeElement)) {
        showCityDropdown.value = false
        cityHighlightIndex.value = -1
      }
    }, 0)
  }

  const handleStateBlur = () => {
    window.setTimeout(() => {
      if (stateDropdownContainer.value && !stateDropdownContainer.value.contains(document.activeElement)) {
        showStateDropdown.value = false
        stateHighlightIndex.value = -1
      }
    }, 0)
  }

  const handleClickOutside = (e) => {
    if (cityDropdownContainer.value && !cityDropdownContainer.value.contains(e.target)) {
      showCityDropdown.value = false
      cityHighlightIndex.value = -1
    }
    if (stateDropdownContainer.value && !stateDropdownContainer.value.contains(e.target)) {
      showStateDropdown.value = false
      stateHighlightIndex.value = -1
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  const submitNewVenue = () => {
    const payload = {
      name: new_venue.value.name,
      address: [
        new_venue.value.street, new_venue.value.city, new_venue.value.state,
        new_venue.value.zip, new_venue.value.neighborhood
      ].filter(a => a).join(', '),
      street: new_venue.value.street,
      city: new_venue.value.city,
      state: new_venue.value.state,
      zip: new_venue.value.zip,
      neighborhood: new_venue.value.neighborhood,
      g_map_link: new_venue.value.g_map_link
    }

    showVenueLoadingSpinner.value = true

    $apiService.post('/venues/', payload)
      .then((data) => {
        showVenueLoadingSpinner.value = false
        close()
        if (data.status === 'success') {
          store.dispatch(FETCH_ACTIVE_VENUES)
          emit('newVenue', data.venue)
        }
      })
      .catch(() => {
        showVenueLoadingSpinner.value = false
      })
  }

  defineExpose({
    close
  })
</script>

<style scoped>
  /* Utility class for screen readers */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Reset default fieldset styles so it doesn't break UI */
  .address-fieldset {
    border: none;
    margin: 0;
    padding: 0;
  }

  button {
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 14px;
  }

  .btn-text {
    background: none;
    border: none;
    color: #555;
    padding: 10px 20px;
    text-transform: none;
    font-size: 14px;
  }

  .btn-text:hover {
    color: black;
    text-decoration: underline;
  }

  .btn-primary {
    background-color: #1976d2;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background-color: #1565c0;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #555;
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #bbb;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 1px #1976d2;
  }

  /* Custom autocomplete styles */
  .autocomplete-container {
    position: relative;
  }

  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    background: white;
    border: 1px solid #bbb;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .autocomplete-dropdown li {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.15s;
  }

  .autocomplete-dropdown li:hover,
  .autocomplete-dropdown li.active {
    background-color: #e3f2fd;
  }

  .btn-outline {
    background-color: transparent;
    color: black;
    border: 1px solid black;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .btn-outline:hover:not(:disabled) {
    background-color: black;
    color: white;
  }

  .btn-outline:disabled {
    background-color: transparent !important;
    border: 1px solid rgba(0, 0, 0, 0.4) !important;
    color: rgba(0, 0, 0, 0.4) !important;
    cursor: not-allowed;
  }

  .loading-status {
    display: inline-flex;
    align-items: center;
    margin-left: 12px;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
  }

  .required-field {
    color: red;
    font-weight: bold;
  }
</style>
