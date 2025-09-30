<template>
  <ul id="nav-list">
    <li>
      <nuxt-link to="/">Home</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/admin">Events</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/partner-admins">Partner Events</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/admin-announcement-edit">Announcements</nuxt-link>
    </li>

    <li>
      <nuxt-link to="/admin-venue-edit">Venues</nuxt-link>
    </li>

    <AuthState v-slot="{ loggedIn }">
      <li v-if="loggedIn">
        <nuxt-link @click="onLogoutClick">Logout</nuxt-link>
      </li>
    </AuthState>
  </ul>
</template>

<script setup>
  const { clear } = useUserSession()
  const router = useRouter()

  const onLogoutClick = async () => {
    await clear()
    await router.push({ path: '/' })
  }
</script>
