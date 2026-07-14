<template>
  <div class="datetime-venue-list">
    <!-- Confirmed DatetimeVenues -->
    <div v-if="localEntries.length > 0" class="confirmed-entries">
      <h4>When and Where:</h4>
        <date-time-venue-editor
          v-for="(entry, index) in localEntries"
          :key="entry.id || index"
          v-model="localEntries[index]"
          :venues="venues"
          :mode="mode"
          @delete="localEntries.splice(index, 1)"
          @select-venue="venue => emit('selectVenue', venue)"
          @new-venue="venue => emit('newVenue', venue)"
        />
    </div>

    <!-- Show empty form directly if no entries exist yet -->
    <div v-if="localEntries.length === 0">
      <date-time-venue-editor
        :edit-mode="true"
        v-model="newEntryDraft"
        :venues="venues"
        :mode="mode"
        :initial-venue-id="initialVenueId"
        @change="handleNewEntryAdded"
        @select-venue="venue => emit('selectVenue', venue)"
        @new-venue="venue => emit('newVenue', venue)"
      />
    </div>

    <!-- For multi-date events with existing entries, show Add Date button -->
    <div v-else-if="['gallery-show', 'multi-day-event', 'other'].includes(eventCategory)">
      <div v-if="!showAddForm" style="text-align: center;">
        <button
          @click="showAddForm = true"
          class="add-date-btn"
        >
          <span class="add-icon" aria-hidden="true">+</span>
          Add Date
        </button>
      </div>
      <div v-else>
        <date-time-venue-editor
          edit-mode="true"
          v-model="newEntryDraft"
          :venues="venues"
          :mode="mode"
          :initial-venue-id="initialVenueId"
          @change="handleNewEntryAdded"
          @select-venue="venue => emit('selectVenue', venue)"
          @new-venue="venue => emit('newVenue', venue)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import DateTimeVenueEditor from './DateTimeVenueEditor.vue'

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    initialVenueId: {
      type: [String, Number],
      default: null,
    },
    eventCategory: {
      type: String,
      default: '',
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

  const emit = defineEmits(['update:modelValue', 'change', 'selectVenue', 'newVenue'])

  const localEntries = ref(props.modelValue)
  const newEntryDraft = ref({})
  const showAddForm = ref(false)

  // Whenever date-time-venue-editor updates or deletes one,
  // update the array and emit it up to the form.
  watch(localEntries, (newVal) => {
    emit('update:modelValue', newVal)
    emit('change', newVal)
  }, { deep: true })

  const handleNewEntryAdded = (newEntry) => {
    if (newEntry.start_time && newEntry.end_time) {
      localEntries.value.push({ ...newEntry })
      newEntryDraft.value = {}
      showAddForm.value = false
    }
  }
</script>

<style scoped>
.datetime-venue-list {
  width: 100%;
}

.confirmed-entries ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}

button {
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 14px;
}

.add-date-btn {
  display: inline-flex;
  align-items: center;
  border: 1px solid #1976d2;
  background: transparent;
  color: #1976d2;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s, color 0.2s;
}

.add-date-btn:hover {
  background-color: #1976d2;
  color: white;
}

.add-icon {
  font-size: 1.125rem;
  line-height: 1;
}


</style>
