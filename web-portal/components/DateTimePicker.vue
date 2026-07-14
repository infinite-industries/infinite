<template>
  <div id="cal-container">
    <div class="time-date-input-box">
      <div class="time-date-entry">
        On <button class="link-button" @click="toggleCalendarModal()">{{ picker }}</button> from
        <time-picker
          v-model:hour="start_hour"
          v-model:minute="start_minute"
          v-model:ampm="start_ampm"
          :invalidHour="start_hour_invalid"
          :invalidMinute="start_minute_invalid"
          hour-ref="startHourInput"
          min-ref="startMinInput"
          ampm-ref="startAmPm"
        />
        to
        <time-picker
          v-model:hour="end_hour"
          v-model:minute="end_minute"
          v-model:ampm="end_ampm"
          :invalidHour="end_hour_invalid"
          :invalidMinute="end_minute_invalid"
          hour-ref="endHourInput"
          min-ref="endMinInput"
          ampm-ref="endAmPm"
        />
        <select ref="eventTimezone" name="event_timezone" v-model="event_timezone">
          <option v-for="(tz) in $config.public.timezoneOptions.split(',')" :key="tz">
            {{ tz }}
          </option>
        </select>
        <div v-if="show_calendar_modal" :key="picker || 'empty'">
          <date-picker :allow-past="allowPast" :date="picker" @change="dateChanged" />
        </div>

        <div v-if="chrono_order_invalid" class="error--text">
          End time for the event must follow the start time. Unless you are a Time Lord, of course...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import momenttz from 'moment-timezone'
  import DatePicker from '@/components/DatePicker.vue'
  import TimePicker from '@/components/TimePicker.vue'

  // this is how the date/time is stored in data and sent to the server
  const dateTimeStorageFormat = momenttz.ISO_8601

  // this format is used for parsing date/times extracted from the picker before storing them
  const dateTimePickerFormat = 'YYYY-MM-DD hh:mm:a zz'

  export default {
    name: 'DateTimePicker',
    props: {
      mode: {
        type: String,
        default: 'upload',
        validator: value => value === 'upload' || value === 'edit'
      },
      modelValue: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ['update:modelValue'],
    data: function () {
      return {
        introduction: true,
        picker: null,
        edit_mode: false,
        time_segment_index: 0,
        start_hour: '',
        start_minute: '',
        start_ampm: 'pm',
        end_hour: '',
        end_minute: '',
        end_ampm: 'pm',
        event_timezone: this.$config.public.timezoneDefault,
        show_calendar_modal: false,
        multi_day: false
      }
    },
    mounted: function () {
      this.setDefaultDateAndTimes();
    },
    methods: {
      setDefaultDateAndTimes: function () {
        const tz = this.event_timezone || this.$config.public.timezoneDefault;
        const currentTime = momenttz.tz(tz);
        const roundedMinutes = Math.round(currentTime.minutes() / 15) * 15;
        const startTime = currentTime.clone().minute(roundedMinutes).second(0);
        const endTime = startTime.clone().add(1, 'hour');

        this.picker = currentTime.format('YYYY-MM-DD');
        this.start_hour = startTime.format('hh');
        this.start_minute = startTime.format('mm');
        this.start_ampm = startTime.format('a');
        this.end_hour = endTime.format('hh');
        this.end_minute = endTime.format('mm');
        this.end_ampm = endTime.format('a');
      },

      dateChanged: function(newDate) {
        this.picker = newDate;
        // Let date-picker finish whatever it's doing before we hide it
        this.$nextTick(() => {
          this.show_calendar_modal = false;
        });
      },

      AllowedDates: function (val) {
        // in edit mode, anything goes
        // otherwise, disallow days in the past
        return this.mode === 'edit' || momenttz(val).isSameOrAfter(momenttz().subtract(1, 'd'))
      },

      /* Converts start and end times stored in data to formatted strings for display in the ui */
      FormattedDateTime: function (start, end, timezone) {
        return momenttz.tz(start, dateTimeStorageFormat, timezone).format('dddd, MMMM Do, h:mma') + ' - ' +
          momenttz.tz(end, dateTimeStorageFormat, timezone).format('h:mma') + ' ' + timezone
      },

      CheckForFocusOutHour: function (type) {
        const which_hour = (type === 'START') ? 'start_hour' : 'end_hour'

        if (this.$data[which_hour].length >= 2) {
          if (this.$data[which_hour] >= 1 && this.$data[which_hour] <= 12) {
            return false
          } else {
            return true
          }
        }
      },

      CheckForFocusOutMin: function (type) {
        const which_minute = (type === 'START') ? 'start_minute' : 'end_minute'

        if (this.$data[which_minute].length >= 2) {
          if (this.$data[which_minute] >= 0 && this.$data[which_minute] <= 59) {
            return false
          } else {
            return true
          }
        }
      },

      setSelection: function (entry) {
        if (!entry) {
          this.resetSelection()
          return
        }

        this.event_timezone = entry.timezone || this.$config.public.timezoneDefault

        const start_time = momenttz(entry.start_time).tz(this.event_timezone)
        this.picker = start_time.format('YYYY-MM-DD')
        this.start_hour = start_time.format('hh')
        this.start_minute = start_time.format('mm')
        this.start_ampm = start_time.format('a')

        const end_time = momenttz(entry.end_time).tz(this.event_timezone)
        this.end_hour = end_time.format('hh')
        this.end_minute = end_time.format('mm')
        this.end_ampm = end_time.format('a')
      },

      getCurrentSelection: function () {
        if (!this.picker || !this.start_hour || !this.end_hour) {
          return null
        }

        return {
          start_time: this.check_start_time.toISOString(),
          end_time: this.check_end_time.toISOString(),
          timezone: this.event_timezone
        }
      },

      isSelectionValid: function () {
        return this.validate_time
      },

      resetSelection: function () {
        this.picker = null
        this.introduction = false
        this.edit_mode = false
        this.show_calendar_modal = false
        this.clearTimePickers()
        this.setDefaultDateAndTimes()
      },

      reset: function () {
        this.resetSelection()
      },

      clearTimePickers: function () {
        this.start_hour = ''
        this.start_minute = ''
        this.start_ampm = 'pm'
        this.end_hour = ''
        this.end_minute = ''
        this.end_ampm = 'pm'
      },

      toggleCalendarModal: function () {
        this.show_calendar_modal = !this.show_calendar_modal
      }

    },
    computed: {
      allowPast: function() {
        return this.mode === 'edit'
      },
      start_hour_invalid: function () {
        return this.CheckForFocusOutHour('START')
      },
      start_minute_invalid: function () {
        return this.CheckForFocusOutMin('START')
      },
      end_hour_invalid: function () {
        return this.CheckForFocusOutHour('END')
      },
      end_minute_invalid: function () {
        return this.CheckForFocusOutMin('END')
      },
      chrono_order_invalid: function () {
        if ((this.check_start_time._isValid) && (this.check_end_time._isValid)) {
          if ((this.start_hour !== '') && (this.end_hour !== '')) {
            if (this.check_start_time.isSameOrAfter(this.check_end_time)) {
              return true
            // TODO deal with the case when hours are the same and minutes are being entered
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      dates_and_times: function () {
        return this.modelValue
      },
      check_start_time: function () {
        return momenttz.tz(`${this.picker} ${this.start_hour}:${this.start_minute}:${this.start_ampm}`,
                           dateTimePickerFormat, this.event_timezone)
      },
      check_end_time: function () {
        const temp_date_time = momenttz.tz(`${this.picker} ${this.end_hour}:${this.end_minute}:${this.end_ampm}`,
                                           dateTimePickerFormat, this.event_timezone)

        // if start is PM and end is AM, event crosses into the next day
        // move end time to the next day
        // TODO: this doesn't handle all cases where start > end, particularly
        // when you want to do e.g. 10AM - 2AM (next day)
        // TRY (copied from dead code in SubmissionForm):
        // if (moment(eventDate.time_end).isBefore(moment(eventDate.time_start))) {
        //   eventDate.time_end = moment(eventDate.time_end).add(1, 'd').format('YYYY-MM-DD HH:mm:ss')
        // }
        if ((this.start_ampm === 'pm') && (this.end_ampm === 'am')) {
          return momenttz(temp_date_time).add(1, 'd')
        } else {
          return temp_date_time
        }
      },
      validate_time: function () {
        if (!this.chrono_order_invalid) {
          if ((this.start_hour !== '') && (this.end_hour !== '')) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    components: {
      'date-picker': DatePicker,
      'time-picker': TimePicker
    }
  }
</script>

<style scoped>
  #cal-container {
    background-color: white;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
    width: 100%;
    box-sizing: border-box;
  }

  @media screen and (min-width: 875px) {
    #cal-container {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 15px;
    }
  }

  .time-date-input-box {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .time-date-entry {
    flex: 1 1 320px;
    max-width: 720px;
    min-width: 0;
    min-height: 50px;
  }

  .date-time-picker-actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 10px;
    flex-shrink: 0;
    width: calc(100% / 6);
    min-width: 110px;
    max-width: 160px;
  }

  .date-time-picker-actions > * {
    width: 100%;
  }

  /* This overrides some Vuetify reset styling so that the meridiem selects */
  /* are easier to identify as interactive form controls. */
  .time-date-entry select {
    appearance: auto;
    -moz-appearance: auto;
    -webkit-appearance: auto;
  }

  /* This used to be exposed by Vuetify, not as of v3. */
  .error--text {
    color: #dd2c00 !important;
  }

  #all-confirmed-times-dates {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  #all-confirmed-times-dates ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  #all-confirmed-times-dates ul li:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .time-list-item {
    background-color: #f2f2f2;
  }

  @media only screen and (min-width: 850px) {
    .time-list-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
    }

    .time-list-item > :first-child {
      padding: 0 0.5rem;
    }
  }

  .link-button {
  /* Remove default browser button styling */
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit; /* Inherits font-family, size, and weight from parent */

  /* Apply link styling */
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer; /* Changes pointer to the hand icon on hover */
}
 .link-button:hover,
 .link-button:focus {
  color: #004499;
  text-decoration: none; /* Removes underline on hover */
}

</style>
