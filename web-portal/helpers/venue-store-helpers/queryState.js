export function initialQueryState() {
  return {
    isFetching: false,
    isSuccess: false,
    error: null,
    data: []
  }
}

export function initialVenueUpdateQueries() {
  return {
    queriesByVenueId: {}
  }
}

export function initializeVenuesEdited() {
  return {}
}

export function setQueryFetching(queryState) {
  queryState.isFetching = true
}

export function setQueryStateSuccess(queryState, data) {
  queryState.isFetching = false
  queryState.isSuccess = true
  queryState.error = null
  queryState.data = data
}

export function setQueryStateFail(queryState, venueId, error) {
  queryState.queriesByVenueId[venueId].isFetching = false
  queryState.queriesByVenueId[venueId].isSuccess = false
  queryState.queriesByVenueId[venueId].error = error
}

export function setQueryUpdating(queryState, venueId) {
  queryState.queriesByVenueId = {
    ...queryState.queriesByVenueId,
    [venueId]: { ...initialQueryState(), isFetching: true }
  }
}

export function setQueryUpdateSuccess(queryState, venueId, data) {
  queryState.queriesByVenueId[venueId].isFetching = false
  queryState.queriesByVenueId[venueId].isSuccess = true
  queryState.queriesByVenueId[venueId].error = null
  queryState.queriesByVenueId[venueId].data = data
}

export function setQueryUpdateFail(queryState, error) {
  queryState.isFetching = false
  queryState.isSuccess = false
  queryState.error = error
}
