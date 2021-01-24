import { ApiService } from '../services/ApiService'

export const state = () => {
  return {
    unverified_events: [],
    verified_events: [],
    resource_events: []
  }
}

const CURRENT_EVENTS_VERIFIED_PATH = '/current-events/verified'
const CURRENT_EVENTS_NON_VERIFIED_PATH = '/current-events/non-verified'

export const getters = {
  GetUnverifiedEvents: (state, getters) => {
    return state.unverified_events
  },
  GetVerifiedEvents: (state, getters) => {
    return state.verified_events
  },
  GetResourceEvents: (state, getters) => {
    return state.resource_events
  },
  GetCurrentEvent: (state, getters, rootState) => {
    return rootState.calendar_event
  }
}

export const actions = {
  LoadCurrentEvent: (context, payload) => {
    const id = payload.id
    const idToken = payload.idToken

    return ApiService.get('/events/' + id, idToken)
      .then((response) => {
        if (response.data.status === 'success') { context.commit('POPULATE_CURRENT_EVENT', response.data.event, { root: true }) }
      })
  },
  LoadUnverifiedEvents: (context, payload) => {
    const idToken = payload.idToken

    const isResponseSuccess = respObj => respObj && respObj.data && respObj.data.status === 'success'

    ApiService.all([
      ApiService.get(CURRENT_EVENTS_NON_VERIFIED_PATH, idToken),
      ApiService.get('/events/non-verified?tags=online-resource', idToken)
    ])
      .then(function (responses) {
        const [currentNonVerifiedResponse, allNonVerifiedResponse] = responses

        console.log('data from server: ', currentNonVerifiedResponse.data.events, allNonVerifiedResponse.data.events)

        if (isResponseSuccess(currentNonVerifiedResponse) && isResponseSuccess(allNonVerifiedResponse)) {
          const currentNonVerifiedEventsList = currentNonVerifiedResponse.data.events
          const currentNonVerifiedEventIds = currentNonVerifiedEventsList.map(function (event) { return event.id })

          const unionOfEventSets = [...currentNonVerifiedEventIds]

          const allNonVerifiedEventsList = allNonVerifiedResponse.data.events

          allNonVerifiedEventsList.forEach(function (resource) {
            if (!currentNonVerifiedEventIds.includes(resource.id)) {
              unionOfEventSets.push(resource)
            }
          })

          context.commit('POPULATE_UNVERIFIED_LIST', unionOfEventSets)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Was not able to find unverified events.' }, { root: true })
        }
      })
      .catch(function (error) {
        console.log(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
      })
  },
  LoadCurrentEvents: (context, payload) => {
    const idToken = payload.idToken

    ApiService.get(CURRENT_EVENTS_VERIFIED_PATH, idToken)
      .then(function (_response) {
        if (_response.data.status === 'success') {
          context.commit('POPULATE_VERIFIED_LIST', _response.data.events)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Not able to find verified events' }, { root: true })
        }
      })
      .catch(function (error) {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FIX!' }, { root: true })
      })
  },
  LoadResourceEvents: (context, payload) => {
    const idToken = payload.idToken
    ApiService.get('/events/verified?tags=online-resource', idToken)
      .then(function (_response) {
        if (_response.data.status === 'success') {
          context.commit('POPULATE_RESOURCE_LIST', _response.data.events)
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Not able to find verified resources' }, { root: true })
        }
      })
      .catch(function (error) {
        console.error(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FIX!' }, { root: true })
      })
  },
  VerifyEvent: (context, payload) => {
    const idToken = payload.idToken

    return ApiService.put(`/events/verify/${payload.id}`, null, idToken)
      .then(function (_response) {
        // console.log("data from server: ",response.data.events);
        if (_response.data.status === 'success') {
          context.commit('CHANGE_STATE_TO_VERIFIED', payload)

          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Event was successfuly verified.' }, { root: true })
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Unable to verify the event.' }, { root: true })
        }
      })
      .catch(function (error) {
        console.log(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
      })
  },

  UpdateEvent: (context, payload) => {
    const idToken = payload.idToken

    return ApiService.put(`/events/${payload.id}`, { event: { ...payload.event_data } }, idToken)
      .then(function (_response) {
        // console.log("data from server: ",response.data.events);
        if (_response.data.status === 'success') {
          console.log('event updated')

          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Content of the event updated.' }, { root: true })
        } else {
          context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'Unable to update :(' }, { root: true })
        }
      })
      .catch(function (error) {
        console.log(error)
        context.commit('ui/SHOW_NOTIFICATIONS', { open: true, message: 'API connection bit the dust. FiX!' }, { root: true })
      })
  },

  DeleteEvent: (context, payload) => {
    const idToken = payload.idToken

    return ApiService.delete(`/events/${payload.id}`, idToken)
      .then(function (_response) {
        console.log('Trying to delete event \n data from server: ', _response.data.events)
        if (_response.data.status !== 'success') {
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
    state.unverified_events = payload
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
  }
}
