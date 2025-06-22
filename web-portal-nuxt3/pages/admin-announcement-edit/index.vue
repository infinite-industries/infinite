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

<script setup>
  import { useStore } from 'vuex'

  const store = useStore();

  useHead({
    title:  'Announcement Editor - Infinite Industries'
  })

  definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
  })

  const message = ref('')
  const error = ref('')
  const loading = ref(true)
  const announcement = ref(null)

  const currentAnnouncement = computed(() => {
    return store.getters.GetActiveAnnouncement;
  });

  onMounted(async () => {
    loading.value = true

    try {
      await store.dispatch('FindOrCreateActiveAnnouncement');

      if (currentAnnouncement.value) {
        message.value = currentAnnouncement.value.message
        announcement.value = currentAnnouncement.value
        setLoadSuccessState()
      } else {
        setLoadingFailState('could not establish the current active message')
      }
    } catch (error) {
      console.warn(error)
      setLoadingFailState('could not establish the current active message')
    }
  });

  function setLoadingFailState(errorMessage) {
    error.value = errorMessage;
    loading.value = false;
  }

  function clearMessage(event) {
    event.preventDefault();

    message.value = '';
    return updateMessage(event);
  }

  function setLoadSuccessState() {
    error.value = '';
    loading.value = false;
  }

  function updateMessage(event) {
    loading.value = true;
    event.preventDefault();

    return store.dispatch('UpdateActiveAnnouncement', { announcement: { ...announcement.value, message: message.value } })
      .then(() => {
        setLoadSuccessState()
      }).catch((error) => {
        setLoadingFailState(error.toString());
      })
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
