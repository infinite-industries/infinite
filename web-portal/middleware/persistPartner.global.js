export default defineNuxtRouteMiddleware((to, from) => {
  const partnerQuery = from.query.partner

  console.log('!!! here: ' + partnerQuery)
  if (partnerQuery && !to.query.partner) {
    // Preserve the 'partner' query parameter when it exists
    return navigateTo({
      path: to.path,
      query: { ...to.query, partner: partnerQuery },
      hash: to.hash,
      params: to.params,
    })
  }

  return;
})
