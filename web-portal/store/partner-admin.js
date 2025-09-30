export const state = () => {
  return {
    unverified_events_for_partners: [],
    isInitialized: false,
    isLoading: false
  }
}

const EVENTS_NON_VERIFIED_FOR_PARTNERS_PATH = '/authenticated/events/non-verified-for-partners?embed=DATE_TIME&embed=ADMIN_META_DATA'

export const getters = {
  GetUnverifiedEventsForPartners: (state) => {
    return state.unverified_events_for_partners
  },
  IsInitialized: (state) => {
    return state.isInitialized
  },
  IsLoading: (state) => {
    return state.isLoading
  }
}

export const actions = {
  LoadUnverifiedEventsForPartners: function (context) {
    const isResponseSuccess = data => data && data.status === 'success'

    // Set loading state to true
    context.commit('SET_LOADING', true)

    return this.$nuxt.$apiService.get(EVENTS_NON_VERIFIED_FOR_PARTNERS_PATH).then(
      (currentNonVerifiedEventsResponse) => {
        if (isResponseSuccess(currentNonVerifiedEventsResponse)) {
          const currentNonVerifiedEvents = currentNonVerifiedEventsResponse.events
          context.commit('POPULATE_UNVERIFIED_FOR_PARTNERS_LIST', currentNonVerifiedEvents)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Was not able to find unverified events for partners.' }, { root: true })
        }
      }
    ).catch(function (error) {
      console.log(error)
      context.commit('ui/SHOW_NOTIFICATIONS',
        { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
    }).finally(function () {
      // Set loading state to false when request completes (success or error)
      context.commit('SET_LOADING', false)
    })
  }
}

export const mutations = {
  POPULATE_UNVERIFIED_FOR_PARTNERS_LIST: (state, payload) => {
    state.unverified_events_for_partners = [...payload]
    state.isInitialized = true
  },
  SET_LOADING: (state, isLoading) => {
    state.isLoading = isLoading
  }
}
