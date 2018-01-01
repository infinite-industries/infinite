// ListOfLists.vue
// Listing of lists suggested and followed

<template>
  <v-list>
    <v-list-tile-title>{{title}}</v-list-tile-title>
     <v-list-tile v-for= "list in lists">
       <v-list-tile-content>
         <v-list-tile-title>{{list.list_name}}</v-list-tile-title>
       </v-list-tile-content>
       <v-list-tile-action>
         <v-btn class="deep-purple white--text" @click="RouteTo('list_viewer')">View</v-btn>
       </v-list-tile-action>
       <v-list-tile-action v-if="ShowIfType('following')">
         <v-btn @click="UnFollowList('b1e857b2-60f1-495c-8f15-94d34701619c')">Unfollow</v-btn>
       </v-list-tile-action>
       <v-list-tile-action v-if="ShowIfType('suggested')">
         <v-btn @click="FollowList('d1e857b2-60faa-495c-8f15-94d347016c7f5')">Follow</v-btn>
       </v-list-tile-action>
     </v-list-tile>
   </v-list>
 </template>

 <script>

   export default {
     name:'ListOfLists',
     props: ['lists','type','title'],
     data: function() {
       return {

       }
     },

     methods: {
       ShowIfType: function(type){
         return this.type===type ? true : false
       },
       RouteTo: function(route_to_page){
         this.$router.push({ path: route_to_page })
       },
       FollowList: function(list_id){
         // DISPATCH to vuex
         //EventBus.$emit('FOLLOW_LIST', {_id:list_id});
       },
       UnFollowList: function(list_id){
         // DISPATCH to vuex
         //EventBus.$emit('UNFOLLOW_LIST', {_id:list_id});
       },
       CreateNewList: function(list_id){
         // DISPATCH to vuex
         //EventBus.$emit('CREATE_NEW_LIST');
       }
     }
   }
</script>
