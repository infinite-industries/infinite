export function doVenueUpdate(state, venue) {
  if (state.getActiveVenuesQuery.isSuccess && !state.getActiveVenuesQuery.isFetching) {
    state.getActiveVenuesQuery.data = replaceVenue(state.getActiveVenuesQuery.data, venue.id, venue)
  }
}

export function replaceVenue(venueList, oldId, replacementVenue) {
  return venueList.map((entry) => {
    if (entry.id !== oldId) {
      return entry
    } else {
      return replacementVenue
    }
  })
}
