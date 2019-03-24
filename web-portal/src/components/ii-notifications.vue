<template>
  <div id='container' v-show='notification.open'>
    <div id="notify">
      <div id="close-notify" @click="CloseNotifications()">X</div>
      {{notification.message}}
    </div>
  </div>
</template>


<script>

export default {
  name: 'notifications',
  data: function(){
    return {
      //stuff
    }
  },
  methods:{
    CloseNotifications: function(){
      this.$store.dispatch('showNotifications',{open:false})
    }
  },
  computed: {
    notification: function() {
      return this.$store.getters.notificationsData
    }
  },
  mounted: function(){
    let margin = Math.floor((window.innerWidth - window.innerWidth*0.8)/2)
    // this is strongly coupled to the size of the countainer
    // currently 80%
    // and does not yet work with resizing the screen
    console.log(margin)
    document.getElementById('container').style.left = margin +'px'

  }
}
</script>

<style scoped>
  #container {
    width: 80%;
    position: fixed;
    top: 105px;
    z-index: 99;
    background-color: black;
    border-radius: 8px;
    border: 2px solid white;
  }

  #close-notify{
      float: right;
      cursor: pointer;
  }

  #notify{
    /* position: relative; */
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;

    /* border: 1px solid red; */

    padding: 15px;

    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
    color: white;
  }


</style>
