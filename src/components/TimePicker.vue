<template>
  <div>
    <span class="label">{{ label }}</span>
    <input ref="hourInput" v-model="time.hour" type="number" min="0" max="23" placeholder="hh" @keyup="checkForFocusOutHour" :class="{ 'invalid' : this.invalid_hour }" @input="recomputeFormatted"></input>
    <span>:</span>
    <input ref="minInput" v-model="time.minute" type="number" min="0" max="59" placeholder="mm" @keyup="checkForFocusOutMin" :class="{ 'invalid' : this.invalid_min }" @input="recomputeFormatted"></input>
    <select ref="ampm" name="ampm" v-model="time.ampm" @input="recomputeFormatted">
      <option value="am">AM</option>
      <option value="pm">PM</option>
    </select>
  </div>
</template>
<script>

import moment from 'moment'

export default {
  props: {
    label: String,
    date: String,
  },
  data: function() {
    return {
      time: {
        hour: "",
        minute: "",
        ampm: "am"
      },
      invalid_hour: false,
      invalid_min: false
    }
  },
  methods: {
    checkForFocusOutHour: function(e) {
      this.invalid_hour = false;
      if (this.time.hour.length >= 2) {
        if (this.time.hour >= 0 && this.time.hour <= 12) {
          this.$refs.minInput.focus();
        } else {
          this.invalid_hour = true;
        }
      }
    },
    checkForFocusOutMin: function(e) {
      this.invalid_min = false;
      if (this.time.minute.length >= 2) {
        if (this.time.minute >= 0 && this.time.minute <= 59) {
          this.$refs.ampm.focus();
        } else {
          this.invalid_min = true;
        }
      }
    },
    recomputeFormatted: function() {
      var formatted = moment(`${this.date} ${this.time.hour}:${this.time.minute}:${this.time.ampm}`, `YYYY-MM-DD hh:mm:a`);
      var formattedString = formatted.format('YYYY-MM-DD HH:mm:ss');
      this.$emit('changeTime', formattedString);
    }
  },
  computed: {
    // formatTime: function() {
    //   var formatted = moment(`${this.date} ${this.time.hour}:${this.time.minute}:${this.time.ampm}`, `YYYY-MM-DD hh:mm:a`);
    //   this.$emit('changeTime', formatted);
    //   return formatted;
    // }
  }
}
</script>
<style scoped>
.label {
  color: rgb(154, 154, 154);
}
div {
  display: inline-block;
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
</style>
