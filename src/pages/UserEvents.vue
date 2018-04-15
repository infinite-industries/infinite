// UserEvents.vue
<template>
  <div>
  <v-container fluid id="static-page-wrapper">
    <h4>Your Events</h4>
    <!-- My List(s) -->
    <!-- Create New List -->
    <!-- Lists I follow -->
    <!-- Discover Mode with everything for my zip -->

      <div class="user-events-item">
        <list-of-lists
          title = "You have created the following lists:"
          type="mine"
          :lists="my_lists"
        ></list-of-lists>

        <v-btn @click="create_new_list_visible=!create_new_list_visible">+ Create New List</v-btn>
        <create-new-list
          v-show="create_new_list_visible"
          transition="fade-transition"
          v-on:close="create_new_list_visible=!create_new_list_visible"
        ></create-new-list>
      </div>

      <!-- <div class="user-events-item">
        <list-of-lists
          title = "Lists You Follow"
          type="following"
          :lists="lists_i_follow"
        ></list-of-lists>
      </div> -->

      <div class="user-events-item">
        Browse around for some new <a href="#" @click.stop="RouteTo('/')">events in your area</a>
      </div>

    </v-container>

  </div>
</template>

<script>
  import CreateNewList from '../components/CreateNewList.vue'
  import ListOfLists from '../components/ListOfLists.vue'

  export default {
    data: function(){
      return {
        create_new_list_visible: false,
      }
    },
    computed:{
      my_lists: function(){
        return this.$store.getters.GetMyLists
      },
      lists_i_follow: function(){
        return this.$store.getters.GetListsIFollow
      }
    },
    methods: {
      RouteTo: function(route_to_page){
        this.$router.push({ path: route_to_page })
      }
    },
    components:{
      'create-new-list': CreateNewList,
      'list-of-lists': ListOfLists
    }

  }
</script>
