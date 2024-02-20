<template>
  <div id="cal-container">
    <div class="instructions">
      <transition name="fade">
        <p>
          <span class="required-field">*</span>Pick the date for your event. If it's a multi-day event, like a festival or a series of theater performances, pick the first day and you will have a chance to add more later.
        </p>
      </transition>
    </div>
    <div class="time-date-control-wrapper">
      <div>
        <date-picker @change="dateChanged" />
      </div>
      <div>
        <div id="display-time-date">
          <div class="time-date-input-box">
            <!-- hide the box until a date is selected -->
            <div class="time-date-entry" v-show="picker">
              On {{ picker }} from
              <span>
                <input
                  ref="startHourInput"
                  v-model="start_hour"
                  type="text"
                  min="0"
                  max="23"
                  placeholder="hh"
                  class="start-hour"
                  :class="{ 'invalid' : start_hour_invalid }"
                  maxlength="2"
                />
                <span>:</span>
                <input
                  ref="startMinInput"
                  v-model="start_minute"
                  type="text"
                  min="0"
                  max="59"
                  placeholder="mm"
                  class="start-minute"
                  :class="{ 'invalid' : start_minute_invalid }"
                  maxlength="2"
                />
                <select ref="startAmPm" name="start_ampm" v-model="start_ampm">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </span>
              to
              <span>
                <input
                  ref="endHourInput"
                  v-model="end_hour"
                  type="text"
                  min="0"
                  max="23"
                  placeholder="hh"
                  class="end-hour"
                  :class="{ 'invalid' : end_hour_invalid }"
                  maxlength="2"
                />
                <span>:</span>
                <input
                  ref="endMinInput"
                  v-model="end_minute"
                  type="text"
                  min="0"
                  max="59"
                  placeholder="mm"
                  class="end-minute"
                  :class="{ 'invalid' : end_minute_invalid }"
                  maxlength="2"
                />
                <select ref="endAmPm" name="end_ampm" v-model="end_ampm">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
                <select ref="eventTimezone" name="event_timezone" v-model="event_timezone">
                  <option v-for="(tz) in $config.TIMEZONE_OPTIONS.split(',')" :key="tz">
                    {{ tz }}
                  </option>
                </select>
              </span>

              <div v-if="edit_mode">
                <v-btn
                  class="time-cancel"
                  small
                  dark
                  depressed
                  color="grey"
                  @click="Cancel()"
                >Cancel</v-btn>
                <v-btn
                  small
                  dark
                  depressed
                  color="green"
                  class="time-update"
                  @click="UpdateTimeSegment(time_segment_index)"
                >UPDATE</v-btn>
              </div>
              <div v-else>
                <v-btn
                  small
                  dark
                  depressed
                  color="grey"
                  class="white--text time-cancel"
                  @click="Cancel()"
                >Cancel</v-btn>
                <v-btn
                  small
                  dark
                  outline
                  color="green"
                  v-show="!validate_time"
                  class="time-confirm"
                  disabled
                >CONFIRM</v-btn>
                <!-- Ugly hack thanks to "disabled" bug in vuetify -->
                <v-btn
                  small
                  dark
                  depressed
                  color="green"
                  class="white--text time-confirm"
                  @click="AddTimeSegment()"
                  v-show="validate_time"
                >CONFIRM</v-btn>
              </div>
              <div v-if="chrono_order_invalid" class="error--text">
                End time for the event must follow the start time. Unless you are a Time Lord, of course...
              </div>
            </div>
          </div>

          <div id="all-confirmed-times-dates">
            <ul>
              <li v-for="(date_and_time, index) in dates_and_times" :key="date_and_time.start_time + '/' + date_and_time.end_time">
                <div class="time-list-item">
                  <div>{{ FormattedDateTime(date_and_time.start_time, date_and_time.end_time, date_and_time.timezone) }}</div>
                  <div>
                    <v-btn dark depressed color="green" @click="EditTimeSegment(index)">Edit</v-btn>
                    <v-btn dark depressed color="red" @click="DeleteTimeSegment(index)">Delete</v-btn>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div v-show="!picker&&!introduction">
            If you need additional dates, please select them now.
          </div>
          <!-- <div v-show="!picker&&!introduction">
              It's lonely here.
            </div> -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import momenttz from 'moment-timezone'
  import DatePicker from '@/components/DatePicker.vue'

  // this is how the date/time is stored in data and sent to the server
  const dateTimeStorageFormat = momenttz.ISO_8601

  // this format is used for parsing date/times extracted from the picker before storing them
  const dateTimePickerFormat = 'YYYY-MM-DD hh:mm:a zz'

  const createTimeSegment = (formatted_start_time, formatted_end_time, event_timezone) => {
    return {
      optional_title: '', // add later afer consulting with users
      start_time: formatted_start_time.toISOString(),
      end_time: formatted_end_time.toISOString(),
      timezone: event_timezone
    }
  }

  export default {
    name: 'DateTimePicker',
    props: {
      mode: {
        type: String,
        default: 'upload',
        validator: value => value === 'upload' || value === 'edit'
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
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

        event_timezone: this.$config.TIMEZONE_DEFAULT
      }
    },
    mounted: function () {
    // stuff
    },
    methods: {
      dateChanged: function(date) {
        console.log('!!! dateChanged: ' + date)
        this.picker = date
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

      EditTimeSegment: function (which_segment) {
        this.edit_mode = true
        this.time_segment_index = which_segment
        const time_segment = this.value[which_segment]
        this.event_timezone = time_segment.timezone

        const start_time = momenttz(time_segment.start_time).tz(this.event_timezone)
        this.picker = start_time.format('YYYY-MM-DD')
        this.start_hour = start_time.format('hh')
        this.start_minute = start_time.format('mm')
        this.start_ampm = start_time.format('a')

        const end_time = momenttz(time_segment.end_time).tz(this.event_timezone)
        this.end_hour = end_time.format('hh')
        this.end_minute = end_time.format('mm')
        this.end_ampm = end_time.format('a')
      },
      DeleteTimeSegment: function (which_segment) {
        const newValue = [ ...this.value ]
        newValue.splice(which_segment, 1)
        this.$emit('change', newValue)
      },
      AddTimeSegment: function () {
        const newValue = [ ...this.value ]
        newValue.push(createTimeSegment(this.check_start_time, this.check_end_time, this.event_timezone))
        this.time_segment_index = newValue.length
        this.$emit('change', newValue)

        this.picker = null
        this.introduction = false
        this.edit_mode = false // if edit mode is active turn it off
      },
      UpdateTimeSegment: function (which_segment) {
        const formatted_start_time = this.check_start_time
        const formatted_end_time = this.check_end_time
        const event_timezone = this.event_timezone

        const newValue = [ ...this.value ]
        newValue[which_segment] = createTimeSegment(formatted_start_time, formatted_end_time, event_timezone)
        this.$emit('change', newValue)

        this.picker = null
        this.introduction = false
        this.edit_mode = false // if edit mode is active turn it off
        return true
      // }
      },

      Cancel: function () {
        this.picker = null
      }

    },
    computed: {
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
        return this.value
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
      'date-picker': DatePicker
    }
  }
</script>

<style scoped>
  #cal-container {
    background-color: white;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
  }

  #cal-container .time-date-control-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  @media screen and (min-width: 875px) {
    #cal-container .time-date-control-wrapper {
      flex-direction: row;
      gap: 15px;
    }
  }

  #cal-container > .time-date-control-wrapper > :first-child {
    flex-shrink: 0;
    /* margin: auto; */
  }

  #cal-container > .time-date-control-wrapper > :last-child {
    flex-grow: 1;
  }

  #display-time-date {
    /* this used to require padding; now it's gap w/ parent flex container */
  }

  .time-date-input-box {
    min-height:100px;
    padding:15px;
    border: 1px solid black;
  }

  .time-date-entry {
    min-height: 50px;
  }

  /* this overrides some Vuetify reset styling so that the meridiem selects */
  /* are easier to identify as interactive form controls */
  .time-date-entry select {
    -moz-appearance: auto;
    -webkit-appearance: auto;
  }

  .label {
    color: rgb(154, 154, 154);
  }

  input {
    padding: 2px;
    outline: 1px solid rgb(187, 187, 187);
    border-radius: 3px;
    width: 45px;
  }
  .invalid {
    outline: 1px solid red;
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

  /* --------------- transitions --------------- */
  .fade-enter-active, .fade-leave-active {
    transition: all 1.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateY(-20px);
    opacity: 0;
  }

  .required-field {
    color: red;
    font-weight: bold;
  }

</style>
