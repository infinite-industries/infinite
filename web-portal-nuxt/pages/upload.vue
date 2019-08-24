<template>
  <form method="POST" action="/internal-api/images" @submit.prevent="onSubmit">
    <label for="uploadType">UploadType</label>
    <select name="uploadType" id="uploadType" v-model="uploadType" required>
      <option value="event">Event</option>
    </select>
    <label for="hero">Main (hero) image</label>
    <input type="file" name="hero" id="hero" ref="hero" required>
    <label for="social">Social image</label>
    <input type="file" name="social" id="social" ref="social">
    <br>
    <button type="submit">Upload</button>
    <div class="status" v-if="status">Status: {{ status }}</div>
  </form>
</template>

<script>
  import ImageUploadService from '@/services/ImageUploadService'
  export default {
    data() {
      return {
        status: '',
        uploadType: 'event'
      }
    },
    mounted() {
      if (window) {
        window.alert(
          'This route is for testing only and should be deleted before merging the refactor'
        )
      }
    },
    methods: {
      onSubmit() {
        if (this.$refs.hero.files.length) {
          this.status = 'uploading'
          ImageUploadService.forEvent(
            this.$refs.hero.files[0],
            this.$refs.social.files[0]
          ).then((response) => {
            this.status = 'Upload complete'
            console.log(response.data)
          }).catch((error) => {
            this.status = 'Error'
            console.error(error)
          }).finally(() => {
            setTimeout(() => { this.status = '' }, 10000)
          })
        } else {
          this.status = 'Invalid form; select a main image'
        }
      }
    }
  }
</script>

<style scoped>
  form {
    padding: 1em;
    background-color: white;
  }
  form label {
    display: block;
  }
</style>
