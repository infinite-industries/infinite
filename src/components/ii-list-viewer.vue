<template>
  <div id="list-container">
    <div id="list-viewer" v-if="!LOADING">
      <div v-for= "calendar_event in calendar_events" class="outer-countainer">
         <ii-card :calendar_event="calendar_event"></ii-card>
      </div>
      <div id="shim"></div>
    </div>
    <div v-else>
      <img src="/images/spinner.gif" />
    </div>
  </div>
</template>


<script>
  //import Axios from 'axios';

  import Card from './ii-card.vue'
  export default {
    name: 'ListViewer',
    props: ['calendar_events'],
    data: function(){
      return {
        //stuff
        list_viewer_width: 0,
        CARD_TOTAL: 0,
        CARD_SIZE: 400,    // 380 +10 +10

      }
    },
    mounted: function(){

      // console.log("MY EVENTS: "+this.calendar_events);
      //
      // if(window.innerWidth>890){
      //   this.CARD_SIZE = 400
      // }
      // else if(window.innerWidth>480){
      //   this.CARD_SIZE = 230
      // }
      // else{
      //   this.CARD_SIZE = window.innerWidth
      // }

      // console.log("viewer loaded: ", this.list_type);

      // var self = this;
      // Axios.get('mock_calendar_events.json')
      //   .then(function (response) {
      //     console.log("data from server: ",response.data);
      //     self.calendar_events = response.data;
      //
      //     self.$nextTick(function() {
      //       self.adjustCardSpacing()
      //     })
      //
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });


      // Adjust the row size
      this.$nextTick(function() {
        this.adjustCardSpacing()
        window.addEventListener('resize', this.adjustCardSpacing)
      })

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

        console.log("RESIZZZING " + this.calendar_events.length);


        if(window.innerWidth>890){
          this.CARD_SIZE = 400
        }
        else if(window.innerWidth>480){
          this.CARD_SIZE = 230
        }
        else{
          this.CARD_SIZE = window.innerWidth
          document.getElementById('shim').style.width = window.innerWidth + "px"
        }

        // ROW_LENGTH - CARD_TOTAL%ROW_LENGTH
        this.CARD_TOTAL = this.calendar_events.length
        //console.log("TOTAL:"+this.CARD_TOTAL);
        this.list_viewer_width = document.getElementById('list-viewer').clientWidth
        //console.log("width of list-viewer: "+ this.list_viewer_width);
        let ROW_LENGTH = Math.floor(this.list_viewer_width/this.CARD_SIZE)
        //console.log("row length: " + ROW_LENGTH);

        //console.log(((ROW_LENGTH - this.CARD_TOTAL%ROW_LENGTH)*this.CARD_SIZE).toString() + "px")
        //(()*this.CARD_SIZE).toString()
        document.getElementById('shim').style.width = ((ROW_LENGTH - this.CARD_TOTAL%ROW_LENGTH)*this.CARD_SIZE).toString() + "px"
      }
    },
    components:{
      'ii-card': Card
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

    display: flex;
    justify-content: center;

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
