<template>

  <div class="container info-page">
    <v-app>
      <div class="content">
        <div class="main">
          <template v-if="mode=='edit'">
            <h1>Submit Your Event</h1>
            <p>
              Please enter your event information below.
              As soon as we review your submission, we will post it to the site and send you a confirmation email.
            </p>
          </template>

          <template v-else-if="mode=='preview'">
            <h1 ref="previewHeading">Preview</h1>
            <div class="preview-message">
              <p>Please review the information for your event</p>
              <div class="preview-controls">
                <button class="ii-button" @click="submitEventForReal">Submit for Review</button>
                <button class="ii-button secondary-button" @click="changeTheEvent">Back to Editing</button>
              </div>
            </div>
          </template>

          <template v-else-if="mode == 'pending'">
            <h1 class="centered-header">Submitting...</h1>
            <div>
              <img class="loading-spinner" src="~/assets/images/spinner.gif">
            </div>
          </template>

          <template v-else-if="mode == 'success'">
            <h1 class="centered-header">Thank you!</h1>
            <div class="centered-message">
              <h3>Your event is in review with one of our site admins and will post to the site within 24 hours.</h3>
              <p>We will reach out to you if we have any questions via the email you provided in your submission.</p>
              <div class="button-wrapper">
                <button class="ii-button secondary-button" @click="newSubmission">SUBMIT ANOTHER EVENT</button>
              </div>
            </div>
          </template>

          <template v-else-if="mode == 'error'">
            <h1 class="centered-header">
              Hmmm... something went wrong :(
            </h1>

            <div class="infinite-submission-form__error-info-section">
              <p
                class="infinite-submission-form__error-message"
                v-if="submissionErrorMessage !== null"
              >
                {{submissionErrorMessage}}
              </p>

              <p class="infinite-submission-form__report-problem-message">
                Please ping the management at <a href="mailto:info@infinite.industries">info@infinite.industries</a> or
                go back and try again.
              </p>

              <button
                class="ii-button"
                @click="handleErrorDismissed()"
              >
                Back To Form
              </button>
            </div>
          </template>

        </div>
        <div v-if="partner" class="partner">
          <div>Partnering with</div>
          <img :src="partner.logo" :alt="partner.name" width="200" />
        </div>
      </div>
      <client-only>
        <!-- this needs to be v-show and not v-if because if we destroy and recreate it -->
        <!-- it'll reset the form content -->
        <submission-form
          v-show="mode == 'edit'"
          :user_action="'upload'"
          :user_role="'regular'"
          :review-org="partner ? partner.id : null"
          ref="form"
          @preview="onPreview"
          @submitted="mode = 'success'"
          @error="handleSubmissionError"
        />
        <submission-preview
          v-if="mode == 'preview'"
          :event="previewEvent"
          @submit="submitEventForReal"
          @edit="changeTheEvent"
        />
        <!-- No condition here for mode == 'success' -->
        <!-- because all we need is what's in the paragraph above -->
      </client-only>
    </v-app>
  </div>

</template>

<script>
  import SubmissionForm from '@/components/SubmissionForm.vue'
  import SubmissionPreview from '@/components/SubmissionPreview'
  import PartnerService from '@/services/PartnerService'
  import { FETCH_ACTIVE_VENUES } from '../store/venues'

  export default {
    layout: 'no-mobile-cta',
    data: function () {
      return {
        mode: 'edit',
        previewEvent: null,
        partner: null,
        submissionErrorMessage: null
      }
    },
    asyncData: function ({ query }) {
      const partner = PartnerService.getPartnerForQuery(query.partner)
      return partner ? { partner } : {}
    },
    fetch: function ({ store }) {
      store.dispatch('CreateNewEvent')
      return store.dispatch(FETCH_ACTIVE_VENUES)
    },
    // sometimes users navigate away without submitting
    // if the form is partially filled, we can try to warn them and give them
    // a chance to abort the nav
    // mounted/beforeDestroy handle the "close tab / window" case...
    mounted: function () {
      if (window) {
        window.addEventListener('beforeunload', this.promptIfInProgress)
      }
    },
    beforeDestroy: function () {
      if (window) {
        window.removeEventListener('beforeunload', this.promptIfInProgress)
      }
    },
    // ...and beforeRouteLeave handles the SPA routing case
    beforeRouteLeave: function (from, to, next) {
      if (this.isDirtyOrPending()) {
        console.log('warning user that incomplete is not submitted')
        const sure = window.confirm('You have unsaved changes. Sure?')
        next(sure ? undefined : false)
      } else next()
    },
    methods: {
      onPreview: function (event) {
        this.previewEvent = event
        this.mode = 'preview'
        this.$nextTick(() => this.$scrollTo(this.$refs.previewHeading, { offset: -200 }))
      },
      submitEventForReal: function () {
        this.previewEvent = null
        this.mode = 'pending'
        this.$refs.form.UploadEvent()
      },
      changeTheEvent: function () {
        this.previewEvent = null
        this.mode = 'edit'
      },
      newSubmission: function () {
        window.location.reload()
      },
      isDirtyOrPending: function () {
        return (
          this.$refs?.form?.isDirty() &&
          // after submission, form will still be dirty, but we no longer care
          this.mode !== 'success' &&
          this.mode !== 'error'
        ) || this.mode === 'pending'
      },
      promptIfInProgress: function (event) {
        if (this.isDirtyOrPending()) {
          console.log('warning user that incomplete event is not submitted')
          // preventing default is the primary trigger for stopping unload
          event.preventDefault()
          // but some browsers are looking for a string value either returned
          // or assigned to returnValue, (of course they don't use it for
          // anything, though)
          // eslint-disable-next-line no-return-assign
          return event.returnValue = 'You have unsaved changes. Sure?'
        }
      },
      handleSubmissionError: function({ error }) {
        this.mode = 'error'

        const errorResp = error?.response

        if (
          errorResp !== null &&
          errorResp !== undefined &&
          !!errorResp?.data?.message
        ) {
          this.submissionErrorMessage = errorResp.data.message
        }
      },
      handleErrorDismissed: function() {
        this.submissionErrorMessage = null
        this.mode = 'edit'
      }
    },
    components: {
      'submission-form': SubmissionForm,
      'submission-preview': SubmissionPreview
    }
  }
</script>

<style scoped>
  .container {
    width: 95%;
    max-width: unset;
  }

  .content {
    display: flex
  }

  .content .main {
    flex-grow: 1;
  }

  .content .partner {
    margin: 0 50px;
  }

  .ii-button {

    background-color: #6cba70;
    font-family: "Open Sans",sans-serif;
    color: #000;
    border: 2px solid black;
    border-radius: 3px;
    margin: 8px;
    padding: 10px;
    font-size: 14px;
  }

  .secondary-button {
    background-color: #d8d7d7;
    border: 1px solid black;
    padding: 11px;
  }

  .preview-message {
    display: inline-flex;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .preview-message > p {
    align-self: end;
  }

  .preview-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    background-color: black;
  }

  .preview-controls .ii-button {
    min-width: 250px;
    border-radius: 10px;
  }

  @media only screen and (min-width: 640px) {
    .preview-controls {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }

  .centered-header {
    text-align: center;
  }

  .centered-message {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }

  .button-wrapper {
    margin-top: 40px;
    text-align: center;
  }

  .loading-spinner {
    display: block;
    margin: 35px auto 0;
    height: 150px;
  }

  .infinite-submission-form__error-info-section {
    text-align: center;
  }

  .infinite-submission-form__error-message {
    color: red;
  }
</style>
