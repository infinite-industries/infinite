export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.beforeResolve(function (to, from) {
    nuxtApp.$store.dispatch('ui/closeSidebar')
  })
})
