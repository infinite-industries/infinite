<template>
  <v-row>
    <v-col cols="12">
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

      <!-- Show an empty form if no entries or always for multi-date events -->
      <div v-if="localEntries.length === 0 || ['gallery-show', 'multi-day-event', 'other'].includes(eventCategory)">
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
    </v-col>
  </v-row>
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
    }
  }
</script>

<style scoped>
.divider-text {
  margin: 10px 0;
  text-align: center;
}

.confirmed-entries ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}
</style>
