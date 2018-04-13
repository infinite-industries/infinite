// SubmitEvent.vue
<template>
  <v-container ii-offset>
    <h1>Event Submission:</h1>
    <i><span class="required-field">*</span> = required field</i>

    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Title<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="new_event.title" :rules="[v => !!v || 'Title is required']"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Start Date -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Date<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-menu :close-on-content-click="true">
          <v-text-field
            slot="activator"
            label="Start Date"
            v-model="new_event.date"
            prepend-icon="event"
            readonly
            :rules="[v => !!v || 'Required']"
          ></v-text-field>
          <v-date-picker v-model="new_event.date" no-title class="nomargin">
            <template slot-scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat color="primary" @click.native="cancel()">Cancel</v-btn>
                <v-btn flat color="primary" @click.native="save()">OK</v-btn>
              </v-card-actions>
            </template>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>

    <!-- TODO: make calendar / time pickers into its own vue component, for use with multi-day events -->
    <!-- Time -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Time<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm4 class="some-padding-top">
        <time-picker :date="new_event.date" :label="'Start Time:'" @changeTime="formattedTime => { new_event.time_start = formattedTime }"></time-picker>
      </v-flex>
      <v-flex xs12 sm4 class="some-padding-top">
        <time-picker :date="new_event.date" :label="'End Time:'" @changeTime="formattedTime => { new_event.time_end = formattedTime }"></time-picker>
      </v-flex>
    </v-layout>

    <!-- Event Image -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Image<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <input type="file" class="form-control" @change="onFileChange" ref="eventImage" id="event-image" name="event_image">
      </v-flex>
    </v-layout>

    <!-- Event Social Image -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Social Media Image:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <input type="file" class="form-control" id="event-social-image" name="event_social_image">
      </v-flex>
      <v-flex xs8 offset-xs3>
        <em>Image optimized for social media sharing (recommended size 1024X512 under 1MB)</em>
      </v-flex>
    </v-layout>

    <p><br></p>

    <!-- Venue -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Select a Venue<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <venue-picker ref="venuePicker" :venues="venues" @selectVenue="selectVenue"></venue-picker>
      </v-flex>
      <v-flex xs0 sm3></v-flex>
      <v-flex xs12 sm8>
        <p style="margin: 10px 0px 10px 0px; text-align: center;">OR</p>
      </v-flex>
      <!-- <v-flex xs4 sm2 style="margin-top: 6px">
        <v-btn color="info" @click="toggleVenueDropdown()">Add a Venue</v-btn>
      </v-flex> -->
    </v-layout>

    <!-- Add a Venue (collapsible content)-->
    <v-layout row>
      <v-flex xs0 sm3></v-flex>
      <v-flex xs12 sm8>
        <v-expansion-panel expand style="margin-bottom: 10px;">
          <v-expansion-panel-content ref="expansionPanelContent" style="padding: 0px 15px 0px 15px;">
            <div slot="header">Add a New Venue:</div>

            <!-- Venue Name -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Venue Name*" v-model="new_venue.name" :rules="[v => !!v || 'Name is required']"></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Venue Address -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Address*" v-model="new_venue.address" :rules="[v => !!v || 'Address is required']"></v-text-field>
              </v-flex>
            </v-layout>

            <!-- City -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="City*" v-model="new_venue.city" :rules="[v => !!v || 'City is required']"></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Zip -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Zip Code*" v-model="new_venue.zip" :rules="[v => !!v || 'Zip Code is required']"></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Neighborhood -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Neighborhood" v-model="new_venue.neighborhood"></v-text-field>
              </v-flex>
            </v-layout>

            <!-- G-maps Link -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Google Maps Link" v-model="new_venue.google_maps_link"></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs12 style="text-align: center">
                <v-btn color="success" :disabled="!venueRequiredFields" @click="submitNewVenue()">Add Venue</v-btn>
              </v-flex>
              <v-flex xs12 style="text-align: center">
                <img v-if="showVenueLoadingSpinner" class="loading-spinner" src="images/spinner.gif"></img>
              </v-flex>
            </v-layout>

          </v-expansion-panel-content>

        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <!-- Brief Description -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Brief Description<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field label="A brief description for short-attention-span humans and webcrawlers" v-model="new_event.brief_description"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Organizers -->
    <!-- <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Organizers:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field label="Please use commas to separate" v-model="new_event.organizers"></v-text-field>
      </v-flex>
    </v-layout> -->

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
        <h3 class="form-label">Your Contact Email<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field label="We will send you a confirmation when your event is added" v-model="new_event.organizer_contact" :rules="[v => !!v || 'Organizer Contact is required', v => isEmail(v) || 'Must be a valid email address']"></v-text-field>
      </v-flex>
    </v-layout>

    <h3>Full Event Description:</h3>
    <vue-editor id="vue-editor1" v-model="new_event.description"></vue-editor>

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

    <!-- SUBMIT BUTTON -->
    <v-layout row wrap>
      <v-flex xs12>
        <div class="text-xs-center">
          <v-btn :disabled="!eventRequiredFields || eventSubmitted" color="primary" class="deep-purple submission-btn" @click="UploadEvent">Submit Event</v-btn>
          <!-- <v-btn color="primary" class="deep-purple submission-btn" @click="showPromoTools = !showPromoTools">toggle</v-btn> -->
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="col-12 text-xs-center">
          <img v-if="showEventLoadingSpinner" class="loading-spinner" src="images/spinner.gif"></img>
        </div>
      </v-flex>
    </v-layout>

    <p>
      <br>
      <!-- hacking some space above mailchimp thing -->
      <br>
    </p>


    <!-- Promo tools -->
    <div class="collapsible-content" ref="promoTools" :class="{'expanded': showPromoTools}" style="margin-top: 10px">

      <h3 style="text-align: center">Thank you! Your event should be out of review and on our site within 24 hours.</h3>

      <h1>Event Promotion Tools:</h1>
      <p>
        Here is a summary of the information that you have entered for your event. We know that you need to send
        a bunch of emails for event promo and want to make this task easier. You can copy and paste the text below into your favorite email setup.
        If you have any suggestions for additional features to make your life easier just reach out to us at info[@]infinite[d0t]industries
      </p>
      <vue-editor id="vue-editor2" v-model="promoHTML"></vue-editor>





      <!--
      <v-layout row wrap>
        <v-flex xs1 sm1>
          <v-checkbox v-model="send_summary" hide-details class="shrink mr-2"></v-checkbox>
        </v-flex>
        <v-flex xs11 sm5>
          <p style="margin-top: 23px">Send summary to my email for review:</p>
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field v-model="send_summary_to"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs1 sm1>
          <v-checkbox v-model="send_summary_others" hide-details class="shrink mr-2"></v-checkbox>
        </v-flex>
        <v-flex xs11 sm5>
          <p style="margin-top: 23px">Send announcement to the following address(es):</p>
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field v-model="send_summary_others_emails"></v-text-field>
        </v-flex>
      </v-layout>
      -->
      <!-- <v-layout row>
        <div class="text-xs-center">
          <v-btn color="primary" @click="sendEmails">Send Promo Email</v-btn>
        </div>
      </v-layout> -->
    </div>

  </v-container>
</template>

<script>
  import Axios from 'axios'
  import { VueEditor, Quill } from 'vue2-editor'
  import VenuePicker from '../components/VenuePicker.vue'
  import TimePicker from '../components/TimePicker.vue'

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
          venue_name: "",
          venue_id: "",
          address: "",
          brief_description:"",
          description:"",
          website_link:"",
          eventbrite_link:"",
          fb_event_link:"",
          ticket_link:"",
          organizer_contact:""
        },
        imageChosen: false,
        showAddVenue: false,
        showPromoTools: false,
        promoHTML: "",
        eventSubmitted: false,
        new_venue: {
          name: "",
          address: "",
          city: "",
          zip: "",
          neighborhood: "",
          google_maps_link: ""
        },
        content: "",
        venues: [],
        showEventLoadingSpinner: false,
        showVenueLoadingSpinner: false,
        send_summary: false,
        send_summary_to: "",
        send_summary_others: false,
        send_summary_others_emails: ""
      }
    },
    methods: {
      UploadEvent: function(){

        const formData = new FormData()

        formData.append('event_data', JSON.stringify({
          ... this.new_event,
          organizers: this.new_event.organizers ? this.new_event.organizers.split(',') : []
        }))

        formData.append('image', document.getElementById('event-image').files[0])
        formData.append('social_image', document.getElementById('event-social-image').files[0])

        this.showEventLoadingSpinner = true;
        this.eventSubmitted = true; // to disable button and prevent multiple submissions

        Axios.post('/events/submit-new', formData).then( response => {
            this.showEventLoadingSpinner = false;

            if (response.data.status == "success") {
              this.showPromoTools = true;
              this.parseEventToHTML(response.data.data);
              this.$SmoothScroll(this.$refs.promoTools);

              // window.alert("Event submitted. Thank you! It should be out of review and on our site within 24 hours. Usually, much faster :)");
            }
            else{
              window.alert("Hmmm... something went wrong :( Can you ping the management at info@infinite.industries");
            }

          })
          .catch(function(error) {
            console.log(error)
            this.eventSubmitted = false;
            window.alert("Hmmm... something went wrong :( Can you ping the management at info@infinite.industries");
          })
      },
      submitNewVenue: function() {
        this.showVenueLoadingSpinner = true;
        Axios.post('/venues/submit-new', this.new_venue).then( response => {
          this.showVenueLoadingSpinner = false;
          this.$refs.expansionPanelContent.isActive = false;
          if (response.data.status == "success") {
            this.venues.push(response.data.venue);
            this.$refs.venuePicker.selectVenue(response.data.venue);
            this.new_venue = {
              name: "",
              address: "",
              city: "",
              zip: "",
              neighborhood: "",
              google_maps_link: ""
            }
          }
        }).catch( err => {
          console.log(err);
        })
      },
      selectVenue: function(venue) {
        console.log(venue);
        this.new_event.venue_id = venue.id;
        this.new_event.address = venue.address;
        this.new_event.venue_name = venue.name;
      },
      toggleVenueDropdown: function() {
        this.showAddVenue = !this.showAddVenue;
      },
      sendEmails: function() {
        console.log("Allan please send emails.");
      },
      // for use in promo tools. Takes an event object and makes it into pretty html
      parseEventToHTML: function(ii_event) {
        console.log(ii_event);

        //this.promoHTML = "testing \<h1\>Testing\<\/h1\>";

        this.promoHTML = `<h2>${ii_event.title}</h2>`;
        this.promoHTML += `<p><b>When: </b>${ii_event.when_date} ${ii_event.when_time}</p>`;
        this.promoHTML += `<p><b>Location: </b>${ii_event.address}</p> <p><br></p>`;
        this.promoHTML += `<img src="${ii_event.image}" width="450px" height="auto">`;

        if(ii_event.admission_fee!=="none"){
          this.promoHTML += `<p><b>Admission: </b>${ii_event.admission_fee}</p>`;
        }

        this.promoHTML += `<p><b>Description: </b>${ii_event.description}</p>`;
        this.promoHTML += `<p><b>Link for More Info: </b><a href="${ii_event.bitly_link}">${ii_event.bitly_link}</a></p>`;
        this.promoHTML += `<p><b>Organizer Contact: </b>${ii_event.organizer_contact}</p>`;

        console.log(this.promoHTML);

      },
      onFileChange: function() {
        // files.length will be a 0 for no image, 1 for image
        this.imageChosen = this.$refs.eventImage.files.length;
      },
      isEmail: function(text) {
        let regex = /\S+@\S+\.\S+/;
        return regex.test(text);
      }
    },
    mounted: function() {

      Axios.get('/venues').then( response => {
        this.venues = response.data.venues;
        console.log(this.venues);
      })
      .catch(function(error) {
        console.log(error)
        window.alert("Ooops... We were not able to load a list of venues. Please reload the page. If the problem continues, contact us. We will fix this ASAP!")
      })

      // window.fbAsyncInit = function() {
      //   FB.init({
      //     appId            : '132381870824243',
      //     autoLogAppEvents : true,
      //     xfbml            : true,
      //     version          : 'v2.10'
      //   });
      //   FB.AppEvents.logPageView();
      //
      //   console.log("Facebook API initialized")
      //
      // };
      //
      // // vvv what is this? vvv
      // (function(d, s, id){
      //    var js, fjs = d.getElementsByTagName(s)[0];
      //    if (d.getElementById(id)) {return;}
      //    js = d.createElement(s); js.id = id;
      //    js.src = "//connect.facebook.net/en_US/sdk.js";
      //    fjs.parentNode.insertBefore(js, fjs);
      //  }(document, 'script', 'facebook-jssdk'));


   },

   computed: {
     eventRequiredFields: function() {
       return this.new_event.title != "" &&
          this.new_event.date != "" &&
          this.new_event.time_start != "" &&
          this.new_event.time_end != "" &&
          this.new_event.venue_id != "" &&
          this.new_event.organizer_contact != "" &&
          this.isEmail(this.new_event.organizer_contact) &&
          this.imageChosen > 0 &&
          this.new_event.brief_description != "";
      },
      venueRequiredFields: function() {
        return this.new_venue.name != "" &&
          this.new_venue.address != "" &&
          this.new_venue.city != "" &&
          this.new_venue.zip != "";
      }
   },

   components: {
     'vue-editor': VueEditor,
     'venue-picker': VenuePicker,
     'time-picker': TimePicker
   }

  }
</script>

<style scoped>
.nomargin {
  margin: 0px;
}
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
.text-xs-center {
  margin: 0 auto;
  text-align: center;
}
.some-padding-top {
  padding-top: 22px;
}
#event-image, #event-social-image {
  margin-top: 20px;
}
.submission-btn{
  color:white;
}

#new-venue {
    font-weight: bold;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 5px;
}

.collapsible-content {
  padding-bottom: 0px;
  height: 0px;
  /* max-height: 0px; */
  overflow: hidden;
  transition: max-height 0.4s;
}
.expanded {
  height: auto;
  padding: 12px;
  max-height: auto; /* <-- this isn't ideal, need to approximate size of dropdown content for animation to work properly... */
}

.loading-spinner {
  text-align: center;
  height: 50px;
  vertical-align: top;
}

.required-field {
  color: red;
}

@media only screen and (max-width: 600px) {
  .form-label {
    text-align: left;
  }
}

/* #vue-editor2{
  height: 200px;
} */

</style>
