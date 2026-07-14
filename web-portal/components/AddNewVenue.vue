<template>
  <Modal v-model="isModalOpen" title="Add a new venue:">
    <div class="form-group">
      <label for="venueName">Venue Name*</label>
      <input type="text" id="venueName" v-model="new_venue.name" required placeholder="e.g. The Grand Theater">
    </div>

    <div class="form-group">
      <label for="venueStreet">Street Address*</label>
      <input type="text" id="venueStreet" v-model="new_venue.street" required placeholder="e.g. 123 Main St">
    </div>

    <div class="form-group">
      <label for="venueCity">City*</label>
      <input type="text" id="venueCity" v-model="new_venue.city" list="city-suggestions" required placeholder="Start typing or select...">
      <datalist id="city-suggestions">
        <option v-for="city in suggestedCities" :key="city" :value="city" />
      </datalist>
    </div>

    <div class="form-group">
      <label for="venueState">State*</label>
      <input type="text" id="venueState" v-model="new_venue.state" list="state-suggestions" required placeholder="Start typing or select...">
      <datalist id="state-suggestions">
        <option v-for="state in suggestedStates" :key="state" :value="state" />
      </datalist>
    </div>

    <div class="form-group">
      <label for="venueZip">Zip Code*</label>
      <input type="text" id="venueZip" v-model="new_venue.zip" required placeholder="e.g. 40501">
    </div>

    <div class="form-group">
      <label for="venueNeighborhood">Neighborhood</label>
      <input type="text" id="venueNeighborhood" v-model="new_venue.neighborhood" placeholder="Optional">
    </div>

    <div class="form-group">
      <label for="venueMapLink">Google Maps Link</label>
      <input type="url" id="venueMapLink" v-model="new_venue.g_map_link" placeholder="https://maps.google.com/...">
    </div>

    <!-- template #footer maps to modal-footer (pins to bottom even if form scrolls) -->
    <template #footer>
      <button
        class="btn-outline"
        :disabled="!venueRequiredFields"
        @click="submitNewVenue()"
      >
        Add Venue
      </button>
      <img v-if="showVenueLoadingSpinner" class="loading-spinner" src="~/assets/images/spinner.gif" alt="Loading">
    </template>

  </Modal>
</template>

<script setup>
  import { ref, computed, defineExpose } from 'vue'
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
        // Hide spinner and close modal
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

  .loading-spinner {
    width: 30px;
    height: 30px;
  }
</style>
