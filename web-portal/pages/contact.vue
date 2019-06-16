<template>
  <div class="container info-page">
    <div v-show="dialog" id="confirmation-message">
      <div id="close" @click="DialogClose" style="font-family: 'Open Sans', sans-serif; font-size: 0.8em;">X</div>
      <p>Thank you for contacting us!</p>
      <p>:)</p>
      <p>We will try to get back to you within 24hours.</p>
    </div>

    <h1>Contact Us</h1>

    <p>
      Comments, suggestions and bug reports highly appreciated!
    </p>

    <div class="container">
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="ContactUs()">
        <v-layout row>
          <v-flex xs12 sm11>
            <v-text-field label="Your Name" v-model="name" :rules="nameRules" required></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12 sm11>
            <v-text-field label="Your E-mail" v-model="email" :rules="emailRules" required></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12 sm11>
            <v-textarea label="Your Text" v-model="comment" multi-line></v-textarea>
          </v-flex>
        </v-layout>

        <v-btn color="grey" type="submit">Send</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        comment: '',
        valid: false,
        name: '',
        nameRules: [
          v => !!v || 'Name is required'
        ],
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        dialog: false
      }
    },
    methods: {
      ContactUs: function () {
        this.$axios.post('https://infinite-industries-aux.azurewebsites.net/api/Contact', { 'name': this.name, 'email': this.email, 'comment': this.comment })
          .then(() => {
            this.ResetForm()
            this.dialog = true
          })
          .catch(function (error) {
            console.log('Message from server:' + error)
            alert('Our apologies, can\'t connect to the message server. Please consider contacting us on social media of your choice regarding your request and this bug. Thank you!')
          })
      },
      DialogClose: function () {
        this.dialog = false
      },
      ResetForm: function () {
        this.name = ''
        this.email = ''
        this.comment = ''
        this.$refs.form.reset() // resets form validation
        this.dialog = true
      }
    }
  }
</script>

<style scoped>
  #confirmation-message{
    background: #000;
    color: #fff;
    max-width: 250px;
    left: 50%;
    top: 20%;
    margin-left: -125px;
    margin-top: -125px;
    padding: 10px;

    position: absolute;
    margin-top: 120px;
    z-index: 20;

    text-align: center;

  }
  #close{
    text-align: right;
    padding-bottom: 10px;
  }
</style>
