// Contact.vue
<template>
  <div>
    <h1>Contact Us</h1>

          Comments, suggestions and bug reports highly appreciated!

          <v-form v-model="valid" lazy-validation>
          <v-text-field
            label="Your Name"
            v-model="name"
            :rules="nameRules"
            required
          ></v-text-field>
          <v-text-field
            label="Your E-mail"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
             v-model="comment"
             label="Your Text"
             multi-line
           ></v-text-field>

          </v-form>
          <div class="text-xs-right">
            <v-btn color="primary" class="deep-purple" dark @click="ContactUs()">Send</v-btn>
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
          const _self = this
          Axios.post('/contact', {name:_self.name, email:_self.email, comment:_self.comment})
            .then(function (_response) {
              // EventBus.$emit('SHOW_NOTIFICATION',{
              //   visible: true,
              //   type: 'info',
              //   message: "Message sent. Thank you!",
              // })

              _self.nameRules = []      // UGLY UGLY UGLY UGLY will try something slightly nicer laters
              _self.emailRules = []
              _self.name = ''
              _self.email = ''
              _self.comment = ''

            })
            .catch(function (error) {
              console.log(error);
              // EventBus.$emit('SHOW_NOTIFICATION',{
              //   visible: true,
              //   type: 'info',
              //   message: "Hrrmm... unable to send your data. Email us directly at info@infinite.industries and we will look into this asap.",
              // })
            });
        }
      }
  }
</script>

<style scoped>
  *{
    color: white;
  }
</style>
