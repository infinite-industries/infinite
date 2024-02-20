
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

<template>
  <!--  <no-ssr placeholder="loading...">-->
  <div id="grr">
    <flat-pickr readonly="true" v-model="date" :config="config"></flat-pickr>
  </div>

</template>

<style scoped>
  .flatpickr-input {
    display: none;
  }
</style>
