export const state = () => ({
  loadingVenues: false,
  errorLoadingVenues: null,
  venues: []
})

export const mutations = {
  loadingVenuesStarted(state) {
    return {
      ...state,
      loadingVenues: true
    }
  }
}
