<template>
  <!-- <div id="modal-container" v-if='modal.open'>
    <div id="modal">
      <div id="close-modal" @click="CloseModal()">X</div>
        {{modal.message}}
    </div>
  </div> -->

  <div id="subscribe-container">
    <a href="https://infinite.industries/subscribe-email?source='mobile-internal'">subscribe</a>
  </div>

</template>



<script>

export default {
  name: 'Subscribe',
  data: function(){
    return {
      //stuff
    }
  },
  methods:{
    CloseModal: function(){
      this.$store.dispatch('showModal',{open:false})
    }
  },
  computed: {
    modal: function() {
      return this.$store.getters.modalData
    }
  }
}
</script>

<style scoped>

  /* #modal-test{
    border: 1px solid red;
    background-color:green;
    width: 100%;
    height: 100%;
    position: fixed;
  } */

  @media only screen and (min-width: 640px) {
    #subscribe-container {
      display: none;
    }
  }

  @media only screen and (max-width: 640px) {
    #subscribe-container{
      position: fixed; /* Stay in place */
      z-index: 11; /* Sit on top */
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 60px;
      padding-top:10px;
      padding-bottom:5px;
      font-size: 24px;
      overflow: auto;
      text-align: center;
      background-color: rgba(0,0,0,1.0);
      color: white;
    }

  }


  #subscribe-container a:link,
  #subscribe-container a:visited,
  #subscribe-container a:hover {
    color: white;
  }

  #modal{
    position: relative;
    background-color: #fefefe;
    color: white;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  #close-modal{
    position: absolute;
    top: 5px;
    right: 5px;
    color: black;
  }


</style>
