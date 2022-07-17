<template>
  <div class="container login-page">
    <h1>Login</h1>

    <div v-if="errorMessage !== null" class="login-page__errors">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="onLoginClick">
      <div class="login-page__field">
        <label class="login-page__username-label">username: </label>
        <input
          class="login-page__username"
          v-model="username"
          type="text"
          placeholder="username"
        />
      </div>

      <div class="login-page__field">
        <label class="login-page__password-label">password: </label>
        <input
          class="login-page__password"
          v-model="password"
          type="password"
          placeholder="password"
        />
      </div>

      <div class="login-page__actions">
        <input
          type="submit"
          class="login-page__login-btn"
          value="Login"
        >
      </div>
    </form>
  </div>
</template>

<script>
  import getToken from '../helpers/getToken'

  export default {
    name: 'LoginPage',
    components: {},
    data: function () {
      return {
        username: '',
        password: '',
        errorMessage: null
      }
    },
    methods: {
      onLoginClick: function () {
        const creds = {
          username: this.username,
          password: this.password
        }

        this.$auth.loginWith('local', {
          data: creds,
          // this is specified in the nuxt config file, but the full path gets
          // baked in at build time, which makes it impossible to swap out the
          // API source
          // overriding the URL here allows us to use the runtime configuration
          // to ensure we're targeting the correct API server
          url: this.$config.API_URL + '/authentication/login'
        }).then(() => {
          const token = getToken(this.$auth)

          this.$store.dispatch(
            'LoadAllUserData',
            { idToken: token })
        }).catch((err) => {
          console.error('error logging in:' + err)
          this.errorMessage = err
        })
      }
    }
  }
</script>

<style scoped>
  .login-page {
    color: white;
  }

  .login-page .login-page__errors {
    color: red
  }

  .login-page__field {
    margin-bottom: 1rem;
  }

  .login-page__actions {
    margin-top: 2rem;
  }

  .login-page__field label {
    font-weight: bold;
  }

  .login-page__actions input, button {
    border: 1px white solid;
    padding: 1rem;
  }
</style>
