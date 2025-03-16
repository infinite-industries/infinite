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
const { user, fetch, loggedIn} = useUserSession()


async function onLoginClick(event) {
  const target = event.target

  await $fetch('/api-internal/login', {
    method: 'POST',
    body: {
      username: target.username.value,
      password: target.password.value,
    },
  }).then(() => {
    fetch()
    console.log('!!! success')
    router.push({ path: 'page-with-items-requiring-auth' })
  }).catch((err) => {
    console.log(err)
  })
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
