// close sidebar on navigation
export default function ({ app }, inject) {
  app.router.beforeResolve(function (to, from, next) {
    app.store.dispatch('ui/closeSidebar')
    next()
  })
}
