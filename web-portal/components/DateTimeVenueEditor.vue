<template>
  <div v-if="isEditing" class="editable-form">
    <!-- Editable Date/Venue Form -->
    <h4>Select your date:<span class="required-field">*</span></h4>
    <date-time-picker
      ref="dateTimePicker"
      :model-value="modelValue"
      :mode="mode"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
    />
    <h4>Select your venue:<span class="required-field">*</span></h4>
    <venue-picker
      ref="venuePicker"
      :venues="venues"
      :initial_venue_id="selectedVenueId"
      @select-venue="handleVenueSelection"
      @new-venue="handleNewVenue"
    />
    <div class="date-time-venue-actions">
      <button
        type="button"
        class="confirm-entry-button"
        data-testid="confirm-entry"
        :disabled="!canConfirmEntry"
        @click="confirmEntry"
      >
        {{ isExistingEntry ? 'Update' : 'Add Date' }}
      </button>
      <button
        v-if="isExistingEntry"
        type="button"
        class="cancel-entry-button"
        @click="cancelEdit"
      >
        Cancel
      </button>
    </div>
  </div>

  <div v-else class="confirmed-entry">
    <div class="confirmed-entry-summary">
      <button type="button" class="edit-entry-button" @click="editEntry">
        <Edit id="edit-icon" width="20" height="20" />
      </button>
      <div class="summary-text">
        <!-- Use modelValue directly instead of entry -->
        <span>{{ formatEntry(modelValue) }}</span>
        <span v-if="getVenueName(modelValue.venue_id)">at {{ getVenueName(modelValue.venue_id) }}</span>
      </div>
    </div>
    <div class="confirmed-entry-actions">
      <button type="button" class="delete-entry-button" @click="deleteEntry">&times;</button>
    </div>
  </div>
</template>

<script setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import Edit from './vectors/Edit.vue'
  import DateTimePicker from '@/components/DateTimePicker.vue'
  import VenuePicker from '@/components/VenuePicker.vue'

  const props = defineProps({
    editMode: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: () => ({})
    },
    initialVenueId: {
      type: [String, Number],
      default: null
    },
    mode: {
      type: String,
      default: 'upload'
    },
    venues: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['update:modelValue', 'change', 'selectVenue', 'newVenue', 'delete'])

  const dateTimePicker = ref(null)
  const selectedVenueId = ref(props.modelValue?.venue_id ?? props.initialVenueId)

  const isEditing = ref(props.editMode)

  const isExistingEntry = computed(() => {
    return Boolean(props.modelValue?.start_time && props.modelValue?.end_time)
  })

  watch(isEditing, (editing) => {
    if (editing && isExistingEntry.value) {
      selectedVenueId.value = props.modelValue.venue_id ?? props.initialVenueId
      nextTick(() => {
        dateTimePicker.value?.setSelection?.(props.modelValue)
      })
    }
  })

  const canConfirmEntry = computed(() => {
    if (!dateTimePicker.value?.isSelectionValid?.()) return false
    const selection = dateTimePicker.value?.getCurrentSelection?.()
    return Boolean(selection?.start_time && selection?.end_time && selectedVenueId.value)
  })

  const getVenueName = (venueId) => {
    const venue = props.venues.find((candidate) => candidate.id === venueId)
    return venue?.name || ''
  }

  const formatEntry = (entry) => {
    if (!entry?.start_time || !entry?.end_time) return '';

    const start = new Date(entry.start_time);
    const end = new Date(entry.end_time);

    const dateFmt = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    const timeFmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const formatTime = (date) => timeFmt.format(date).toLowerCase().replace(' ', '');

    const startDay = dateFmt.format(start);
    const endDay = dateFmt.format(end);
    const startTimeStr = formatTime(start);
    const endTimeStr = formatTime(end);

    if (startDay !== endDay) {
      return `${startDay} • ${startTimeStr} - ${endDay} • ${endTimeStr}`;
    }

    return `${startDay} • ${startTimeStr} - ${endTimeStr}`;
  };

  const resetDraft = () => {
    if (!props.editMode) {
      isEditing.value = false
    }

    selectedVenueId.value = props.initialVenueId
    dateTimePicker.value?.reset?.()
  }

  const confirmEntry = () => {
    const selection = dateTimePicker.value?.getCurrentSelection?.()

    if (!selection?.start_time || !selection?.end_time || !selectedVenueId.value || !dateTimePicker.value?.isSelectionValid?.()) {
      return
    }

    const confirmedEntry = {
      optional_title: '',
      ...selection,
      venue_id: selectedVenueId.value
    }

    emit('update:modelValue', confirmedEntry)
    emit('change', confirmedEntry)
    resetDraft()
  }

  const editEntry = () => {
    isEditing.value = true
  }

  const deleteEntry = () => {
    // Let the parent handle removing this specific object from its array
    emit('delete')
  }

  const cancelEdit = () => {
    resetDraft()
  }

  const handleVenueSelection = (venue) => {
    selectedVenueId.value = venue?.id
    emit('selectVenue', venue)
  }

  const handleNewVenue = (venue) => {
    selectedVenueId.value = venue?.id
    emit('newVenue', venue)
  }
</script>

<style scoped>
/* Styles remain exactly the same */
.editable-form {
  border: 1px solid black;
  padding: 10px;
}

.required-field {
  color: red;
  font-weight: bold;
}

.date-time-venue-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
}

.confirmed-entry {
  align-items: center;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
}

.confirmed-entry-summary {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
}

.summary-text {
  display: flex;
  flex-direction: column;
}

.confirmed-entry-actions {
  display: flex;
  gap: 0.5rem;
}

button {
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  text-transform: uppercase;
  font-size: 14px;
}

button.confirm-entry-button {
  background-color: #4CAF50;
  color: white;
}

button.confirm-entry-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button.edit-entry-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

button.edit-entry-button:hover {
  transform: scale(1.15);
}

button.delete-entry-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #dc3545;
  font-size: 20px;
  line-height: 1;
  transition: color 0.2s ease, transform 0.2s ease;
}

button.delete-entry-button:hover {
  color: #bd2130;
  transform: scale(1.15);
}
</style>
