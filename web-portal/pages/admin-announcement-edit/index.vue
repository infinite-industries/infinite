<template>
  <client-only>
    <div>
      <div v-if="loading" class="container loading-container">
        <img class="loading-spinner" src="~/assets/images/spinner.gif">
      </div>

      <div class="container admin-announcement-editor-page">
        <div class="error-wrapper">
          <span class="error">{{ error }}</span>
        </div>

        <div v-if="!loading" class="announcement-content">
          <label>
            Announcement:
            <textarea v-model="message" placeholder="enter announcement text here"></textarea>
          </label>

          <div class="announcement-controls">
            <button v-on:click="updateMessage($event)">
              Update Announcement
            </button>

            <button v-on:click="clearMessage($event)">
              Clear Announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
  export default {
    name: 'admin-announcement-edit',
    middleware: 'auth',
    head: function () {
      return {
        title: 'Announcement Editor - Infinite Industries'
      }
    },
    computed: {
      currentAnnouncement: function () {
        return this.$store.getters.GetActiveAnnouncement
      }
    },
    data: function () {
      return {
        message: '',
        error: '',
        loading: true,
        announcement: null
      }
    },
    fetch: function () {
      this.loading = true
      const idToken = this.$auth.$storage.getState('_token.auth0')

      return this.$store.dispatch('FindOrCreateActiveAnnouncement', { idToken })
        .then(() => {
          if (this.currentAnnouncement) {
            this.message = this.currentAnnouncement.message
            this.announcement = this.currentAnnouncement
            this.setLoadSuccessState()
          } else {
            this.setLoadingFailState('could not establish the current active message')
          }
        })
        .catch((error) => {
          this.setLoadingFailState(error.toString())
        })
    },
    methods: {
      updateMessage: function uupdateMessage(event) {
        this.loading = true
        event.preventDefault()

        const idToken = this.$auth.$storage.getState('_token.auth0')
        const message = this.message

        const announcement = { ...this.announcement, message }

        return this.$store.dispatch('UpdateActiveAnnouncement', { announcement, idToken })
          .then(() => {
            this.setLoadSuccessState()
          }).catch((error) => {
            this.setLoadingFailState(error.toString())
          })
      },
      clearMessage: function clearMessage(event) {
        event.preventDefault()

        this.message = ''
        return this.updateMessage(event)
      },
      setLoadSuccessState() {
        this.error = ''
        this.loading = false
      },
      setLoadingFailState(errorMessage) {
        this.error = errorMessage
        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .loading-container, .admin-announcement-editor-page {
    width: 95%;
    max-width: unset;
  }

  .admin-announcement-editor-page {
    background: white;
    color: black;
    border-radius: 10px;
  }

  .announcement-content {
    width: 100%;
  }

  .error {
    color: darkred;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .announcement-content textarea {
    width: 100%;
    height: 250px;
    border: 1px solid;
    margin-top: 0.5em;
    margin-bottom: 1em;
  }

  .announcement-controls button {
    border-bottom: 1px solid;
    margin-right: 1em;
  }

  .loading-spinner {
    text-align: center;
    height: 50px;
    vertical-align: top;
  }
</style>
