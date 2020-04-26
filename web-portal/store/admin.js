import ComponentEventBus from '../helpers/ComponentEventBus.js'
import { ApiService } from '../services/ApiService'

export const state = () => {
  return {
    unverified_events: [],
    verified_events: [],
    resource_events: []
  }
}

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

    ApiService.all([
      ApiService.get('/events/current/non-verified', idToken),
      ApiService.get('/events/non-verified/tags/online-resource', idToken)
    ])
      .then(function (_responses) {
        const [_eventRes, _resourceRes] = _responses
        console.log('data from server: ', _eventRes.data.events, _resourceRes.data.events)
        if (_eventRes.data.status === 'success' && _resourceRes.data.status === 'success') {
          const eventList = _eventRes.data.events
          const eventIds = eventList.map(function (event) { return event.id })
          _resourceRes.data.events.forEach(function (resource) {
            if (!eventIds.includes(resource.id)) eventList.push(resource)
          })
          context.commit('POPULATE_UNVERIFIED_LIST', eventList)
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Was not able to find unverified events.'
          })
        }
      })
      .catch(function (error) {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FiX!'
        })
      })
  },
  LoadCurrentEvents: (context, payload) => {
    const idToken = payload.idToken

    ApiService.get('/events/current/verified', idToken)
      .then(function (_response) {
        if (_response.data.status === 'success') {
          context.commit('POPULATE_VERIFIED_LIST', _response.data.events)
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Not able to find verified events'
          })
        }
      })
      .catch(function (error) {
        console.error(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FIX!'
        })
      })
  },
  LoadResourceEvents: (context, payload) => {
    const idToken = payload.idToken
    ApiService.get('/events/verified/tags/online-resource', idToken)
      .then(function (_response) {
        if (_response.data.status === 'success') {
          context.commit('POPULATE_RESOURCE_LIST', _response.data.events)
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Not able to find verified resources'
          })
        }
      })
      .catch(function (error) {
        console.error(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FIX!'
        })
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
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FiX!'
        })
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
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FiX!'
        })
      })
  },

  DeleteEvent: (context, payload) => {
    const idToken = payload.idToken

    return ApiService.delete(`/events/${payload.id}`, idToken)
      .then(function (_response) {
        console.log('Trying to delete event \n data from server: ', _response.data.events)
        if (_response.data.status === 'success') {
          // context.commit('POPULATE_CURRENT_LIST', _response.data)
          ComponentEventBus.$emit('CALENDAR_EVENT_DELETED', { id: _response.data.id })
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Unable to delete the event'
          })
        }
      })
      .catch(function (error) {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FiX!'
        })
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
    // state.all_local_events.push(state.unverified_events.find(event => event.id === payload.id))
    state.unverified_events = state.unverified_events.filter(event => event.id !== payload.id)
  }
}
