<template>
  <ul id="nav-list">
    <li>
      <nuxt-link to="/">Home</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/admin">Events</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/admin/announcements">Announcements</nuxt-link>
    </li>
    <li v-if="$auth.loggedIn">
      <nuxt-link to="/logout">Logout</nuxt-link>
    </li>
  </ul>
</template>
