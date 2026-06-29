<template>
  <div>
    <v-row wrap>
        <v-col cols="12" sm="11">
          <date-time-picker
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
          <venue-picker ref="venuePicker" :venues="venues" :initial_venue_id="initial_venue_id" @selectVenue="selectVenue"></venue-picker>
        </v-col>
        <v-col cols="0" sm="3"></v-col>
        <v-col cols="12" sm="8">
          <p style="margin: 10px 0px 10px 0px; text-align: center;">OR</p>
        </v-col>
      </v-row>

      <!-- Add a Venue (collapsible content)-->
      <add-new-venue @newVenue="newVenue" />
  </div>
</template>

<script setup>
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    initial_venue_id: {
      type: String,
      required: true,
    },
    show_datetime_picker: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: 'upload'
    }
  })

  const emit = defineEmits(['update:modelValue', 'change'])

</script>

<style lang="scss" scoped>

</style>
