<template>
  <span class="date-picker">
    <!-- attrs (e.g. id, placeholder) belong on the input, not the wrapper -->
    <flat-pickr v-bind="$attrs" readonly="true" v-model="dateValue" :config="config"></flat-pickr>
    <!-- calendar icon makes it clear the date is editable, taps pass through to the input -->
    <calendar-icon class="date-picker__icon" aria-hidden="true" icon-color="rgb(110, 110, 110)" width="16" height="16" />
  </span>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import CalendarIcon from '@/components/vectors/Calendar.vue'
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/dark.css'

  export default {
    inheritAttrs: false,
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
      flatPickr,
      CalendarIcon
    },
  }
</script>

<style scoped>
  .date-picker {
    position: relative;
    display: inline-block;
  }

  /* On mobile flatpickr swaps in a native <input type="date"> created outside of Vue, */
  /* so it never gets the scoped data attribute; anchoring on the wrapper with :deep() */
  /* lets these styles reach both the desktop and the mobile input */
  .date-picker :deep(.flatpickr-input) {
    -webkit-appearance: none;
    appearance: none;
    padding: 2px 24px 2px 4px;
    outline: 1px solid rgb(187, 187, 187);
    border-radius: 3px;
    width: 150px;
    min-height: 28px;
    box-sizing: border-box;
    background: white;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .date-picker :deep(.flatpickr-input:focus) {
    outline: 1px solid #6ea8fe;
  }

  /* iOS centers the value of a native date input by default */
  .date-picker :deep(.flatpickr-mobile::-webkit-date-and-time-value) {
    text-align: left;
  }

  .date-picker__icon {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
</style>

<!-- not scoping this because it breaks the selector to hid the arrow -->
<style>
/* hide a strange arrow that shows on Safari */
.flatpickr-calendar.arrowTop:before, .flatpickr-calendar.arrowTop:after {
  display: none;
}
</style>
