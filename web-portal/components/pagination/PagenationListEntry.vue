<template>
  <li class="ii-pagination__entry">
    <button
      :class="getLinkClasses()"
      v-if="entryType === 'page-number'"
      :disabled="isDisabled"
      @click="$emit('pageEntryClicked', parseInt(label))"
    >
      {{ label }}
    </button>

    <button
      :class="getLinkClasses()"
      v-if="entryType === 'previous'"
      :disabled="isDisabled"
      @click="$emit('decrementPageClicked')"
    >
      {{ label }}
    </button>

    <button
      :class="getLinkClasses()"
      v-if="entryType === 'next'"
      :disabled="isDisabled"
      @click="$emit('incrementPage')"
    >
      <!--      @click="incrementPage()"-->
      {{ label }}
    </button>

    <span
      class="ii-pagination__entry-separator"
      v-if="entryType === 'truncation'"
    >
      {{ label }}
    </span>
  </li>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      },
      entryType: {
        type: String,
        required: true
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getLinkClasses() {
        const classes = ['ii-pagination__entry-button']
        if (this.entryType === 'previous' || this.entryType === 'next') {
          classes.push('ii-pagination__entry-bookend')
        }

        if (this.isSelected) {
          classes.push('ii-pagination__entry-active')
        }

        return classes.join(' ').trimEnd()
      }
    }
  }
</script>

<style scoped>
  .ii-pagination__entry {
    align-items: center;
    display: flex;

    background-repeat: no-repeat;
    padding: 0;
    margin: 0;

    list-style: none;
  }

  .ii-pagination__entry-button {
    background: #fff;
    color: #000;
    min-width: 34px;
    padding: 0 5px;

    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    border-radius: 4px;
    font-size: 14px;
    height: 34px;
    width: 34px;
    margin: 0.3rem;
    text-decoration: none;
    transition: 0.3s cubic-bezier(0, 0, 0.2, 1);

    border-style: none;

    text-transform: none;
  }

  .ii-pagination__entry-bookend {
    margin: 0.3rem 10px;
  }

  .ii-pagination__entry-active {
    color: white;
    background-color: black;
  }

  .ii-pagination__entry-separator {
    margin: 0.3rem;
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
    height: 2rem;
    width: 2rem;
  }
</style>
