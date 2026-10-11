<template>
  <span class="time-part">
    <input
      :ref="hourRef"
      v-model="hourLocal"
      type="text"
      placeholder="hh"
      maxlength="2"
      class="hour-part"
      :class="{ invalid: invalidHour }"
    />
    <span> : </span>
    <input
      :ref="minRef"
      v-model="minuteLocal"
      type="text"
      placeholder="mm"
      maxlength="2"
      class="minute-part"
      :class="{ invalid: invalidMinute }"
    />
    <select :ref="ampmRef" v-model="ampmLocal">
      <option value="am">&nbsp;AM</option>
      <option value="pm">&nbsp;PM</option>
    </select>
  </span>
</template>

<script>
  export default {
    name: 'TimePicker',
    props: {
      hour: { type: String, default: '' },
      minute: { type: String, default: '' },
      ampm: { type: String, default: 'pm' },
      invalidHour: { type: Boolean, default: false },
      invalidMinute: { type: Boolean, default: false },
      hourRef: { type: String, default: 'hourInput' },
      minRef: { type: String, default: 'minInput' },
      ampmRef: { type: String, default: 'ampmInput' }
    },
    emits: ['update:hour', 'update:minute', 'update:ampm'],
    computed: {
      hourLocal: {
        get() { return this.hour },
        set(v) { this.$emit('update:hour', v) }
      },
      minuteLocal: {
        get() { return this.minute },
        set(v) { this.$emit('update:minute', v) }
      },
      ampmLocal: {
        get() { return this.ampm },
        set(v) { this.$emit('update:ampm', v) }
      }
    }
  }
</script>

<style scoped>
.time-part input { padding: 2px; outline: 1px solid rgb(187, 187, 187); border-radius: 3px; width: 45px; }
.time-part .invalid { outline: 1px solid red; }
</style>
