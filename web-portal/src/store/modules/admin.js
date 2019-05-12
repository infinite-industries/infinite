// Admin specific store module

import ComponentEventBus from '../../helpers/ComponentEventBus.js'
import {ApiService} from '../../services/ApiService'

const getters = {
  GetUnverifiedEvents: (state, getters, rootState) =>{
    return rootState.unverified_events
  },
  GetCurrentEvent: (state, getters, rootState) => {
    return rootState.calendar_event
  }
}

const actions = {
  LoadCurrentEvent:(context, id) => {
    ApiService.get('/events/' + id)
      .then(response => {
        if (response.data.status === 'success')
          context.commit('POPULATE_CURRENT_EVENT', response.data.event, { root: true })
      })
  },
  LoadUnverifiedEvents:(context) => {
    //Axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    ApiService.get('/events/current/non-verified')
      .then(function (_response) {
        console.log('data from server: ',_response.data.events)
        if(_response.data.status === 'success'){
          context.commit('POPULATE_UNVERIFIED_LIST', _response.data.events, { root: true })
        }
        else{
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
  VerifyEvent:(context, payload) => {
    ApiService.put(`/events/verify/${payload.id}`)
      .then(function (_response) {
        // console.log("data from server: ",response.data.events);
        if(_response.data.status === 'success'){
          context.commit('CHANGE_STATE_TO_VERIFIED', payload, { root: true })

          context.commit('SHOW_NOTIFICATIONS',{open:true, message: 'Event was successfuly verified.'})

        }
        else{
          context.commit('SHOW_NOTIFICATIONS',{open:true, message: 'Unable to verify the event.'})

        }
      })
      .catch(function (error) {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FiX!'
        })
      })
  },

  UpdateEvent:(context, payload) => {
    ApiService.put(`/events/${payload.id}`, { event: { ...payload.event_data } })
      .then(function (_response) {
        // console.log("data from server: ",response.data.events);
        if(_response.data.status === 'success'){
          console.log('event updated')

          context.commit('SHOW_NOTIFICATIONS',{open:true, message: 'Content of the event updated.'})
        }
        else{
          context.commit('SHOW_NOTIFICATIONS',{open:true, message: 'Unable to update :('})
        }
      })
      .catch(function (error) {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'API connection bit the dust. FiX!'
        })
      })
  },

  DeleteEvent:(context, payload) => {

    ApiService.delete(`/events/${payload.id}`)
      .then(function (_response) {
        console.log('Trying to delete event \n data from server: ',_response.data.events)
        if(_response.data.status === 'success'){
          // context.commit('POPULATE_CURRENT_LIST', _response.data)
          ComponentEventBus.$emit('CALENDAR_EVENT_DELETED', {id:_response.data.id})
        }
        else{
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

export default {
  getters,
  actions
}
