<template>
  <div>
    <span class="label">{{ label }}</span>
    <input ref="hourInput" v-model="hour" type="number" min="0" max="23" placeholder="hh" @keyup="checkForFocusOutHour"></input>
    <span>:</span>
    <input  ref="minInput" v-model="minute" type="number" min="0" max="59" placeholder="mm" @keyup="checkForFocusOutMin"></input>
    <select ref="ampm" name="ampm" v-model="ampm">
      <option value="am">AM</option>
      <option value="pm">PM</option>
    </select>
  </div>
</template>
<script>

export default {
  props: ["label"],
  data: function() {
    return {
      hour: "",
      minute: "",
      ampm: "am"
    }
  },
  methods: {
    checkForFocusOutHour: function(e) {
      if (this.hour.length >= 2) {
        this.$refs.minInput.focus();
      }
    },
    checkForFocusOutMin: function(e) {
      if (this.minute.length >= 2) {
        this.$refs.ampm.focus();
      }
    },
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
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
</style>
