export function initialQueryState() {
  return {
    isFetching: false,
    isSuccess: false,
    error: null,
    data: []
  }
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

export function setQueryStateFail(queryState, error) {
  queryState.isFetching = false
  queryState.isSuccess = false
  queryState.error = error
}
