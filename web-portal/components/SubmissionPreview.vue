<template>
  <div class="event-preview">
    <div>
      <div>Event View</div>
      <event-view :event="event" />
    </div>
    <div>
      <div>Card View</div>
      <event-card :calendar_event="event" preview />
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
    components: {
      'event-card': EventCard,
      'event-view': EventView
    }
  }
</script>

<style scoped>
  .event-preview {
    display: flex;
    flex-direction: row;
    background-color: black;
    border-radius: 10px;
    padding: 10px;
  }

  .event-preview > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .event-preview > div:first-child {
    flex-basis: 67%;
  }

  .event-preview > div:last-child {
    flex-basis: 33%
  }

  .event-preview > div > div:first-child {
    font-size: 1.25em;
    margin-bottom: 1em;
    color: white;
  }

  .event-preview .card-container {
    max-height: 450px;
  }
</style>
