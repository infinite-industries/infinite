<template>
  <div id="form-wrapper">

    <h2 v-if="user_action==='upload'">Submit Your Event:</h2>
    <h2 v-else>Edit Your Event:</h2>

    <i><span class="required-field">*</span> = required field</i>

    <v-container>

      <!-- Title -->
      <v-layout row wrap>
        <v-flex xs12 sm3>
          <h3 class="form-label">Event Title<span class="required-field">*</span>:</h3>
        </v-flex>
        <v-flex xs12 sm8>
          <v-text-field v-model="calendar_event.title" :rules="[v => !!v || 'Title is required']" class="event-title"></v-text-field>
        </v-flex>
      </v-layout>

      <!-- Is event online / remote? -->
      <v-layout row wrap>
        <v-flex xs0 sm3></v-flex>
        <v-flex xs12 sm4 md3>
          <v-checkbox v-model="eventIsRemote" label="Online Event" />
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-checkbox v-model="eventIsOnline" label="Online Resource / Long-term Project" @change="onOnlineChange" />
        </v-flex>
        <v-flex xs8 offset-xs3>
          <em>Online events occur at a particular time. Online Resources are always available (like a website or a link to a video).</em>
        </v-flex>
      </v-layout>

      <v-expansion-panel expand v-model="showDateTimePicker">
        <v-expansion-panel-content>
          <date-time-picker v-model="calendar_event.date_times" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Event Image -->
      <v-layout row wrap>
        <v-flex xs12 sm3>
          <h3 class="form-label">Event Image<span class="required-field">*</span>:</h3>
        </v-flex>
        <v-flex xs12 sm8>
          <div v-if="user_action === 'edit' && !imageChosen" class="preview-image">
            <img v-if="calendar_event.image" :src="calendar_event.image" alt="">
          </div>
          <input
            type="file"
            accept="image/*"
            class="form-control"
            ref="eventImage"
            id="event-image"
            name="event_image"
            @change="onFileChange('event')"
          >
          <v-btn
            v-if="user_action === 'edit' && imageChosen"
            small
            @click="onFileClear('event')"
          >Remove</v-btn>
        </v-flex>
      </v-layout>

      <!-- Event Social Image -->
      <!-- <v-layout row wrap>
        <v-flex xs12 sm3>
          <h3 class="form-label">Social Media Image:</h3>
        </v-flex>
        <v-flex xs12 sm8>
          <div v-if="user_action === 'edit' && !socialImageChosen" class="preview-image">
            <img v-if="calendar_event.social_image" :src="calendar_event.social_image" alt="">
            <span v-if="!calendar_event.social_image">Not provided</span>
          </div>
          <input
            type="file"
            accept="image/*"
            class="form-control"
            id="event-social-image"
            name="event_social_image"
            ref="eventSocialImage"
            @change="onFileChange('social')"
          >
          <v-btn
            v-if="user_action === 'edit' && socialImageChosen"
            small
            @click="onFileClear('social')"
          >Remove</v-btn>
        </v-flex>
        <v-flex xs8 offset-xs3>
          <em>Image optimized for social media sharing (recommended size 1024X512 under 1MB)</em>
        </v-flex>
      </v-layout>

      <p><br></p> -->

      <!-- Venue -->
      <v-layout row wrap>
        <v-flex xs12 sm3>
          <h3 class="form-label">Select a Venue<span class="required-field">*</span>:</h3>
        </v-flex>
        <v-flex xs12 sm8>
          <venue-picker ref="venuePicker" :venues="venues" :initial_venue_id="calendar_event.venue_id" @selectVenue="selectVenue"></venue-picker>
        </v-flex>
        <v-flex xs0 sm3></v-flex>
        <v-flex xs12 sm8>
          <p style="margin: 10px 0px 10px 0px; text-align: center;">OR</p>
        </v-flex>
      </v-layout>

      <!-- Add a Venue (collapsible content)-->
      <add-new-venue @newVenue="newVenue" />

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

      <v-layout row wrap>
        <v-flex xs12 sm3>
          <h3 class="form-label">Tags:</h3>
        </v-flex>
        <v-flex xs12 sm8>
          <v-combobox v-model="generalTags" multiple chips deletable-chips :items="suggestedTags" />
        </v-flex>
      </v-layout>

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

      <!-- Status (postponed / cancelled) -->
      <v-layout row wrap v-if="user_action==='edit'" class="status-container">
        <v-flex xs12 sm3>
          <h3 class="form-label">Status Flags:</h3>
        </v-flex>
        <v-flex xs12 sm3 md2>
          <v-checkbox v-model="eventIsPostponed" label="Postponed" />
        </v-flex>
        <v-flex xs12 sm3 md2>
          <v-checkbox v-model="eventIsCancelled" label="Cancelled" />
        </v-flex>
      </v-layout>

      <!-- SUBMIT BUTTON -->
      <v-layout row wrap v-if="user_action==='upload'" class="submit-container">
        <v-flex xs12>
          <div class="text-xs-center">
            <v-btn
              color="grey"
              :disabled="!eventRequiredFields"
              :flat="false"
              :outline="!eventRequiredFields"
              depressed
              @click="PreviewEvent"
            >Preview Event</v-btn>
          </div>
        </v-flex>

        <!-- LOADING INDICATOR -->
        <v-flex xs12>
          <div class="col-12 text-xs-center">
            <img v-if="showEventLoadingSpinner" class="loading-spinner" src="~/assets/images/spinner.gif">
          </div>
        </v-flex>
      </v-layout>

      <!-- EDIT EVENT TOOLS -->
      <v-layout row wrap v-if="user_action==='edit'" class="edit-container">
        <v-flex xs12>
          <div class="text-xs-center">
            <v-btn @click="UpdateEvent()">Save</v-btn>
            <v-btn @click="VerifyEvent()" v-if="!calendar_event.verified && user_role==='admin'" class="btn-verify">Verify</v-btn>
            <v-btn @click="ConfirmDeleteEvent()">Delete</v-btn>
          </div>
        </v-flex>
      </v-layout>

      <!-- PROMPT SAVE IF UNSAVED CHANGES ON VERIFICATION -->
      <v-dialog v-model="dirtyOnVerifyDialog" persistent max-width="300">
        <v-card>
          <v-card-title class="headline">Verifying event will not save your edits - click Save too</v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" flat="flat" @click.native="dirtyOnVerifyDialog = false">Close</v-btn>
            <v-btn color="green darken-1" @click.native="dirtyOnVerifyDialog = false; UpdateEvent()">Save Now</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <!-- Submission error -->
      <div class="collapsible-content submission-error" ref="submitError" :class="{ 'expanded': showSubmitError }">
        <h3 style="text-align: center">
          Hmmm... something went wrong :( Can you ping the management at <a href="mailto:info@infinite.industries">info@infinite.industries</a>?
        </h3>
      </div>

    </v-container>

  </div>

</template>

<script>
  import isEqual from 'lodash.isequal'
  // import VueEditor from 'vue2-editor'

  import VenuePicker from './VenuePicker.vue'
  import DateTimePicker from './DateTimePicker.vue'
  import AddNewVenue from './AddNewVenue.vue'
  // import uploadcare from 'uploadcare-widget'

  import { ApiService } from '@/services/ApiService'
  import ImageUploadService from '@/services/ImageUploadService'

  const CONTROL_TAGS = ['remote', 'online-resource', 'postponed', 'cancelled']

  const boolToTag = tag => ({
    get: function () {
      return this.calendar_event.tags && this.calendar_event.tags.includes(tag)
    },
    set: function (newValue) {
      if (newValue) {
        if (!this.calendar_event.tags.includes(tag)) this.calendar_event.tags.push(tag)
      } else {
        this.calendar_event.tags.splice(this.calendar_event.tags.indexOf(tag), 1)
      }
    }
  })

  export default {
    props: ['event_id', 'user_role', 'user_action', 'reviewOrg'],
    // user_role --> admin, venue, regular
    // user_action --> upload, edit
    data: function () {
      return {
        dialog: false,
        dirtyOnVerifyDialog: false,

        calendar_event: null,
        imageChosen: false,
        socialImageChosen: false,
        showSubmitError: false,
        eventSubmitted: false,
        content: '',
        showEventLoadingSpinner: false,
        send_summary: false,
        send_summary_to: '',
        send_summary_others: false,
        send_summary_others_emails: ''
      }
    },
    created: function () {
      const new_event = this.$store.getters.GetCurrentEvent
      this.calendar_event = Object.assign({}, new_event, {
        date_times: new_event.date_times.map(dt => ({ ...dt })),
        tags: new_event.tags ? new_event.tags.map(t => t) : []
      })
    },
    methods: {
      UpdateEvent: function () {
        console.log(this.calendar_event)
        this.showEventLoadingSpinner = true

        new Promise((resolve, reject) => {
          // if new images have been selected, upload them
          if (
            this.$refs.eventImage.files.length > 0
            // || this.$refs.eventSocialImage.files.length > 0
          ) {
            ImageUploadService.forEvent(
              this.$refs.eventImage.files[0]
              // this.$refs.eventSocialImage.files[0]
            ).then(resolve).catch(reject)
          } else resolve({})
        }).then((response) => {
          // if response, update event prior to saving
          const data = response.data
          if (data && data.hero) this.calendar_event.image = data.hero
          if (data && data.social) this.calendar_event.social_image = data.social

          this.$store.dispatch('admin/UpdateEvent', {
            id: this.calendar_event.id,
            event_data: this.calendar_event,
            idToken: this.$auth.$storage.getState('_token.auth0')
          }).finally(() => { this.showEventLoadingSpinner = false })
        }).catch((error) => {
          console.error(error)
          this.showSubmitError = true
        })
      },
      ConfirmDeleteEvent: function () {
        this.dialog = true
      },
      DeleteEvent: function () {
        this.dialog = false
        this.showEventLoadingSpinner = true
        this.$store.dispatch('admin/DeleteEvent', {
          id: this.calendar_event.id,
          idToken: this.$auth.$storage.getState('_token.auth0')
        })
          .then(() => { this.$router.push('/admin') })
          .finally(() => { this.showEventLoadingSpinner = false })
      },
      VerifyEvent: function () {
        this.showEventLoadingSpinner = true

        const isDirty = !isEqual(this.calendar_event, this.$store.getters.GetCurrentEvent)

        this.$store.dispatch('admin/VerifyEvent', {
          id: this.calendar_event.id,
          idToken: this.$auth.$storage.getState('_token.auth0')
        })
          .then(() => {
            this.showEventLoadingSpinner = false
            if (isDirty) {
              // workaround to avoid accidentally unverifying
              this.calendar_event.verified = true
              this.dirtyOnVerifyDialog = true
            } else {
              this.$router.push('/admin')
            }
          })
          .catch(() => {
            this.showEventLoadingSpinner = false
          })
      },
      PreviewEvent: function () {
        const event = { ...this.calendar_event }
        event.venue = event.venue_id ? this.venues.find(v => v.id === event.venue_id) : null
        ImageUploadService.asDataUrl(this.$refs.eventImage.files[0]).then((imageUrl) => {
          event.image = imageUrl
          this.$emit('preview', event)
        })
      },
      UploadEvent: function () {
        console.log('Uploading: -------- :\n' + JSON.stringify(this.calendar_event))

        this.showEventLoadingSpinner = true
        this.eventSubmitted = true // to disable button and prevent multiple submissions
        this.showSubmitError = false

        const event = {
          ...this.calendar_event,
          organizers: this.calendar_event.organizers ? this.calendar_event.organizers.split(',') : [],
          reviewed_by_org: this.reviewOrg ? this.reviewOrg : null
        }

        ImageUploadService.forEvent(
          this.$refs.eventImage.files[0]
          // this.$refs.eventSocialImage.files[0]
        ).then((response) => {
          event.image = response.data.hero
          if (response.data.social) event.social_image = response.data.social

          return ApiService.post('/events', event)
        }).then((response) => {
          this.showEventLoadingSpinner = false
          console.log('GOT BACK - ' + JSON.stringify(response.data))
          this.$emit('submitted')
        }).catch((error) => {
          console.log(error)
          this.showEventLoadingSpinner = false
          this.eventSubmitted = false
          this.$emit('error')
        })
      },
      selectVenue: function (venue) {
        // console.log(venue)
        this.calendar_event.venue_id = venue.id
        this.calendar_event.address = venue.address
        this.calendar_event.venue_name = venue.name
      },
      newVenue: function (venue) {
        this.calendar_event.venue_id = venue.id
        this.calendar_event.address = venue.address
        this.calendar_event.venue_name = venue.name
        this.$refs.venuePicker.handleNewVenue(venue)
      },

      sendEmails: function () {
        console.log('Allan please send emails.') // Who is Allan?
      },
      onOnlineChange: function () {
        if (this.eventIsOnline) {
          this.calendar_event.date_times = []
        }
      },
      onFileChange: function (type) {
        // files.length will be a 0 for no image, 1 for image
        if (type === 'event') {
          this.imageChosen = this.$refs.eventImage.files.length
        }
        // } else if (type === 'social') {
        //   this.socialImageChosen = this.$refs.eventSocialImage.files.length
        // }
      },
      onFileClear: function (type) {
        if (type === 'event') {
          this.$refs.eventImage.value = null
          this.imageChosen = 0
        } else if (type === 'social') {
          this.$refs.eventSocialImage.value = null
          this.socialImageChosen = 0
        }
      },
      isEmail: function (text) {
        const regex = /\S+@\S+\.\S+/
        return regex.test(text)
      },
      hasValidDateTimes: function () {
        if (this.calendar_event.hasOwnProperty('date_times')) {
          // online resources don't have fixed times
          if (this.calendar_event.tags.includes('online-resource')) return this.calendar_event.date_times.length === 0
          else return this.calendar_event.date_times.length > 0
        } else {
          return false
        }
      },
      addDate: function () {
        this.calendar_event.additional_dates.push({ time_start: '', time_end: '', title: `Day ${this.calendar_event.additional_dates.length + 2}` })
        this.calendar_event.multi_day = true
      },
      removeAdditionalDate: function (index) {
        this.calendar_event.additional_dates.splice(index, 1)
        if (this.calendar_event.additional_dates.length === 0) {
          this.calendar_event.multi_day = false
        }
      }
    },

    computed: {
      venues: function () {
        if (!this.$store.getters.GetActiveVenues) {
          return []
        }

        return this.$store.getters.GetActiveVenues
      },

      eventIsRemote: boolToTag('remote'),
      eventIsOnline: boolToTag('online-resource'),

      eventIsPostponed: boolToTag('postponed'),
      eventIsCancelled: boolToTag('cancelled'),

      showDateTimePicker: function () {
        return [!this.eventIsOnline]
      },

      // support for editing the tags on the event without considering the ones we
      // use for specific functionality, which have their own dedicated UI controls
      generalTags: {
        get: function () {
          return this.calendar_event.tags
            // filter out control tags, which have dedicated UI for adding/removing them
            ? this.calendar_event.tags.filter(tag => !CONTROL_TAGS.includes(tag))
            : []
        },
        set: function (newValue) {
          // update with any control tags applied
          if (this.calendar_event.tags.length > 0) {
            CONTROL_TAGS.forEach((tag) => {
              if (this.calendar_event.tags.includes(tag)) newValue.push(tag)
            })
          }
          this.calendar_event.tags = newValue
        }
      },

      suggestedTags: function () {
        return [
          'gallery',
          'music',
          'theater',
          'film',
          'talk',
          'festival'
        ]
      },

      eventRequiredFields: function () {
        return this.calendar_event.title !== '' &&
          // this.calendar_event.date != "" &&
          // this.calendar_event.time_start != "" &&
          // this.calendar_event.time_end != "" &&
          this.hasValidDateTimes() &&
          this.calendar_event.venue_id !== '' &&
          this.calendar_event.organizer_contact !== '' &&
          this.isEmail(this.calendar_event.organizer_contact) &&
          this.imageChosen > 0 &&
          this.calendar_event.brief_description !== ''
      }
    },
    components: {
      // 'vue-editor': VueEditor,
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
  /* width:90%; */
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
#event-image, #event-social-image, .preview-image {
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

.preview-image img {
  max-width: 150px;
}

.preview-image span {
  vertical-align: top;
  line-height: 2;
}

.status-container .v-input--checkbox {
  margin-top: 22px;
}

</style>
