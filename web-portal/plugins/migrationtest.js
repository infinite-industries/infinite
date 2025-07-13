import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      migration: () => 'injection works'
    }
  }
  // nuxtApp.provide('migration', () => 'injected works')
})
