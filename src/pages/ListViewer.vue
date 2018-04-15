// ListViewer.vue
// Preview individual lists before
<template>
  <v-container fluid>
    <h4>{{list_metadata.list_name}}</h4>
    <p>{{list_metadata.description}}</p>
   <!--
   List name
   Description
   edit option if "mine"
   abandon option if "mine"
   follow option if "clean"
   Contact options if public
  -->
  <events-list :id="id" :type="type"></events-list>

  </v-container>
</template>

<script>
import EventsList from '../components/EventsList.vue'

  export default {
    props:['id','type'],
    data: function () {
      return {
        //
      }
    },
    computed:{
      list_metadata: function(){
        return this.$store.getters.GetCurrentList
      }
    },
    mounted: function(){
      this.$store.dispatch('LoadListData',this.id)
    },
    components:{
      'events-list': EventsList
    }
  }

</script>
