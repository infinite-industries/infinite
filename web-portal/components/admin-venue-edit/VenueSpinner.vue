<template>
  <div v-if="isShown" class="admin-venue-edit-page__spinner">
    <div class="admin-venue-edit-page__spinner-wrapper">
      <img class="loading-spinner admin-venue-edit-page__spinner-img" src="~/assets/images/spinner.gif">
    </div>

    <div class="admin-venue-edit-page__spinner-optional-loading-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VenueSpinner',
    props: ['isShown']
  }
</script>

<style scoped>
  .admin-venue-edit-page__spinner {
    width: 1rem;
    display: flex;
  }

  .admin-venue-edit-page__spinner-wrapper {
    margin-right: 1rem;
  }

  .admin-venue-edit-page__spinner-img {
    width: 1rem;
  }

  .admin-venue-edit-page__spinner {
    width: auto;
  }
</style>
