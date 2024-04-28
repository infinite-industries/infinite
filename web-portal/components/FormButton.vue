<template>
  <button
    :class="classes"
    @click="$emit('click', ...arguments)"
    :type="type"
  >
    <slot></slot>
  </button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'button'
      },
      styleType: {
        type: String,
        default: 'default'
      }
    },
    model: {
      event: 'click'
    },
    computed: {
      classes() {
        const classes = ['ii-form-button']

        if (this.styleType === 'default') {
          classes.push('ii-form-button_default')
        }
        return classes
      }
    }
  }
</script>

<style scoped>
 .ii-form-button {
   padding: 0 16px;
   align-items: center;
   border-radius: 2px;
   display: inline-flex;
   height: 36px;
   flex: 0 0 auto;
   font-size: 14px;
   font-weight: 500;
   justify-content: center;
   margin: 6px 8px;
   min-width: 88px;
   outline: 0;
   text-transform: uppercase;
   text-decoration: none;
   transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), color 1ms;
   position: relative;
   vertical-align: middle;
   user-select: none;
 }

 .ii-form-button {
   will-change: box-shadow;
   box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
 }

 .ii-form-button:active {
   will-change: box-shadow;
   box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
 }

 .ii-form-button_default {
   background-color: #9e9e9e
 }

 .ii-form-button_default:hover {
   background-color: #8d8d8d
 }
</style>
