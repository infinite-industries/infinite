<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'standard'
      },
      text: {
        type: String,
        default: ''
      }
    },
    model: {
      event: 'change'
    }
  }
</script>

<template>
  <button class="date-time-picker-button">
    <div class="date-time-picker-button__content">
      {{ text }}
    </div>
  </button>
</template>

<style scoped>
  .date-time-picker-button {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    position: relative;
    vertical-align: middle;

    border-radius: 2px;
    margin: 6px 8px;
    padding: 0 8px;

    min-width: 88px;

    text-transform: uppercase;

    outline: 0;

    font-weight: 500;
    font-size: 13px;
    height: 28px;

    background-color: #9e9e9e;
    color: white;
  }

  .date-time-picker-button:hover {
    background-color:  #bdbdbd;
  }

  .date-time-picker-button__content {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    margin: 0 auto;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    white-space: nowrap;
  }
</style>
