<template>
  <flat-pickr readonly="true" v-model="dateValue" :config="config"></flat-pickr>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/dark.css'

  export default {
    emits: ['change'],
    data: function() {
      return {
        config: {
          inline: true,
          enableTime: false,
          minDate: this.allowPast ? null : 'today'
        }
      }
    },
    components: {
      flatPickr
    },
    computed: {
      dateValue: {
        get() {
          return this.date
        },
        set(newDate) {
          this.$emit('change', newDate)
        }
      }
    },
    props: {
      date: {
        type: String,
        default: null
      },
      allowPast: {
        type: Boolean,
        default: false
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

<!-- not scoping this because it breaks the selector to hid the arrow -->
<style>
/* hide a strange arrow that shows on Safari */
.flatpickr-calendar.arrowTop:before, .flatpickr-calendar.arrowTop:after {
  display: none;
}
</style>
