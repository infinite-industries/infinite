<template>
  <div>
    <ii-list-viewer :calendar_events="events"/>
  </div>
</template>

<script>

import ListViewer from '../components/ii-list-viewer.vue'

export default {
  data: function () {
    return {
      // venues: []
    }
  },
  computed:{
    events: function(){
      return this.$store.getters.GetAllLocalEvents
    }
  },
  mounted: function() {
    this.$store.dispatch('LoadAllLocalEventData')
    console.log('TEST HOME')

    // axios.get('/venues').then( response => {
    //   this.venues = response.data.venues;
    // }).catch( err => {
    //   console.log(err);
    // })
  },
  components:{
    'ii-list-viewer': ListViewer
  }

}
</script>

<style scoped></style>
