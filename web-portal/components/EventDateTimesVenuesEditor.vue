<template>
  <div>
    <v-row wrap>
        <v-col cols="12" sm="11">
          <v-expansion-panels multiple v-model="showDateTimePicker">
            <v-expansion-panel value="date-time-picker">
              <v-expansion-panel-text>
                <date-time-picker v-model="calendar_event.date_times" :mode="user_action" @change="onDateTimeVenueChanged" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!-- Venue -->
      <v-row wrap>
        <v-col cols="12" sm="3">
          <h3 class="form-label">Select a Venue<span class="required-field">*</span>:</h3>
        </v-col>
        <v-col cols="12" sm="8">
          <venue-picker ref="venuePicker" :venues="venues" :initial_venue_id="calendar_event.venue_id" @selectVenue="selectVenue"></venue-picker>
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

</script>

<style lang="scss" scoped>

</style>
