<template>
  <div>
    <!-- Notifications -->
    <ii-notifications />

    <!-- Toolbar and Nav -->
    <ii-toolbar>
      <template #navigation>
        <ii-admin-navigation />
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
  import AdminNavigation from '../components/AdminNavigation.vue'

  export default {
    extends: Default,
    components: {
      'ii-admin-navigation': AdminNavigation
    }
  }
</script>

<style>
  /*
   * This style block builds on, and does not replace, the style block of the
   * default layout which this layout extends
   */

  .admin-page {
    background: white;
    color: black;
    border-radius: 10px;
  }

  @media only screen and (min-width: 993px) {
    .admin-page {
      max-width: 80%;
    }
  }
</style>
