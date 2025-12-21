<template>
  <nuxt-link v-if="partner" to="/">
    <img id="logo" :src="src" :alt="alt" :height="height" />
  </nuxt-link>
</template>

<script setup>
  const props = defineProps({
    partner: {
      type: Object,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: String,
    }
  })

  const src = computed(() => props.partner?.dark_logo_url)
  const alt = computed(() => `Brought to you by ${props.partner?.name}`)
</script>
