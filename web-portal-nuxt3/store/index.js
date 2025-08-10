import { getEmptyCalendarEvent } from '../services/ResourceTemplateService'

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

    calendar_event: {},

    user_data: {},
    user_data_loading: true,
    user_data_error: null,

    loaded_from_api: false,

    all_local_events: [],
    all_streaming_events: [],

    announcements: []
  }
}

export const getters = {
  GetCurrentEvent: (state) => {
    return state.calendar_event
  },
  GetActiveVenues: (state) => {
    return state.venues.getActiveVenuesQuery.data
  },
  GetLoadingStatus: (state) => {
    return state.util.loading
  },
  GetAllLocalEvents: (state) => {
    return state.all_local_events
  },

  GetAllRemoteEvents: (state) => {
    return state.all_local_events.filter((localEvent) => {
      return (localEvent.mode && localEvent.mode === 'online') && !(localEvent.category && localEvent.category === 'online-resource')
    })
  },

  GetAllStreamEvents: (state) => {
    return state.all_streaming_events
  },

  GetAnnouncements: (state) => {
    return state.announcements
  },

  GetActiveAnnouncement: (state) => {
    if (state.announcements && state.announcements.length > 0) {
      return state.announcements[state.announcements.length - 1]
    }
  },

  IsUserAdmin: (state) => {
    return !!state.user_data && state.user_data.isInfiniteAdmin
  }
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

  POPULATE_CURRENT_EVENT: (state, payload) => {
    state.calendar_event = payload
  },

  CREATE_NEW_EVENT: (state) => {
    state.calendar_event = getEmptyCalendarEvent()
  },
  UPDATE_LOCALIZED_EVENTS: (state, payload) => {
    state.all_local_events = payload
  },
  UPDATE_STREAMING_EVENTS: (state, payload) => {
    state.all_streaming_events = payload
  },

  POPULATE_ANNOUNCEMENTS: (state, payload) => {
    state.announcements = payload && payload.length > 0 ? [...payload] : []
  },

  LOGOUT: (state) => {
    state.user_data = {}
  }
}

export const actions = {
  Logout: function (context) {
    context.commit('LOGOUT')
  },
  CreateNewEvent: function (context) {
    context.commit('CREATE_NEW_EVENT')
  },

  LoadAllLocalEventData: function (context) {
    context.commit('SET_LOADING_STATUS', true)

    return useNuxtApp().$apiService.get(`${CURRENT_EVENTS_VERIFIED_PATH}?${EMBED_VENUE}`)
      .then((data) => {
        context.commit('UPDATE_LOCALIZED_EVENTS', data.events)
        context.commit('SET_LOADING_STATUS', false)
      })
      .catch((error) => {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong.' }, { root: true })
      })
  },
  LoadAllStreamingEventData: function (context) {
    return useNuxtApp().$apiService.get(`${EVENTS_VERIFIED_PATH}?category=online-resource&${EMBED_VENUE}`)
      .then((data) => {
        context.commit('UPDATE_STREAMING_EVENTS', data.events)
      })
      .catch((error) => {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Hrrmm... unable to get some event data. Please contact us and we will endeavor to address it.' }, { root: true })
      })
  },

  LoadAnnouncements: function (context) {
    return useNuxtApp().$apiService.get('/announcements')
      .then((response) => {
        if (response.status === 'success') {
          context.commit('POPULATE_ANNOUNCEMENTS', response.announcements)
        } else console.error('Error processing announcements', response)
      })
      .catch((error) => {
        console.error('Unable to load announcements', error)
      })
  },

  FindOrCreateActiveAnnouncement: function (context) {
    return useNuxtApp().$apiService.post(
      '/announcements/ensure-one-announcement',
      { message: '' },
    ).then((response) => {
      if (response.status === 'success') {
        context.commit('POPULATE_ANNOUNCEMENTS', response.announcements)
      } else {
        console.error('Unable to ensure announcement', response.error)
      }
    }).catch((error) => {
      console.error('Failed making request to ensure announcements', error)
      throw new Error('Failed ensuring the existence of an announcement entity') // pass error on to caller
    })
  },

  UpdateActiveAnnouncement: function (context, payload) {
    const announcement = payload.announcement

    return useNuxtApp().$apiService.put(
      `/announcements/${announcement.id}`,
      { message: announcement.message }
    ).then((response) => {
      if (response.status !== 'success') {
        console.error('Unable to ensure announcement', response.error)
      }
    }).catch((error) => {
      console.error('Failed making request to ensure announcements', error)
      throw new Error('Failed to update the message') // pass error on to caller
    })
  }
}
