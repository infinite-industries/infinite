<template>
  <div>
    <v-row wrap>
        <v-col cols="12" sm="11">
          <date-time-picker
            v-if="show_datetime_picker.includes('date-time-picker')"
            :model-value="modelValue"
            :mode="mode"
            @update:model-value="emit('update:modelValue', $event)"
            @change="emit('change', $event)"
          />
        </v-col>
      </v-row>

      <!-- Venue -->
      <v-row wrap>
        <v-col cols="12" sm="3">
          <h3 class="form-label">Select a Venue<span class="required-field">*</span>:</h3>
        </v-col>
        <v-col cols="12" sm="8">
          <venue-picker
            ref="venuePicker"
            :venues="venues"
            :initial_venue_id="initial_venue_id"
            @selectVenue="emit('selectVenue', $event)"
          ></venue-picker>
        </v-col>
        <v-col cols="0" sm="3"></v-col>
        <v-col cols="12" sm="8">
          <p style="margin: 10px 0px 10px 0px; text-align: center;">OR</p>
        </v-col>
      </v-row>

      <!-- Add a Venue (collapsible content)-->
      <add-new-venue @newVenue="emit('newVenue', $event)" />
  </div>
</template>

<script setup>
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    initial_venue_id: {
      type: [String, Number, null],
      default: null,
    },
    show_datetime_picker: {
      type: Array,
      default: () => []
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

<style lang="scss" scoped>

</style>
