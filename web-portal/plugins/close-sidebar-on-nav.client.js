export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.beforeResolve(function () {
    nuxtApp.$store.dispatch('ui/closeSidebar')
  })
})
