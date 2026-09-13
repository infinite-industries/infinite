<template>
  <div>
    <!-- Notifications -->
    <ii-notifications />

    <!-- Toolbar and Nav -->
    <ii-toolbar>
      <template #navigation>
        <ii-site-navigation />
      </template>
    </ii-toolbar>

    <main>
      <!-- Content -->
      <slot />
    </main>
    <!-- iPhone-specific save button to desktop -->
    <!-- <ii-iphone-save-button /> -->
  </div>
</template>

<script>
  import Default from './default.vue'

  export default {
    extends: Default
  }
</script>
