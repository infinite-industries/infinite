<template>
  <!-- Don't show at all if this is an online resource -->
  <div
   v-if="eventCategory && eventCategory !== 'online-resource'"
  >
    <v-row style="border: 1px solid red">
      <v-col cols="12" sm="11">
        <!-- Single Day -->
        <div
          v-if="['single-day-event', 'call-for-entry'].includes(eventCategory)"
        >
          <h1 style="color: red">Single Day Event</h1>
          <date-time-picker
            v-if="show_datetime_picker.includes('date-time-picker')"
            :model-value="modelValue"
            :mode="mode"
            @update:model-value="emit('update:modelValue', $event)"
            @change="emit('change', $event)"
          />
        </div>

        <!-- Multi-day -->
        <div
         v-if="['gallery-show', 'multi-day-event', 'other'].includes(eventCategory)"
         style="border: 1px solid blue"
         >
          <h1 style="color: blue">Multi-day Event</h1>
          <date-time-picker
            v-if="show_datetime_picker.includes('date-time-picker')"
            :model-value="modelValue"
            :mode="mode"
            @update:model-value="emit('update:modelValue', $event)"
            @change="emit('change', $event)"
          />
        </div>
      </v-col>
    </v-row>

    <venue-picker
      ref="venuePicker"
      :venues="venues"
      :initial_venue_id="initial_venue_id"
      @select-venue="emit('selectVenue', $event)"
      @new-venue="emit('newVenue', $event)"
    />
  </div>
</template>

<script setup>
  defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    initial_venue_id: {
      type: [String, Number],
      default: null,
    },
    show_datetime_picker: {
      type: Array,
      default: () => []
    },
    eventCategory: {
      type: String,
      default: null,
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
</script>

<style scoped>
.divider-text {
  margin: 10px 0;
  text-align: center;
}
</style>
