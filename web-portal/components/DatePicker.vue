<template>
  <flat-pickr readonly="true" v-model="date" :config="config"></flat-pickr>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/dark.css'

  export default {
    model: {
      event: 'change'
    },
    data: function() {
      return {
        date: null,
        config: {
          inline: true,
          enableTime: false,
          minDate: 'today',
          onChange: (date) => {
            this.onDateChanged(date)
          }
        }
      }
    },
    components: {
      flatPickr
    },
    methods: {
      onDateChanged: function() {
        this.$emit('change', this.date)
      }
    }
  }
</script>

<style scoped>
   /* hide the input box that flatpickr wants to show */
  .flatpickr-input {
    display: none;
  }
</style>
