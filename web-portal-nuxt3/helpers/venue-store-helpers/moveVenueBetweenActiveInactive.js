export function moveVenueFromActiveToInactiveList(state, id, venue) {
  if (state.getActiveVenuesQuery.isSuccess && !state.getActiveVenuesQuery.isFetching) {
    state.getActiveVenuesQuery.data = state.getActiveVenuesQuery.data.filter(venue => venue.id !== id)
  }

  if (state.getDeletedVenuesQuery.isSuccess && !state.getDeletedVenuesQuery.isFetching) {
    state.getDeletedVenuesQuery.data.push(venue)
  }
}

export function moveVenueFromInactiveToActiveList(state, id, venue) {
  if (state.getActiveVenuesQuery.isSuccess && !state.getActiveVenuesQuery.isFetching) {
    state.getActiveVenuesQuery.data.push(venue)
  }

  if (state.getDeletedVenuesQuery.isSuccess && !state.getDeletedVenuesQuery.isFetching) {
    state.getDeletedVenuesQuery.data = state.getDeletedVenuesQuery.data.filter(venue => venue.id !== id)
  }
}
