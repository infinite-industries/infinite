<template>
  <div id='container' v-if='notification.open'>
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
    }
  }
</script>

<style scoped>
  #container {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1)
  }

  #close-notify{
      position: absolute;
      top: 5px;
      right: 5px;
  }

  #notify{
    position: relative;
    max-width: 60%;
    margin-left: auto;
    margin-right: auto;

    /* border: 1px solid red; */

    padding: 15px;

    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
    color: white;
  }


</style>
