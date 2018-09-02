<template>
<div id="form-wrapper">

  <h2>Submit Your Event:</h2>

  <i><span class="required-field">*</span> = required field</i>


  <v-container>

    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Title<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="calendar_event.title" :rules="[v => !!v || 'Title is required']"></v-text-field>
      </v-flex>
    </v-layout>

    <date-time-picker />

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
    </v-layout>

    <!-- Add a Venue (collapsible content)-->
    <add-new-venue />

    <!-- Brief Description -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Brief Description<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field class="brief-description" label="A brief description for short-attention-span humans and webcrawlers" v-model="calendar_event.brief_description"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Admission Fee -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Admission Fee:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="calendar_event.admission_fee"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Organizer Contact -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Your Contact Email<span class="required-field">*</span>:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field class="submitter-email" label="We will send you a confirmation when your event is added" v-model="calendar_event.organizer_contact" :rules="[v => !!v || 'Organizer Contact is required', v => isEmail(v) || 'Must be a valid email address']"></v-text-field>
      </v-flex>
    </v-layout>

    <br />

    <!-- Full Event Description -->
    <h3>Full Event Description:</h3>
    <vue-editor id="vue-editor1" v-model="calendar_event.description"></vue-editor>


    <v-layout row>
      <v-flex xs12>
        <p class="spacer">...</p>
      </v-flex>
    </v-layout>


    <!-- OPTIONAL FORM ELEMENTS -->
    <h2>Optional:</h2>
    <!-- Event Website link: -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Event Website Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="calendar_event.website_link"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Ticket Link -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Ticket Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="calendar_event.ticket_link"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Facebook Event Link -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Facebook Event Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="calendar_event.fb_event_link"></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Eventbrite Link -->
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <h3 class="form-label">Eventbrite Link:</h3>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field v-model="calendar_event.eventbrite_link"></v-text-field>
      </v-flex>
    </v-layout>


    <!-- SUBMIT BUTTON -->
     <v-layout row wrap v-if="user_action==='upload'">
       <v-flex xs12>
         <div class="text-xs-center">
           <v-btn color="grey" :disabled="false" :flat="false" :outline="false" depressed @click="UploadEvent()">Submit Event</v-btn>
           <!-- <v-btn v-if="!eventRequiredFields || eventSubmitted" dark outline >Submit Event</v-btn>
           <v-btn v-else depressed color="red" class="white--text" @click="UploadEvent">Submit Event</v-btn> -->

           <!-- <v-btn color="primary" class="deep-purple submission-btn" @click="showPromoTools = !showPromoTools">toggle</v-btn> -->
         </div>
       </v-flex>

       <!-- LOADING INDICATOR -->
       <v-flex xs12>
         <div class="col-12 text-xs-center">
           <img v-if="showEventLoadingSpinner" class="loading-spinner" src="images/spinner.gif"></img>
         </div>
       </v-flex>
     </v-layout>


     <!-- EDIT EVENT TOOLS -->
     <v-layout row wrap v-if="user_action==='edit'">
       <v-flex xs12>
         <div class="text-xs-center">
           <v-btn @click="UpdateEvent()">Save</v-btn>
           <v-btn @click="VerifyEvent()" v-if="user_role==='admin'">Verify</v-btn>
           <v-btn @click="ConfirmDeleteEvent()">Delete</v-btn>
         </div>
       </v-flex>
     </v-layout>

     <!-- CONFIRM EVENT DELETION -->
     <v-dialog v-model="dialog" persistent max-width="300">
       <v-card>
         <v-card-title class="headline">U shure you wanna delete the event?</v-card-title>
         <v-card-actions>
           <v-spacer></v-spacer>
           <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
           <v-btn color="green darken-1" flat="flat" @click.native="DeleteEvent()">Kill</v-btn>
         </v-card-actions>
       </v-card>
     </v-dialog>


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
    </div>

  </v-container>

</div>

</template>

<script>
  import Axios from 'axios'
  import moment from 'moment'
  import { VueEditor, Quill } from 'vue2-editor'

  import VenuePicker from './VenuePicker.vue'
  import DateTimePicker from './DateTimePicker.vue'
  import AddNewVenue from './AddNewVenue.vue'


  export default {
    props:['event_id', 'user_role', 'user_action'],
    // user_role --> admin, venue, regular
    // user_action --> upload, edit
    data: function () {
      return {
        dialog: false,

        // calendar_event: {},
        imageChosen: false,
        showPromoTools: false,
        promoHTML: "",
        eventSubmitted: false,
        content: "",
        venues: [],
        showEventLoadingSpinner: false,
        send_summary: false,
        send_summary_to: "",
        send_summary_others: false,
        send_summary_others_emails: ""
      }
    },
    methods: {
      TestMe: function(){
        console.log(this.calendar_event.title);
      },
      RouteTo: function(route_to_page){
        this.$router.push({path: route_to_page })
      },
      UpdateEvent: function(){
        console.log(this.calendar_event);
        this.$store.dispatch('UpdateEvent', {id:this.calendar_event.id, event_data:this.calendar_event})
      },
      ConfirmDeleteEvent: function(){
        this.dialog = true
      },
      DeleteEvent: function(){
        this.dialog = false
        this.$store.dispatch('DeleteEvent', {id:this.calendar_event.id})
        this.RouteTo('/admin')
      },
      VerifyEvent: function(){
        this.$store.dispatch('VerifyEvent', {id:this.calendar_event.id})
        this.RouteTo('/admin')
      },
      UploadEvent: function(){

        // this is a hack, I think
        // since only date_times array gets modified and saved to store,
        // we need to grab it from the store and add it to current calendar event
        this.calendar_event.date_times = this.$store.getters.GetAllDateTimes

        console.log("Uploading: -------- :\n"+JSON.stringify(this.calendar_event));

        // this.adjustTimeEnd(this.calendar_event);
        // this.calendar_event.additional_dates.forEach( eventDate => {
        //   this.adjustTimeEnd(eventDate);
        // })

        const formData = new FormData()

        // console.log(this.$store.getters.GetAllDateTimes);
        // formData.append('date_times', this.$store.getters.GetAllDateTimes)

        formData.append('event_data', JSON.stringify({
          ... this.calendar_event,
          organizers: this.calendar_event.organizers ? this.calendar_event.organizers.split(',') : []
        }))

        formData.append('image', document.getElementById('event-image').files[0])
        formData.append('social_image', document.getElementById('event-social-image').files[0])

        this.showEventLoadingSpinner = true;
        this.eventSubmitted = true; // to disable button and prevent multiple submissions

        Axios.post('/events/submit-new', formData).then( response => {
            this.showEventLoadingSpinner = false;
            this.showPromoTools = true;
            console.log("GOT BACK - " + JSON.stringify(response.data.data));
            this.parseEventToHTML(response.data.data);
            this.$SmoothScroll(this.$refs.promoTools);
          })
          .catch( error => {
            console.log(error)
            this.showEventLoadingSpinner = false;
            this.eventSubmitted = false;
            window.alert("Hmmm... something went wrong :( Can you ping the management at info@infinite.industries");
          })
      },
      selectVenue: function(venue) {
        //console.log(venue)
        this.calendar_event.venue_id = venue.id
        this.calendar_event.address = venue.address
        this.calendar_event.venue_name = venue.name
      },

      sendEmails: function() {
        console.log("Allan please send emails.") // Who is Allan?
      },
      // for use in promo tools. Takes an event object and makes it into pretty html
      parseEventToHTML: async function(ii_event) {
        //console.log(ii_event)

        let venueResp
        let venue

        try {
          venueResp = await Axios.get(`/venues/${ii_event.venue_id}`)
          venue = venueResp.data && venueResp.data.venue
        } catch (ex) {
          console.error(`could not fetch venue ${ii_event.venue_id}: "${ex}"`)
        }

        let when_date = moment(ii_event.time_start).format('dddd, MMMM Do, YYYY')
        let when_time = moment(ii_event.time_start).format('h:mma') + " - " + moment(ii_event.time_end).format('h:mma')

        this.promoHTML = `<h2>${ii_event.title}</h2>`
        this.promoHTML += `<p><b>When: </b>${when_date} ${when_time}</p>`
        this.promoHTML += `<p><b>Location: </b>${venue ? venue.address : 'none'}</p> <p><br></p>`
        this.promoHTML += `<img src="${ii_event.image}" width="450px" height="auto">`

        this.promoHTML += `<p><b>Admission: </b>${(ii_event.admission_fee || 'none')}</p>`

        this.promoHTML += `<p><b>Description: </b>${(ii_event.description || '')}</p>`
        this.promoHTML += `<p><b>Link for More Info: </b><a href="${ii_event.bitly_link}">${ii_event.bitly_link}</a></p>`
        this.promoHTML += `<p><b>Organizer Contact: </b>${ii_event.organizer_contact}</p>`

        // console.log(this.promoHTML)

      },
      onFileChange: function() {
        // files.length will be a 0 for no image, 1 for image
        this.imageChosen = this.$refs.eventImage.files.length
      },
      isEmail: function(text) {
        let regex = /\S+@\S+\.\S+/
        return regex.test(text)
      },

      addDate: function() {
        this.calendar_event.additional_dates.push({ time_start: "", time_end: "", title: `Day ${this.calendar_event.additional_dates.length+2}`})
        this.calendar_event.multi_day = true;
      },
      removeAdditionalDate: function(index) {
        this.calendar_event.additional_dates.splice(index, 1);
        if (this.calendar_event.additional_dates.length == 0) {
          this.calendar_event.multi_day = false;
        }
      },
      adjustTimeEnd: function(eventDate) {
        // if time_end is before time_start, assume that time_end should be during the next calendar day
        if (moment(eventDate.time_end).isBefore(moment(eventDate.time_start))) {
            eventDate.time_end = moment(eventDate.time_end).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
        }
      }
    },
    mounted: function() {

      if(this.user_action==='edit'){
        this.$store.dispatch('LoadCurrentEvent', this.event_id)
        //this.$refs.venuePicker.selectVenue(this.calendar_event.venue)

      }
      else{
        this.$store.dispatch('CreateNewEvent')
        console.log("ready to input event");
      }

      Axios.get('/venues').then( response => {     // need to move into vuex
        this.venues = response.data.venues;
        console.log(this.venues);
      })
      .catch(function(error) {
        console.log(error)
        window.alert("Ooops... We were not able to load a list of venues. Please reload the page. If the problem continues, contact us. We will fix this ASAP!")
      })

   },

   computed: {
     calendar_event: function(){
       if(this.$store.getters.GetCurrentEvent===undefined){
         return {}
       }
       else{
         return this.$store.getters.GetCurrentEvent
       }

     },
     eventRequiredFields: function() {
       return this.calendar_event.title != "" &&
          this.calendar_event.date != "" &&
          this.calendar_event.time_start != "" &&
          this.calendar_event.time_end != "" &&
          this.calendar_event.venue_id != "" &&
          this.calendar_event.organizer_contact != "" &&
          this.isEmail(this.calendar_event.organizer_contact) &&
          this.imageChosen > 0 &&
          this.calendar_event.brief_description != "";
      }
   },

   components: {
     'vue-editor': VueEditor,
     'venue-picker': VenuePicker,
     'add-new-venue': AddNewVenue,
     'date-time-picker': DateTimePicker
   }

  }
</script>




<style scoped>

#form-wrapper{
  color: black;
  background-color: white;
  width:90%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 1.1em;
  border-radius: 10px;
}

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

#dotted-placeholder {
  height: 100%;
  min-height: 50px;
  width: 100%;
  outline: 1px dashed rgb(210, 210, 210)
}

</style>
