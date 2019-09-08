<template>
  <div class="container admin-page">
    <h2>Unverified Events</h2>
    <admin-events-list :calendar_events="unverified_events"></admin-events-list>
    <!-- <h3>Active Events</h3>
    <admin-events-list :events="events"></admin-events-list> -->
  </div>
</template>

<script>
  import AdminEventsList from '../../components/AdminEventsList.vue'

  export default {
    name: 'Admin',
    middleware: 'auth',
    head: {
      title: 'Unverified Events - Infinite Industries'
    },
    data: function () {
      return {
        //
      }
    },
    computed: {
      unverified_events: function () {
        return this.$store.getters['admin/GetUnverifiedEvents']
      }
    },
    mounted: function () {
      this.$store.dispatch('admin/LoadUnverifiedEvents')
    },
    components: {
      'admin-events-list': AdminEventsList
    }
  }
</script>

<style scoped>
    .admin-page {
    background: white;
    color: black;
    border-radius: 10px;
  }
</style>
