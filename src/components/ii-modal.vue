<template>
  <div id="modal-container" v-if='modal.open'>
    <div id="modal">
      <div id="close-modal" @click="CloseModal()">X</div>
        {{modal.message}}
        <!-- need to figure out how to add some actions here -->
    </div>
  </div>

</template>


<script>

  export default {
    name: 'Modal',
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

  #modal-container{
    position: fixed; /* Stay in place */
    z-index: 10; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
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
