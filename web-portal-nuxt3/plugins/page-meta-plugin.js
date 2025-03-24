export default defineNuxtPlugin((nuxtApp) => {
  const $config = useRuntimeConfig()

  return {
    provide: {
      urlFor: function urlFor(route) {
        return `${$config.public.appUrl}${route}`
      }
    }
  }
})
