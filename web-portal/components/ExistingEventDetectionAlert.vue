<template>
  <div class="existing-event-alert">
    <h3>Existing Event Detected</h3> <span class="existing-event-alert__icon">⚠️</span>

    <p>Someone has entered a similar event starting around the same time at the same location.</p>

    <div>Possible Matches:</div>
    <ul>
      <li v-for="candidate in duplicateEventsByStartTime.candidateEvents" :key="candidate.url">
        <a :href="candidate.url">
          {{ candidate.title }}
        </a>
        {{ !candidate.verified ? ' (unverified)' : '' }}:
        {{ candidate.briefDescription }}
      </li>
    </ul>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>