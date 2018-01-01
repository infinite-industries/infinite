<template>
  <transition name="fade">
    <div>
      <v-form v-model="valid" lazy-validation>

      <v-text-field
        label="Your New List Name"
        v-model="list_name"
        :rules="nameRules"
        required
      ></v-text-field>

      <v-text-field
         v-model="list_description"
         label="What is this list all about?"
         multi-line
       ></v-text-field>

      </v-form>

      <v-btn color="primary" class="deep-purple" @click="CreateList()">Create</v-btn>
      <v-btn @click="Cancel()">Cancel</v-btn>
    </div>
  </transition>
</template>



<script>

  export default {
    data: function() {
      return {
        valid: false,
        list_name: "",
        list_description: "",
        nameRules: [
          (v) => !!v || 'List Name is required'
        ]
      }
    },
    // $bus: {
    //   'my-event': function(arg) {
    //     console.log(arg)
    //     window.alert("YOYO")
    //   }
    // },
    methods:{
      CreateList: function(){
      // DISPATCH to vuex
      //  EventBus.$emit('CREATE_NEW_LIST', {_list:{name:this.list_name, description:this.list_description}})
        this.list_name = "..."
        this.list_description = "..."
        this.$emit("close")
      },
      Cancel: function(){
        this.$emit("close")
      }
    }

  }


</script>
