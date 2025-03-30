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
    <!-- PopUps and Modals -->
    <!-- Regular Old Modal -->
    <ii-modal />
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
