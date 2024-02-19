
<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  export default {
    data: function() {
      return {
        date: null,
        config: {
          inline: true,
          enableTime: false,
          minDate: 'today'
        }
      }
    },
    components: {
      flatPickr
    }
  }
</script>

<template>
  <!--  <no-ssr placeholder="loading...">-->
  <div id="grr">
    <flat-pickr v-model="date" :config="config"></flat-pickr>
  </div>

</template>
