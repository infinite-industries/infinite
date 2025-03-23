<template>
  <ul id="nav-list">
    <li>
      <nuxt-link to="/">Home</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/submit-event">Submit Event</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/calendar">Calendar</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/our-mission">Our Mission</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/who-we-are">Who We Are</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/legal">Legal</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/donate">Donate</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/contact">Contact</nuxt-link>
    </li>
    <!-- <li v-if="!$auth.loggedIn">
      <nuxt-link to="/login">Login</nuxt-link>
    </li>
    <li v-if="$auth.loggedIn && $store.getters.IsUserAdmin">
      <nuxt-link to="/admin">Admin</nuxt-link>
    </li>
    <li v-if="$auth.loggedIn">
      <nuxt-link to="/logout">Logout</nuxt-link>
    </li> -->
  </ul>
</template>
