// Contact.vue
<template>
  <div class="container info-page">

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

import Axios from 'axios'

export default {
  data: function() {
    return {
      comment: '',
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    RouteTo: function(route_to_page){
      this.$router.push({ path: route_to_page })
    },

    ContactUs: function(){
      Axios.post('/contact', { name: this.name, email: this.email, comment: this.comment })
        .then(() => {
          // EventBus.$emit('SHOW_NOTIFICATION',{
          //   visible: true,
          //   type: 'info',
          //   message: "Message sent. Thank you!",
          // })

          this.ResetForm()

        })
        .catch(function (error) {
          console.log(error)
          // EventBus.$emit('SHOW_NOTIFICATION',{
          //   visible: true,
          //   type: 'info',
          //   message: "Hrrmm... unable to send your data. Email us directly at info@infinite.industries and we will look into this asap.",
          // })
        })
    },
    ResetForm: function(){
      this.name = ''
      this.email = ''
      this.comment = ''
      this.$refs.form.reset() // resets form validation
    }
  }
}
</script>

<style scoped>

  h1 {
    color: black;
    margin-bottom: 1rem;
  }

  form {
    font-family: "Open Sans", sans-serif;
  }

</style>
