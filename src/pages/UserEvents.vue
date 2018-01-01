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
          title = "Your Lists"
          :type="my"
          :lists="my_lists"
          v-on:add="AddNewList()"
        ></list-of-lists>

        <v-btn @click="create_new_list_visible=!create_new_list_visible">+ Create New List</v-btn>
        <create-new-list
          v-show="create_new_list_visible"
          transition="fade-transition"
          v-on:close="CloseCreateNewList()"
        ></create-new-list>
      </div>

      <div class="user-events-item">
        <list-of-lists
          title = "Lists You Follow"
          :type="'following'"
          :lists="lists_i_follow"
        ></list-of-lists>
      </div>

      <div class="user-events-item">
        <list-of-lists
          title = "Test List"
          :type="'following'"
          :lists="test_lists"
        ></list-of-lists>
      </div>

      <!-- <div class="user-events-item">
        Some local lists that are cool.
        <ul>
          <li>WRFL Curated Events<v-btn @click="FollowList('b1e857b2-60f1-495c-8f15-94d34701619c')">Follow</v-btn></li>
          <li>Death Metal Central<v-btn @click="FollowList('a1e857b2-60f1-595c-8f15-94d34701619c')">Follow</v-btn></li>
          <li>UnderMain<v-btn @click="FollowList('d1e857b2-60faa-495c-8f15-94d347016c7f5')">Follow</v-btn></li>
        </ul>
      </div> -->

      <div class="user-events-item">
        Discover new <a href="#">events in your area</a>
      </div>

      <button @click="TestAddList">TEST ME</button>

    </v-container>

  </div>
</template>

<script>
  import Axios from 'axios'

  import CreateNewList from '../components/CreateNewList.vue'
  import ListOfLists from '../components/ListOfLists.vue'

  export default {
    data: function(){
      return {
        create_new_list_visible: false,
        my_lists:[],
        lists_i_follow:[]
      }
    },
    methods:{
      FollowList: function(list_id){
        // DISPATCH vuex
        //EventBus.$emit('FOLLOW_LIST', {_id:list_id});
      },
      UnFollowList: function(list_id){
        // DISPATCH vuex
        //EventBus.$emit('UNFOLLOW_LIST', {_id:list_id});
      },
      CloseCreateNewList: function(){
        this.create_new_list_visible=false
        console.log("try to change")
      },
      TestAddList: function(){
        this.$store.dispatch('CreateNewListAndAddIt')
      }
    },
    mounted: function(){
      const _self = this
      Axios.get('/users/1234556')
        .then(function (_response) {
          console.log(_response);
          GlobalUserValues.$data.user_data = _response.data
          _self.my_lists = GlobalUserValues.$data.user_data.lists.my_lists
          _self.lists_i_follow = GlobalUserValues.$data.user_data.lists.lists_i_follow
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    computed:{
      test_lists: function(){

        console.log(this.$store.state);
        return this.$store.state.test_lists
      }
    },
    components:{
      'create-new-list': CreateNewList,
      'list-of-lists': ListOfLists
    }

  }
</script>
