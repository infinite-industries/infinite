// SubmitEvent.vue
<template>
  <v-container>
    <h1>Event Submission:</h1>

    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Title:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.title"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Start and End Dates -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Dates:</h3>
      </v-flex>
      <v-flex xs12 sm3>
        <v-menu
          lazy
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          :nudge-right="40"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            label="Start Date"
            v-model="new_event.time_start"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="new_event.time_start" no-title scrollable actions>
            <template slot-scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary" @click="save">OK</v-btn>
              </v-card-actions>
            </template>
          </v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs0 sm1></v-flex>
      <v-flex xs12 sm3>
        <v-menu
          lazy
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          :nudge-right="40"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            label="End Date"
            v-model="new_event.time_end"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="new_event.time_end" no-title scrollable actions>
            <template slot-scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary" @click="save">OK</v-btn>
              </v-card-actions>
            </template>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>

    <!-- Event Image -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Image:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Venue -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Select a Venue:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <venue-picker :venues="venues" @selectVenue="selectVenue"></venue-picker>
      </v-flex>
    </v-layout>

    <!-- Brief Description -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Brief Description:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field label="A brief description for short-attention-span humans and webcrawlers" v-model="new_event.brief_description"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Organizers -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Organizers:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field label="Please use commas to separate" v-model="new_event.organizers"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Admission Fee -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Admission Fee:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.admission_fee"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Organizer Contact -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Organizer Contact:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.organizer_contact"></v-text-field>
      </v-flex>
    </v-layout>

    <h3>Full Event Description:</h3>
    <vue-editor v-model="content"></vue-editor>

    <v-layout row>
      <v-flex xs12>
        <p class="spacer">...</p>
      </v-flex>
    </v-layout>

    <!-- OPTIONAL FORM ELEMENTS -->
    <h1>Optional:</h1>
    <!-- Event Website link: -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Website Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.website_link"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Ticket Link -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Ticket Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.ticket_link"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Facebook Event Link -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Facebook Event Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.fb_event_link"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Eventbrite Link -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Eventbrite Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.eventbrite_link"></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row>
      <div class="text-xs-center">
        <v-btn @click="submitEvent">Submit</v-btn>
      </div>
    </v-layout>

    <v-btn @click.stop="TestSlack()">Test Slack</v-btn>
    <v-btn @click.stop="TestMail()">Test Mailer</v-btn>

  </v-container>
</template>

<script>
  import Axios from 'axios'
  import { VueEditor, Quill } from 'vue2-editor'
  import VenuePicker from '../components/VenuePicker.vue'

  export default {
    data: function () {
      return {
        new_event: {
          id:"",
          title: "",
          date:"",
          time_start:"",
          time_end:"",
          image:"",
          social_image:"",
          organizers:"",
          admission_fee:"none",
          venue:"",
          brief_description:"",
          description:"",
          website_link:"",
          eventbrite_link:"",
          fb_event_link:"",
          ticket_link:"",
          organizer_contact:""
        },
        content: "",
        venues: []
      }
    },
    methods: {
      submitEvent: function() {
        console.log("submit!");
        // this.new_event.id = uuidv1();
        Axios.post('/events/submit-new', this.new_event).then( response => {
          console.log(response);
        })
      },
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
      },
      selectVenue: function(venue) {
        console.log(venue);
        this.new_event.venue = venue.id;
      }
    },
    mounted: function() {

      Axios.get('/venues').then( response => {
        this.venues = response.data.venues;
        console.log(this.venues);
      })

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

      // vvv what is this? vvv
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));


   },

   components: {
     'vue-editor': VueEditor,
     'venue-picker': VenuePicker
   }

  }
</script>

<style scoped>
.form-label {
  text-align: right;
  padding-right: 15px;
  padding-top: 12px;
  font-size: 1.2em;
  margin-top: 10px;
  letter-spacing: normal;
  line-height: normal;
}
.spacer {
  font-size: 2em;
  text-align: center;
  margin: 20px 0px 20px 0px;
}
</style>
