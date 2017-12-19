// UserEvents.vue
<template>
    <!-- My List(s) -->

    <!-- Create New List -->

    <!-- Lists I follow -->

    <!-- Discover Mode with everything for my zip -->
    <div style="padding-top:30px;">
      <div class="user-events-item">
        my current lists here (need to think through an interface)

        <v-btn @click="CreateNewList()">+ Create Another List</v-btn>
      </div>

      <div class="user-events-item">
        Some lists I follow
        <ul>
          <li>WRFL Curated Events<v-btn @click="UnFollowList('b1e857b2-60f1-495c-8f15-94d34701619c')">Unfollow</v-btn></li>
          <li>Death Metal Central<v-btn @click="UnFollowList('a1e857b2-60f1-595c-8f15-94d34701619c')">Unfollow</v-btn></li>
          <li>UnderMain<v-btn @click="UnFollowList('d1e857b2-60faa-495c-8f15-94d347016c7f5')">Unfollow</v-btn></li>
        </ul>
      </div>

      <div class="user-events-item">
        Some local lists that are cool.
        <ul>
          <li>WRFL Curated Events<v-btn @click="FollowList('b1e857b2-60f1-495c-8f15-94d34701619c')">Follow</v-btn></li>
          <li>Death Metal Central<v-btn @click="FollowList('a1e857b2-60f1-595c-8f15-94d34701619c')">Follow</v-btn></li>
          <li>UnderMain<v-btn @click="FollowList('d1e857b2-60faa-495c-8f15-94d347016c7f5')">Follow</v-btn></li>
        </ul>
      </div>

      <div class="user-events-item">
        Discover new events in your area
        <div class="user-events-item">
          cards and shit here
        </div>
      </div>

    </div>

</template>

<script>
  import EventBus from '../helpers/EventBus.js';

  export default {
    methods:{
      FollowList: function(list_id){
        EventBus.$emit('FOLLOW_LIST', {_id:list_id});
      },
      UnFollowList: function(list_id){
        EventBus.$emit('UNFOLLOW_LIST', {_id:list_id});
      },
      CreateNewList: function(list_id){
        EventBus.$emit('CREATE_NEW_LIST');
      },
    }

  }
</script>
