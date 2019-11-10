<template>
  <div id="list-container">
    <div id="list-viewer" ref="list" v-if="!LOADING">
      <ii-card v-for="calendar_event in calendar_events" :key="calendar_event.id" :calendar_event="calendar_event"></ii-card>
    </div>
    <div v-else class="spinner-container">
      <ii-loader id="loader" iconColor="#fff" width="100%" height="100%" />
    </div>
  </div>
</template>

<script>

  import Card from './ii-card.vue'
  import Loader from './vectors/Loader.vue'

  export default {
    name: 'ListViewer',
    props: ['calendar_events'],
    computed: {
      LOADING: function () {
        return this.$store.getters.GetLoadingStatus
      }
    },
    components: {
      'ii-card': Card,
      'ii-loader': Loader
    }
  }
</script>

<style scoped>

  *{
    color: white;
  }

  .spinner-container {
    text-align: center;
  }

  #list-container {
    width: 100%;
    padding: 0px;
  }

  #list-viewer {
    padding-top: 25px;

    display:flex;
    flex-wrap: wrap;
    justify-content: center;

  }

  @supports (display: grid) {
    #list-viewer {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  @media only screen and (min-width: 480px) {
    #list-container {
      padding: 0 15px
    }
  }

</style>
