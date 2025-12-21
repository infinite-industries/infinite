<template>
  <nuxt-link v-if="partner" to="/">
    <img id="logo" :src="partner.light_logo_url" :alt="`Brought to you by ${partner.name}`" :height="height" />
  </nuxt-link>
</template>

<script setup>
  defineProps({
    partner: {
      type: Object,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: String,
    }
  })
</script>
