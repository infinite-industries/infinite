// ListOfLists.vue
// Listing of lists suggested and followed

<template>
  <v-list>
     <v-list-tile v-for= "list in lists">
       <v-list-tile-content>
         <v-list-tile-title>{{list.title}}</v-list-tile-title>
       </v-list-tile-content>
       <v-list-tile-action>
         <v-btn class="deep-purple white--text" @click="RouteTo('list_viewer')">Preview</v-btn>
       </v-list-tile-action>
       <v-list-tile-action v-if="following">
         <v-btn @click="UnFollowList('b1e857b2-60f1-495c-8f15-94d34701619c')">Unfollow</v-btn>
       </v-list-tile-action>
       <v-list-tile-action v-if="!following">
         <v-btn @click="FollowList('d1e857b2-60faa-495c-8f15-94d347016c7f5')">Follow</v-btn>
       </v-list-tile-action>
     </v-list-tile>
   </v-list>
 </template>

 <script>

   import EventBus from '../helpers/EventBus.js'

   export default {
     name:'ListOfLists',
     props: ['lists','following'],
     data: function() {
       return {

       }
     },
     methods: {
       RouteTo: function(route_to_page){
         this.$router.push({ path: route_to_page })
       },
       FollowList: function(list_id){
         EventBus.$emit('FOLLOW_LIST', {_id:list_id});
       },
       UnFollowList: function(list_id){
         EventBus.$emit('UNFOLLOW_LIST', {_id:list_id});
       },
       CreateNewList: function(list_id){
         EventBus.$emit('CREATE_NEW_LIST');
       }
     }
   }
</script>
