<template>
  <v-app id="infinite-industries">
    <v-toolbar class="deep-purple" dark fixed>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Infinite Industries</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline @click.stop="OpenEventSubmitter()">Submit Your Event</v-btn>
      <nav-menu></nav-menu>
    </v-toolbar>
    <main id="content-wrapper">
      <notify-user></notify-user>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>

import NavMenu from './components/NavMenu.vue'
import NotifyUser from './components/NotifyUser.vue'

export default {
  data () {
    return {
      notification: {
        visible: false,
        type: '',
        message: '',
        timeout: false
      }
    }
  },
  mounted: function(){

    const _self = this

    if(GlobalUserValues.$data.logged_in===true){
      this.notification = {
        visible: true,
        type: 'info',
        message: "Welcome! Check out the local events. Please log in to start saving and sharing event lists. Submit your own events if we accidently missed something cool and cultural in your area.",
      }
      // const _self=this
      // setTimeout(function () {
      //   console.log("bye bye");
      //   _self.notification = {
      //     visible: false
      //   }
      // }, 3000);


      Axios.get('/users/1234556')
        .then(function (_response) {
          GlobalUserValues.$data.user_data = _response.data
        })
        .catch(function (error) {
          console.log(error);
          _self.notification = {
            visible: true,
            type: 'info',
            message: "Hrrmm... unable to get your data. Please contact us and we will figure out what went wrong.",
          }
        });
    }

    console.log("Logged In State:", GlobalUserValues.$data)


  },
  methods: {
    OpenEventSubmitter: function(){
      window.location.assign('https://event-add.glitch.me/');
    },
    RouteTo: function(route_to_page){
      this.$router.push({ path: route_to_page })
    },
    ConfirmAction: function(action_confirmation_message){
      // DISPATCH vuex
      // EventBus.$emit(action_confirmation_message);
      // this.notification = {
      //   visible: true,
      //   type: 'info',
      //   message: action_confirmation_message
      // }
    }

  },
  components: {
    'nav-menu': NavMenu,
    'notify-user': NotifyUser
  }
}
</script>
