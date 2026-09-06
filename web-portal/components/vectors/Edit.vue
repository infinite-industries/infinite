// Edit (Pen) Icon
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512.1"
    :width="width"
    :height="height"
    version="1.1"
    x="0px"
    y="0px"
  >

    <title>Edit Icon</title>

    <g :fill="iconColor">
      <path d="M352.9,21.2l-44.9,44.9s-7.5,39.1,45.7,92.9c47.5,48,92.2,45,92.2,45l44.9-44.9c13.6-13.5,21.2-31.9,21.2-51.1s-7.6-37.6-21.2-51.1l-35.7-35.7c-13.5-13.6-31.9-21.2-51.1-21.2s-37.6,7.6-51.1,21.2ZM276.1,100L58.9,315.1c-10.7,10.7-18.5,24.1-22.6,38.7L.9,481.6c-2.3,8.3,0,17.3,6.2,23.4,6.2,6.1,15.1,8.5,23.4,6.2l127.8-35.5c14.6-4.1,27.9-11.8,38.7-22.6l217-215.2s-48.3,2.7-95-47.9c-45.2-49-42.9-90-42.9-90Z"/>
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
