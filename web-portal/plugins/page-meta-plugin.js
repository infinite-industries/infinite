export default ({ app }, inject) => {
  inject('urlFor', function urlFor(route) {
    return `app.$config.APP_URL${route}}`
  })
}
