<template>
  <div id="list-container">
    <div id="list-viewer" ref="list" v-if="!LOADING">
      <div v-for= "calendar_event in calendar_events" :key="calendar_event.id" class="outer-countainer">
         <ii-card :calendar_event="calendar_event"></ii-card>
      </div>
      <div id="shim" ref="shim"></div>
    </div>
    <div v-else class="spinner-container">
      <!-- <img src="/images/spinner.gif" /> -->
      <ii-loader id="loader" iconColor="#fff" width="100%" height="100%" />
    </div>
  </div>
</template>


<script>
//import Axios from 'axios';

const VERTICAL_CARD_SIZE = 250 // 240px + 5px padding each side

import Card from './ii-card.vue'
import Loader from './vectors/Loader.vue'

export default {
  name: 'ListViewer',
  props: ['calendar_events'],
  data: function(){
    return {

    }
  },
  mounted: function(){
    // Adjust the row size
    this.$nextTick(function() {
      this.adjustCardSpacing()
      window.addEventListener('resize', this.adjustCardSpacing)
    })

  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.adjustCardSpacing)
  },
  computed:{
    LOADING: function(){
      return this.$store.getters.GetLoadingStatus
    }

  },
  watch:{
    LOADING: function(value){
      if(value==false){
        this.$nextTick(function() {
          this.adjustCardSpacing()
        })
      }
    }
  },
  methods: {
    adjustCardSpacing: function(){

      // list is hidden while loading, cannot measure width
      if (this.LOADING) return

      if(window.innerWidth>480){
        let card_width = VERTICAL_CARD_SIZE
        let card_total = this.calendar_events.length
        let list_viewer_width = this.$refs.list.clientWidth

        // number of cards that fit in one row is the width of the list divided by the width of a card
        let row_length = Math.floor(list_viewer_width / card_width)
        let shim_equiv = card_total % row_length

        // when the total divides evenly into the row length, there's no need for the shim,
        // and it actively interferes with resize by preventing the list container from adjusting
        let shim_width = '0'
        if (shim_equiv > 0)
          shim_width = (row_length - shim_equiv) * card_width

        // console.log(card_total + " cards with width " + card_width + "px");
        // console.log(row_length + " cards will fit in " + list_viewer_width + "px");
        // console.log("shim is equivalent to " + shim_equiv + " cards with width " + shim_width + "px");

        this.$refs.shim.style.width = shim_width + 'px'
        this.$refs.shim.style.display = ''
      }
      else{
        // console.log("single column, shim not necessary");
        this.$refs.shim.style.display = 'none'
      }
    }
  },
  components:{
    'ii-card': Card,
    'ii-loader': Loader
  }
}
</script>

<style scoped>

*{
  color: white;
}
  #list-container {
    width: 100%;
    padding: 0px;
  }

  .spinner-container {
    text-align: center;

  }

  @media only screen and (min-width: 481px) {
    #list-container {
      display: flex;
      justify-content: center;
    }
  }

  #list-viewer {
    /* max-width: 90%; */
    padding-top: 25px;

    display:flex;
    flex-wrap: wrap;
    justify-content: center;

  }

  @media only screen and (max-width: 480px) {
    .outer-countainer{
      border-top-left-radius:10px;
      border-bottom-left-radius: 10px;
      width: 100%;
    }
  }


</style>
