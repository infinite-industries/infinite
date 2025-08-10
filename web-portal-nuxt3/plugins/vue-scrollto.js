import VueScrollTo from 'vue-scrollto'

export default defineNuxtPlugin({
  name: 'vue-scrollto',
  async setup (nuxtApp) {
    nuxtApp.vueApp.use(VueScrollTo)
  }
})
