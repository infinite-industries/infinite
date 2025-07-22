<template>
  <button :class="getClasses()" @click="onClick()">
    <div class="date-time-picker-button__content">
      <slot></slot>
    </div>
  </button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'standard'
      },
      size: {
        type: String,
        default: 'size'
      },
      className: {
        type: String,
        default: ''
      }
    },
    emits: {
      click: null
    },
    methods: {
      onClick() {
        this.$emit('click')
      },
      getClasses() {
        const classes = ['date-time-picker-button']
        if (this.className.trim().length > 0) {
          classes.push(this.className)
        }

        switch (this.type) {
        case 'confirm':
          classes.push('date-time-picker-button__confirm')
          break
        case 'delete':
          classes.push('date-time-picker-button__delete')
          break
        case 'cancel': // fall through
        case 'default':
          classes.push('date-time-picker-button__cancel')
          break
        }

        if (this.size === 'large') {
          classes.push('date-time-picker-button__large')
        }

        return classes.join(' ')
      }
    }
  }
</script>

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

  .date-time-picker-button__confirm {
    background-color: #4caf50;
  }

  .date-time-picker-button__confirm:hover {
    background-color: #66bb6a;
  }

  .date-time-picker-button__delete {
    background-color: #f44336
  }

  .date-time-picker-button__delete:hover {
    background-color: #ef5350;
  }

  .date-time-picker-button__large {
    height: 36px;
    font-size: 14px;
  }
</style>
