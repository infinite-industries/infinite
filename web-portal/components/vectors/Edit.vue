// Close Icon
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 16 16"
    :width="width"
    :height="height"
    version="1.1"
    x="0px"
    y="0px"
  >

    <title>Edit Icon</title>

    <g :fill="iconColor">
      <polygon points="15.3 2.1 14.4 .7 12.7 0 11 .7 9.5 2.1 9.7 2.3 7.2 5 4.5 7.5 1.8 10 1 11.2 0 15.2 .4 15.9 1.1 16.3 5 15 6.2 14.4 9 11.9 11.5 9.2 14 6.6 14 6.6 15.5 5.3 15.9 3.6 15.3 2.1"/>
    </g>
  </svg>
</template>

<script>
  export default {
    props: ['width', 'height', 'iconColor'],
    data: function () {
      return {
        //
      }
    }
  }
</script>

<style scoped>

</style>
