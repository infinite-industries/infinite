<template>
  <div>
    <span class="label">{{ label }}</span>
    <input ref="hourInput" v-model="hour" type="text" min="0" max="23" placeholder="hh" @keyup="checkForFocusOutHour" :class="{ 'invalid' : this.invalid_hour }" maxlength="2"></input>
    <span>:</span>
    <input ref="minInput" v-model="minute" type="text" min="0" max="59" placeholder="mm" @keyup="checkForFocusOutMin" :class="{ 'invalid' : this.invalid_min }" maxlength="2"></input>
    <select ref="ampm" name="ampm" v-model="ampm">
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
      hour: "",
      minute: "",
      ampm: "am",
      invalid_hour: false,
      invalid_min: false
    }
  },
  methods: {
    checkForFocusOutHour: function(e) {
      this.invalid_hour = false;
      if (this.hour.length >= 2) {
        if (this.hour >= 1 && this.hour <= 12) {
          this.$refs.minInput.focus();
        } else {
          this.invalid_hour = true;
        }
      }
    },
    checkForFocusOutMin: function(e) {
      this.invalid_min = false;
      if (this.minute.length >= 2) {
        if (this.minute >= 0 && this.minute <= 59) {
          this.$refs.ampm.focus();
        } else {
          this.invalid_min = true;
        }
      }
    },
    recomputeFormatted: function() {
      var formatted = moment(`${this.date} ${this.hour}:${this.minute}:${this.ampm}`, `YYYY-MM-DD hh:mm:a`);
      var formattedString = formatted.format('YYYY-MM-DD HH:mm:ss');
      this.$emit('changeTime', formattedString);
    }
  },
  computed: {
    // formatTime: function() {
    //   var formatted = moment(`${this.date} ${this.hour}:${this.minute}:${this.ampm}`, `YYYY-MM-DD hh:mm:a`);
    //   this.$emit('changeTime', formatted);
    //   return formatted;
    // }
  },
  watch: {
    hour: function() {
      this.recomputeFormatted();
    },
    minute: function() {
      this.recomputeFormatted();
    },
    ampm: function() {
      this.recomputeFormatted();
    }
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
