// SubmitEvent.vue
<template>
  <v-container fluid>
    <h3>Event Submission Here</h3>

    <vue-editor v-model="content"></vue-editor>

    <v-btn @click.stop="TestSlack()">Test Slack</v-btn>
    <v-btn @click.stop="TestMail()">Test Mailer</v-btn>

  </v-container>
</template>

<script>
  import Axios from 'axios'
  import { VueEditor, Quill } from 'vue2-editor'

  export default {
    data: function () {
      return {
        content: "yo!"
      }
    },
    methods: {
      TestMail: function(){
        Axios.post('/events/promo-new', {"test":"me"})
          .then(function(_response) {
            console.log(_response.data)
          })
          .catch(function(error) {
            console.log(error)
          })
      },
      TestSlack: function(){
        Axios.post('/events/submit-new', {"test":"me"})
          .then(function(_response) {
            console.log(_response.data)
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    },
    mounted: function(){
      window.fbAsyncInit = function() {
      FB.init({
        appId            : '132381870824243',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();

      console.log("Facebook API initialized")

    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
   },

   components: {
     VueEditor
   }

  }
</script>
