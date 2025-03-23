
const CURRENT_EVENTS_VERIFIED_PATH = '/events/current-verified'
const EVENTS_VERIFIED_PATH = '/events/verified'
const EMBED_VENUE = 'embed=Venue'

// this may not be necessary
export const plugins = [
  function injectNuxtApp(store) {
    store.$nuxt = useNuxtApp()
  }
]

export const state = () => {
  return {
    util: {
      loading: false
    },

    user_data: {},
    user_data_loading: true,
    user_data_error: null,

    loaded_from_api: false,

    all_local_events: [],
    all_streaming_events: [],
  }
}

export const getters = {
  GetLoadingStatus: (state) => {
    return state.util.loading
  },
  GetAllLocalEvents: (state) => {
    return state.all_local_events
  },
}

export const mutations = {
  SET_LOADING_STATUS: (state, payload) => {
    state.util.loading = payload
  },

  UPDATE_USER_DATA: (state, userData) => {
    state.user_data = { ...userData }
    state.user_data_loading = false
    state.user_data_error = null
    state.loaded_from_api = true
  },

  USER_DATA_FETCH_START: (state) => {
    state.user_data_loading = true
    state.user_data_error = null
  },

  USER_DATA_FETCH_FAIL: (state, err) => {
    state.user_data_loading = false
    state.user_data_error = err
  },

  UPDATE_LOCALIZED_EVENTS: (state, payload) => {
    state.all_local_events = payload
  },
}

export const actions = {
  LoadAllUserData: function (context, payload) {
    context.commit('USER_DATA_FETCH_START')

    return this.$apiService.get('/users/current', payload.idToken)
      .then(function (_response) {
        context.commit('UPDATE_USER_DATA', _response.data)
        return _response
      }).catch((ex) => {
        context.commit('USER_DATA_FETCH_FAIL', ex)

        throw ex
      })
  },
  LoadAllLocalEventData: function (context) {
    context.commit('SET_LOADING_STATUS', true)

    // this isn't working because `$apiService` isn't available on the Vue instance
    // this is probably related to changes in the way plugins work
    // Fix TBD
    return useNuxtApp().$apiService.get(`${CURRENT_EVENTS_VERIFIED_PATH}?${EMBED_VENUE}`)
      .then((data) => {
        console.log(Object.keys(data))
        console.log('RESPONSE!', data.events)
        context.commit('UPDATE_LOCALIZED_EVENTS', data.events)
        context.commit('SET_LOADING_STATUS', false)
        return data
      })
      .catch((error) => {
        console.log('ERROR')
        console.error(error)
        // context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong.' }, { root: true })
      })
  },
}
