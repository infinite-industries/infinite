<template>
  <div id="cal-container">
    <div>
      <v-date-picker v-model="picker"
      color="gray lighten-1"
      :allowed-dates="AllowedDates"
      :no-title="true"
      :dark="true"
      />
    </div>
    <div>
        <div id="display-time-date">
          <transition name="fade">
            <p style="max-width: 700px;">
              <span class="required-field">*</span>Pick the date for your event. If it's a multi-day event, like a festival or a series of theater performances, pick the first day and you will have a chance to add more later.
            </p>
          </transition>
          <div style="min-height:100px; max-width: 700px; border: 1px solid black; padding:15px;">
            <div class="time-date-entry" v-show="picker">
              On {{picker}} from
              <span>
                <input ref="startHourInput" v-model="start_hour" type="text" min="0" max="23" placeholder="hh" class="start-hour" :class="{ 'invalid' : start_hour_invalid }" maxlength="2" />
                <span>:</span>
                <input ref="startMinInput" v-model="start_minute" type="text" min="0" max="59" placeholder="mm" class="start-minute" :class="{ 'invalid' : start_minute_invalid }" maxlength="2" />
                <select ref="startAmPm" name="start_ampm" v-model="start_ampm">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </span>
              to
              <span>
                <input ref="endHourInput" v-model="end_hour" type="text" min="0" max="23" placeholder="hh" class="end-hour" :class="{ 'invalid' : end_hour_invalid }" maxlength="2" />
                <span>:</span>
                <input ref="endMinInput" v-model="end_minute" type="text" min="0" max="59" placeholder="mm" class="end-minute" :class="{ 'invalid' : end_minute_invalid }" maxlength="2" />
                <select ref="endAmPm" name="end_ampm" v-model="end_ampm">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </span>

              <span v-if="edit_mode">
                <v-btn style="color:black" class="time-cancel" small dark outline @click="Cancel()">Cancel</v-btn>
                <v-btn style="color:black" small dark outline class="time-update" @click="UpdateTimeSegment(time_segment_index)">UPDATE</v-btn>
              </span>
              <span v-else>
                <v-btn small dark depressed color="grey" class="white--text time-cancel" @click="Cancel()">Cancel</v-btn>
                <v-btn small dark outline v-show="!validate_time" class="time-confirm" disabled>CONFIRM</v-btn>
                <!-- Ugly hack thanks to "disabled" bug in vuetify -->
                <v-btn small dark depressed color="grey" class="white--text time-confirm" @click="AddTimeSegment()" v-show="validate_time">CONFIRM</v-btn>
              </span>
            </div>
          </div>

          <div v-show="chrono_order_invalid">
            End time for the event must follow the start time. Unless you are a Time Lord, of course...
          </div>


          <div id="all-confirmed-times-dates">
            <table>
            <tr v-for="(date_and_time, index) in dates_and_times" :key="date_and_time.start_time + '/' + date_and_time.end_time">
              <td>
                <span> {{FormattedDateTime(date_and_time.start_time, date_and_time.end_time)}}</span>
              </td>
              <td>
                <v-btn style="color:black" small dark outline @click="DeleteTimeSegment(index)">Delete</v-btn>
                <v-btn style="color:black" small dark outline @click="EditTimeSegment(index)">Edit</v-btn>
              </td>
            </tr>
          </table>
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
</template>


<script>

  const moment = require('moment-timezone');

  const clientTimeZone = moment.tz.guess()

  // this is how the date/time is stored in data and sent to the server
  const dateTimeStorageFormat = 'YYYY-MM-DD HH:mm zz'

  // this format is used for parsing date/times extracted from the picker before storing them
  const dateTimePickerFormat = 'YYYY-MM-DD hh:mm:a zz'

  export default {
    name: 'date-time-picker',
    data: function(){
      return {
        introduction: true,

        picker: null,

        edit_mode: false,
        time_segment_index: 0,

        start_hour:"",
        start_minute:"",
        start_ampm:"pm",

        end_hour:"",
        end_minute:"",
        end_ampm:"pm"
      }
    },
    mounted: function(){
      // stuff
    },
    methods:{
      AllowedDates: function(val){
        if(moment(val).isSameOrAfter(moment().subtract(1,'d'))) return val
      },

      /* Converts start and end times stored in data to formatted strings for display in the ui */
      FormattedDateTime: function(start,end) {
        return moment.tz(start, dateTimeStorageFormat, clientTimeZone).format('dddd, MMMM Do, h:mma') + ' - '
          + moment.tz(end, dateTimeStorageFormat, clientTimeZone).format('h:mma')
      },

      CheckForFocusOutHour: function(type) {
        let which_hour = (type==="START") ? "start_hour" : "end_hour"
        let which_hour_invalid = (type==="START") ? "start_hour_invalid" : "end_hour_invalid"


        if (this.$data[which_hour].length >= 2) {
          if (this.$data[which_hour] >= 1 && this.$data[which_hour] <= 12) {
            return false
          } else {
            return true
          }
        }
      },
      CheckForFocusOutMin: function(type) {
        let which_minute = (type==="START") ? "start_minute" : "end_minute"
        let which_minute_invalid = (type==="START") ? "start_minute_invalid" : "end_minute_invalid"

        if (this.$data[which_minute].length >= 2) {

          if (this.$data[which_minute] >= 0 && this.$data[which_minute] <= 59) {
            return false
          } else {
            return true
          }
        }
      },

      // CreateTestCalendarEvent: function(){
      //   this.$store.dispatch('CreateNewEvent')
      // },

      EditTimeSegment: function(which_segment){
        /* this.$store.dispatch('DeleteTimeSegment', {
          index: which_segment
        }) */
        this.edit_mode = true
        this.time_segment_index = which_segment
        let time_segment = this.$store.getters.GetAllDateTimes[which_segment]
        // console.log(time_segment);
        this.picker = moment(time_segment.start_time).format("YYYY-MM-DD")
        this.start_hour = moment(time_segment.start_time).format("hh")
        this.start_minute = moment(time_segment.start_time).format("mm")
        this.start_ampm = moment(time_segment.start_time).format("a")

        this.end_hour = moment(time_segment.end_time).format("hh")
        this.end_minute = moment(time_segment.end_time).format("mm")
        this.end_ampm = moment(time_segment.end_time).format("a")
      },
      DeleteTimeSegment: function(which_segment){
        this.$store.dispatch('DeleteTimeSegment', {
          index: which_segment
        })
      },
      AddTimeSegment: function(){
        this.$store.dispatch('AddNewTimeSegment')
        this.time_segment_index = this.$store.getters.GetAllDateTimes.length - 1
        if(this.UpdateTimeSegment(this.time_segment_index)) {
          this.time_segment_index++
        }

      },
      UpdateTimeSegment: function(which_segment){
        let formated_start_time = this.check_start_time
        let formated_end_time = this.check_end_time

          this.$store.dispatch('UpdateCurrentTimeSegment', {
            current_time_segment: which_segment,
            optional_title: '',   // add later afer consulting with users
            start_time: moment.tz(formated_start_time, clientTimeZone).format(dateTimeStorageFormat),
            end_time: moment.tz(formated_end_time, clientTimeZone).format(dateTimeStorageFormat)
          })

          this.picker = null
          this.introduction = false
          this.edit_mode = false   //if edit mode is active turn it off
          return true
        //}

      },

      Cancel: function(){
        this.picker = null
      }

    },
    computed:{
      start_hour_invalid: function(){
        return this.CheckForFocusOutHour('START')
      },
      start_minute_invalid: function(){
        return this.CheckForFocusOutMin('START')
      },
      end_hour_invalid: function(){
        return this.CheckForFocusOutHour('END')
      },
      end_minute_invalid: function(){
        return this.CheckForFocusOutMin('END')
      },
      chrono_order_invalid: function(){

        if((this.check_start_time._isValid)&&(this.check_end_time._isValid)){
          if((this.start_hour!=="")&&(this.end_hour!=="")){
            if(this.check_start_time.isAfter(this.check_end_time)){
              return true
              // TODO deal with the case when hours are the same and minutes are being entered
            }
            else{
              return false
            }
          }
          else{
            return false
          }
        }
        else{
          return false
        }
      },
      dates_and_times: function(){
        return this.$store.getters.GetAllDateTimes
      },
      check_start_time: function(){
        return moment.tz(`${this.picker} ${this.start_hour}:${this.start_minute}:${this.start_ampm}`,
          dateTimePickerFormat, clientTimeZone)
      },
      check_end_time: function(){
        let temp_date_time = moment(`${this.picker} ${this.end_hour}:${this.end_minute}:${this.end_ampm}`,
          dateTimePickerFormat, clientTimeZone)

        if((this.start_ampm === "pm")&&(this.end_ampm === "am")){
          return moment(temp_date_time).add(1, 'd')
        }
        else{
          return temp_date_time
        }
      },
      validate_time: function() {

        // if(this.start_hour!==''){
        //   console.log("start: ", this.start_hour);
        // }

        if(!this.chrono_order_invalid){
          if((this.start_hour!=="")&&(this.end_hour!=="")){
            return true
          }
          else{
            return false
          }
        }
        else {
          return false
        }
      }
    }
  }
</script>

<style scoped>
  #cal-container {
    display: flex;
    flex-wrap: wrap;

    background-color: white;
    padding: 10px;
    font-family: 'Open Sans', sans-serif;
  }

  #display-time-date {
    padding: 15px;
  }

  .time-date-entry {
    min-height: 50px;
  }

  .label {
    color: rgb(154, 154, 154);
  }

  /* div {
    display: inline-block;
  } */
  input {
    padding: 2px;
    outline: 1px solid rgb(187, 187, 187);
    border-radius: 3px;
    width: 45px;
  }
  .invalid {
    outline: 1px solid red;
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
