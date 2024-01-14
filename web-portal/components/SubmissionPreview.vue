<template>
  <div class="event-preview">
    <div class="controls">
      <!-- buttons control which preview panel is displayed on small screens -->
      <!-- (TODO: this needs proper accessibility consideration, `role`s + keyboard control) -->
      <div class="mode-toggle">
        <button type="button" :class="{ 'active': mode === 'view' }" @click="mode = 'view'">
          Full Event View
        </button>
        <button type="button" :class="{ 'active': mode === 'card' }" @click="mode = 'card'">
          Card View
        </button>
      </div>
    </div>
    <div class="event-preview-screens">
      <div class="event-preview-screen" :class="{'active': mode === 'view'}">
        <div>Event View</div>
        <event-view :event="event" />
      </div>
      <div class="event-preview-screen" :class="{'active': mode === 'card'}">
        <div>Card View</div>
        <event-card :calendar_event="event" preview />
      </div>
    </div>
  </div>
</template>

<script>
  import EventCard from '@/components/EventCard.vue'
  import EventView from '@/components/EventView.vue'

  export default {
    props: [
      'event'
    ],
    data() {
      return {
        // card | view
        mode: 'view'
      }
    },
    components: {
      'event-card': EventCard,
      'event-view': EventView
    }
  }
</script>

<style scoped>
  /* on smaller screens, need extra margin to avoid content hidden under
     fixed controls */
  @media screen and (max-width: 959px) {
    .event-preview {
      margin-bottom: 6rem;
    }
  }

  .controls {
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
  }

  .mode-toggle {
    display: flex;
    flex-direction: row;
    gap: 0;
  }

  .mode-toggle button {
    padding: 1rem 0.5rem;
    border: 2px solid black;
    background-color: #d8d7d7;
  }

  .mode-toggle button:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-right: none;
  }

  .mode-toggle button:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-left: none;
  }

  .mode-toggle button.active {
    background-color: black;
    color: white;
  }

  /* for larger-than-tablet screens, show both views side-by-side,
     and hide unncessary controls */
  @media only screen and (min-width: 1024px) {
    .controls {
      display: none;
    }
  }

  .event-preview-screens {
    background-color: black;
    border-radius: 10px;
    padding: 10px;
  }

  .event-preview-screens > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 5px;
  }

  /* only show the "active" preview element */
  .event-preview-screens > div:not(.active) {
    display: none;
  }

  .event-preview-screens > div > div:first-child {
    font-size: 1.25em;
    margin-bottom: 0.75em;
    color: white;

    /* hide preview labels on smaller screens,
       when only one is visible at a time */
    display: none;
  }

  /* for larger screens, always show both views */
  @media only screen and (min-width: 1024px) {
    .event-preview-screens {
      display: flex;
      flex-direction: row;
    }

    .event-preview-screens > div:not(.active) {
      display: flex;
    }

    .event-preview-screens > div:first-child {
      flex-basis: 67%;
    }

    .event-preview-screens > div:last-child {
      flex-basis: 33%
    }

    .event-preview-screens > div > div:first-child {
      display: block;
    }
  }

  .event-preview-screens .card-container {
    max-height: 450px;
    padding: 0;
  }
</style>
