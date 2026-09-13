<template>
  <flat-pickr readonly="true" v-model="dateValue" :config="config"></flat-pickr>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/dark.css'

  export default {
    props: {
      modelValue: {
        type: String,
        default: null
      },
      allowPast: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    data: function() {
      return {
        config: {
          enableTime: false,
          minDate: this.allowPast ? null : 'today'
        }
      }
    },
    computed: {
      dateValue: {
        get() {
          return this.modelValue
        },
        set(newDate) {
          this.$emit('update:modelValue', newDate)
        }
      }
    },
    components: {
      flatPickr
    },
  }
</script>

<style scoped>
  .flatpickr-input {
    padding: 2px;
    outline: 1px solid rgb(187, 187, 187);
    border-radius: 3px;
    width: 120px;
    box-sizing: border-box;
    background: white;
    color: inherit;
  }
</style>

<!-- not scoping this because it breaks the selector to hid the arrow -->
<style>
/* hide a strange arrow that shows on Safari */
.flatpickr-calendar.arrowTop:before, .flatpickr-calendar.arrowTop:after {
  display: none;
}
</style>
