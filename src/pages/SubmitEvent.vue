// SubmitEvent.vue
<template>
  <v-container fluid>
    <h3>Event Submission Here</h3>

    <vue-editor v-model="content"></vue-editor>

    <v-btn @click.stop="TestSlack()">Test Slack</v-btn>
    <v-btn @click.stop="TestMail()">Test Mailer</v-btn>

    <div>
      <input type="file" class="form-control" id="event-image" name="event_image">
      <v-btn @click.stop="UploadEvent()">Test Text+Image Upload</v-btn>
    </div>

  </v-container>
</template>

<script>
  import Axios from 'axios'
  import { VueEditor, Quill } from 'vue2-editor'
  import uuid from 'uuid/v4'

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
        // Axios.post('/events/submit-new', {"test":"me"})
        //   .then(function(_response) {
        //     console.log(_response.data)
        //   })
        //   .catch(function(error) {
        //     console.log(error)
        //   })
        window.alert("disabled for now")
      },
      UploadEvent: function(){

        const formData = new FormData()
        formData.append('id', uuid())
        formData.append('title', "test")
        formData.append('slug', "test-slug")
        formData.append('image', document.getElementById('event-image').files[0])

        Axios.post('/events/submit-new', formData)
          .then(function(_response) {
            console.log(_response.data)
            window.alert("Event submitted. Thank you! It should be out of review and on our site within 24 hours. Usually, much faster :)");
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
