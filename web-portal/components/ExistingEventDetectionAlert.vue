<template>
  <div class="existing-event-detection-alert" v-if="isShown">
    <h3>Existing Event Detected</h3> <span class="existing-event-detection-alert__icon">⚠️</span>

    <p>Someone has entered a similar event starting around the same time at the same location.</p>

    <div>Possible Matches:</div>
    <ul>
      <li v-for="candidate in getCandidates()" :key="candidate.url">
        <a :href="candidate.url">
          {{ candidate.title }}
        </a>
        {{ !candidate.verified ? ' (unverified)' : '' }}:
        {{ candidate.briefDescription }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['duplicateEventsByStartTime', 'isShown'],
    methods: {
      getCandidates: function () {
        if (this.duplicateEventsByStartTime === null || this.duplicateEventsByStartTime === undefined) {
          return []
        } else {
          return this.duplicateEventsByStartTime.candidateEvents
        }
      }
    }
  }
</script>

<style scoped>
.existing-event-detection-alert {
  position: relative;
  color: white;
  background-color: #424242;

  border: 1px solid #ffcc4d !important;

  margin-top: 16px;
  margin-bottom: 16px;

  padding: 0.01em 16px 16px;
}

.existing-event-detection-alert h3 {
  margin: 10px 0;
  color: #ffcc4d;
}

.existing-event-detection-alert__icon {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px 16px;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
}

.existing-event-detection-alert a:link, .existing-event-detection-alert a:hover  {
  color: #51b4e5;
  //margin-top: 1.2em;
  //margin-bottom: 1.2em;
}

.existing-event-detection-alert a:visited {
  color: #039be5;
}
</style>
