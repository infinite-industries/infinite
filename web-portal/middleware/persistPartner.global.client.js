export default defineNuxtRouteMiddleware((to, from) => {
  const partnerQuery = from.query.partner

  console.log('!!! middleware running - partnerQuery:', partnerQuery, 'to.path:', to.path)
  if (partnerQuery && !to.query.partner) {
    // Preserve the 'partner' query parameter when it exists
    console.log('!!! preserving partner param:', partnerQuery)
    return navigateTo({
      path: to.path,
      query: { ...to.query, partner: partnerQuery },
      hash: to.hash,
      params: to.params,
    })
  }

  return;
})

