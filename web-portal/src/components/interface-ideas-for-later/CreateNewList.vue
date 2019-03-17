<template>
  <div v-if="visibility">
    <pop-up-dialog
      title="Create New List"
      description="Give it a unique name and a quick description."
    >
      <div slot="content">Dog</div>
      <div slot="buttons">Cat</div>
    </pop-up-dialog>
  </div>
</template>

<script>
  import PopUpDialog from './PopUpDialog.vue'

  export default {
    props: ['visibility'],
    data: function () {
      return {
        //
      }
    },
    // updated: function(){
    //   this.$nextTick(function () {
    //     console.log("TickTock", this.visibility);
    //   })
    // },
    // computed:{
    //   CheckVisibility: function(){
    //     if(this.visibility===true){
    //       return true
    //     }
    //     else {
    //       return false
    //     }
    //   }
    // },
    components:{
      'pop-up-dialog': PopUpDialog
    }
  }

</script>
