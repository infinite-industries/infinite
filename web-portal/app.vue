<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
  import { useStore } from 'vuex'
  const store = useStore();

  // this is where the Nuxt docs say too put something like this
  // https://nuxt.com/docs/4.x/getting-started/state-management#usage-with-pinia
  await callOnce('partner', async () => store.dispatch('partner/LoadPartner'))
</script>
