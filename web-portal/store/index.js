import { ApiService } from '../services/ApiService'
import { getEmptyCalendarEvent } from '../services/ResourceTemplateService'

const CURRENT_EVENTS_VERIFIED_PATH = '/current-events/verified'
const EVENTS_VERIFIED_PATH = '/events/verified'
const EMBED_VENUE = 'embed=Venue'

export const state = () => {
  return {
    util: {
      loading: false
    },

    calendar_event: {},

    user_data: {},
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
      return localEvent.tags && localEvent.tags.includes('remote') && !localEvent.tags.includes('online-resource')
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

  GetUser: (state) => {
    return state.user_data
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
    state.loaded_from_api = true
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
  Logout: (context) => {
    context.commit('LOGOUT')
  },
  CreateNewEvent: (context) => {
    context.commit('CREATE_NEW_EVENT')
  },

  LoadAllUserData: (context, payload) => {
    return ApiService.get('/users/current', payload.idToken)
      .then(function (_response) {
        context.commit('UPDATE_USER_DATA', _response.data)
      })
  },

  LoadAllLocalEventData: (context) => {
    context.commit('SET_LOADING_STATUS', true)
    return ApiService.get(`${CURRENT_EVENTS_VERIFIED_PATH}?${EMBED_VENUE}`)
      .then((_response) => {
        context.commit('UPDATE_LOCALIZED_EVENTS', _response.data.events)
        context.commit('SET_LOADING_STATUS', false)
      })
      .catch((error) => {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong.' }, { root: true })
      })
  },
  LoadAllStreamingEventData: (context) => {
    return ApiService.get(`${EVENTS_VERIFIED_PATH}?tags=online-resource&${EMBED_VENUE}`)
      .then((_response) => {
        context.commit('UPDATE_STREAMING_EVENTS', _response.data.events)
      })
      .catch((error) => {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Hrrmm... unable to get some event data. Please contact us and we will endeavor to address it.' }, { root: true })
      })
  },

  LoadAnnouncements: (context) => {
    return ApiService.get('/announcements')
      .then((_response) => {
        if (_response.data.status === 'success') {
          context.commit('POPULATE_ANNOUNCEMENTS', _response.data.announcements)
        } else console.error('Error processing announcements', _response.data)
      })
      .catch((error) => {
        console.error('Unable to load announcements', error)
      })
  },
  FindOrCreateActiveAnnouncement: (context, payload) => {
    const idToken = payload.idToken

    return ApiService.post(
      '/announcements/ensure-one-announcement',
      { message: '' },
      idToken
    ).then((response) => {
      if (response.data.status === 'success') {
        context.commit('POPULATE_ANNOUNCEMENTS', response.data.announcements)
      } else {
        console.error('Unable to ensure announcement', response.data.error)
      }
    }).catch((error) => {
      console.error('Failed making request to ensure announcements', error)
      throw new Error('Failed ensuring the existence of an announcement entity') // pass error on to caller
    })
  },
  UpdateActiveAnnouncement: (context, payload) => {
    const idToken = payload.idToken
    const announcement = payload.announcement

    return ApiService.put(
      `/announcements/${announcement.id}`,
      { message: announcement.message },
      idToken
    ).then((response) => {
      if (response.data.status !== 'success') {
        console.error('Unable to ensure announcement', response.data.error)
      }
    }).catch((error) => {
      console.error('Failed making request to ensure announcements', error)
      throw new Error('Failed to update the message') // pass error on to caller
    })
  }
}
