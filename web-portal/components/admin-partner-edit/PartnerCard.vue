<template>
  <div class="partner-card">
    <section class="partner-info">
      <div v-for="field in displayFields" :key="field.key">
        <label class="partner-label">{{ field.label }}:</label>
        <span>{{ field.value }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    partner: {
      type: Object,
      required: false,
      default: () => ({})
    }
  })

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  const displayFields = computed(() => [
    { key: 'name', label: 'Name', value: props.partner.name },
    { key: 'id', label: 'ID', value: props.partner.id },
    { key: 'createdAt', label: 'Created At', value: formatDate(props.partner.createdAt) },
    { key: 'updatedAt', label: 'Updated At', value: formatDate(props.partner.updatedAt) }
  ])
</script>

<style scoped>
.partner-card {
  margin-bottom: 1rem;
  border: 2px solid #333;
  /* Sketch-style outline */
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.8);
  padding: 1rem;
}

.partner-info {
  display: block;
  width: 100%;
  font-size: larger;
}

.partner-info > div {
  margin-bottom: 0.5rem;
}

label.partner-label {
  font-weight: bold;
  margin-right: 0.5rem;
}
</style>
