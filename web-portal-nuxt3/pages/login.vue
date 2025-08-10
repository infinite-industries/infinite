<template>
  <div class="container login-page">
    <h1>Login</h1>

    <div v-if="errorMessage !== null" class="login-page__errors">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="onLoginClick($event)">
      <div class="login-page__field">
        <label class="login-page__username-label">username: </label>
        <input
          class="login-page__username"
          name="username"
          type="text"
          placeholder="username"
        />
      </div>

      <div class="login-page__field">
        <label class="login-page__password-label">password: </label>
        <input
          class="login-page__password"
          name="password"
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

      <div v-if="loggedIn">
        logged in
      </div>
    </form>
  </div>
</template>

<script setup>
  const router = useRouter()
  const { fetch, loggedIn } = useUserSession()

  const errorMessage = ref(null)

  async function onLoginClick(event) {
    const target = event.target

    await $fetch('/internal-api/login', {
      method: 'POST',
      body: {
        username: target.username.value,
        password: target.password.value,
      },
    }).then(async () => {
      await fetch()
      console.debug('successfully authenticated')
      await router.push({ path: '/' })
    }).catch((err) => {
      errorMessage.value = 'Sorry, could not authenticated';
      console.warn('Error authenticating:', err)
    })
  }
</script>

<style scoped>
.login-page {
  color: white;
}

.login-page input {
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
