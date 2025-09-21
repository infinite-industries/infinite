export const state = () => {
  return {
    unverified_events: [],
    verified_events: [],
    resource_events: []
  }
}

const CURRENT_EVENTS_VERIFIED_PATH = '/events/current-verified'
const EVENTS_NON_VERIFIED_PATH = '/authenticated/events/non-verified?embed=DATE_TIME&embed=ADMIN_META_DATA'

export const getters = {
  GetUnverifiedEvents: (state) => {
    return state.unverified_events
  },
  GetVerifiedEvents: (state) => {
    return state.verified_events
  },
  GetResourceEvents: (state) => {
    return state.resource_events
  },
  GetCurrentEvent: (state, getters, rootState) => {
    return rootState.calendar_event
  }
}

export const actions = {
  LoadEvent: function (context, payload) {
    const id = payload.id

    return useNuxtApp().$apiService.get('/authenticated/events/' + id)
      .then((response) => {
        if (response.status === 'success') { context.commit('POPULATE_CURRENT_EVENT', response.event, { root: true }) }
      })
  },
  LoadUnverifiedEvents: function (context) {
    const isResponseSuccess = data => data && data.status === 'success'

    return this.$nuxt.$apiService.get(EVENTS_NON_VERIFIED_PATH).then(
      (currentNonVerifiedEventsResponse) => {
        if (isResponseSuccess(currentNonVerifiedEventsResponse)) {
          const currentNonVerifiedEvents = currentNonVerifiedEventsResponse.events
          context.commit('POPULATE_UNVERIFIED_LIST', currentNonVerifiedEvents)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Was not able to find unverified events.' }, { root: true })
        }
      }
    ).catch(function (error) {
      console.log(error)
      context.commit('ui/SHOW_NOTIFICATIONS',
        { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
    })
  },
  LoadCurrentEvents: function (context) {
    const apiService = this.$nuxt.$apiService

    return apiService.get(CURRENT_EVENTS_VERIFIED_PATH)
      .then((data) => {
        if (data.status === 'success') {
          return data.events
        } else {
          return null
        }
      })
      .then((events) => {
        if (events !== null) {
          context.commit('POPULATE_VERIFIED_LIST', events)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Not able to find verified events' }, { root: true })
        }
      })
      .catch(function (error) {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FIX!' }, { root: true })
      })
  },
  LoadResourceEvents: function (context) {
    return this.$nuxt.$apiService.get('/events/verified?category=online-resource&embed=ADMIN_META_DATA')
      .then(function (response) {
        if (response.status === 'success') {
          context.commit('POPULATE_RESOURCE_LIST', response.events)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Not able to find verified resources' }, { root: true })
        }
      })
      .catch(function (error) {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FIX!' }, { root: true })
      })
  },
  VerifyEvent: function (context, payload) {
    return this.$nuxt.$apiService.put(`/authenticated/events/verify/${payload.id}`, null)
      .then(function () {
        context.commit('CHANGE_STATE_TO_VERIFIED', payload)

        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Event was successfuly verified.' }, { root: true })
      })
      .catch(function (error) {
        console.log(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
      })
  },

  UpdateEvent: function (context, payload) {
    return this.$nuxt.$apiService.put(`/authenticated/events/${payload.id}`, { ...payload.event_data })
      .then(function () {
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Content of the event updated.' }, { root: true })
      })
      .catch(function (error) {
        console.log(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
      })
  },

  DeleteEvent: function (context, payload) {
    return this.$nuxt.$apiService.delete(`/authenticated/events/${payload.id}`)
      .then(function (response) {
        if (response.status !== 'success') {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Unable to delete the event' }, { root: true })
        }
      })
      .catch(function (error) {
        console.log(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
      })
  }
}

export const mutations = {
  POPULATE_UNVERIFIED_LIST: (state, payload) => {
    state.unverified_events = [...payload]
  },
  POPULATE_VERIFIED_LIST: (state, payload) => {
    state.verified_events = payload
  },
  POPULATE_RESOURCE_LIST: (state, payload) => {
    state.resource_events = payload
  },
  CHANGE_STATE_TO_VERIFIED: (state, payload) => {
    console.log(state.unverified_events.find(event => event.id === payload.id))
    state.unverified_events = state.unverified_events.filter(event => event.id !== payload.id)
  },
  UPDATE_ADMIN_METADATA: (state, { eventId, newMetaDateEntry }) => {
    const addMetaDataEntry = (event) => {
      if (event.id === eventId) {
        return { ...event, eventAdminMetadata: newMetaDateEntry }
      } else {
        return { ...event }
      }
    }

    state.resource_events = state.resource_events.map(addMetaDataEntry)
    state.unverified_events = state.unverified_events.map(addMetaDataEntry)
    state.verified_events = state.verified_events.map(addMetaDataEntry)
  }
}
