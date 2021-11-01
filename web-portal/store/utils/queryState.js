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
  console.log('!!! here: ' + data)
  queryState.isFetching = false
  queryState.error = null
  queryState.data = data
}

export function setQueryStateFail(queryState, error) {
  queryState.isFetching = false
  queryState.error = error
}
