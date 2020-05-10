import { ApiService } from '../services/ApiService'
import ComponentEventBus from '../helpers/ComponentEventBus'
import { getEmptyCalendarEvent } from '../services/ResourceTemplateService'

export const state = () => {
  return {
    util: {
      loading: false
    },

    calendar_event_id: null,
    calendar_event: {},
    loaded_from_api: false,

    all_venues: [],

    user_data: {},

    current_list: {},

    lists_my: [],
    lists_follow: [],

    all_local_events: [],
    all_streaming_events: [],

    editable_event: {}, // currently unused

    announcements: []
  }
}

export const getters = {
  GetAllDateTimes: (state) => {
    return state.calendar_event.date_times
  },
  GetCurrentEvent: (state) => {
    return state.calendar_event
  },
  GetAllVenues: (state) => {
    return state.all_venues
  },
  GetLoadingStatus: (state) => {
    return state.util.loading
  },
  GetMyLists: (state) => {
    return state.lists_my
  },
  GetListsIFollow: (state) => {
    return state.lists_follow
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

  GetCurrentList: (state) => {
    return state.current_list
  },

  GetAnnouncements: (state) => {
    return state.announcements
  },

  GetActiveAnnouncement: (state) => {
    if (state.announcements && state.announcements.length > 0) {
      return state.announcements[state.announcements.length - 1]
    }
  },

  GetSettings: () => {
    // TODO
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
  DELETE_TIME_SEGMENT: (state, payload) => {
    state.calendar_event.date_times.splice(payload.index, 1)
  },
  ADD_NEW_TIME_SEGMENT: (state) => {
    state.calendar_event.date_times.push({
      optional_title: '',
      start_time: '',
      end_time: ''
    })
  },
  UPDATE_CURRENT_TIME_SEGMENT: (state, payload) => {
    state.calendar_event.date_times[payload.current_time_segment].optional_title = payload.optional_title
    state.calendar_event.date_times[payload.current_time_segment].start_time = payload.start_time
    state.calendar_event.date_times[payload.current_time_segment].end_time = payload.end_time
  },

  UPDATE_LOCALIZED_EVENTS: (state, payload) => {
    state.all_local_events = payload
  },
  UPDATE_STREAMING_EVENTS: (state, payload) => {
    state.all_streaming_events = payload
  },
  UPDATE_ALL_VENUES: (state, payload) => {
    state.all_venues = payload
  },
  PUSH_NEW_LIST: (state, payload) => {
    state.lists_my.push(payload)
  },
  PUSH_NEW_EVENT_TO_MY_LIST: (state, payload) => {
    const list_index = state.lists_my.findIndex((list) => {
      console.log(list.id + ' ---' + payload.list_id)
      return list.id === payload.list_id
    })

    state.lists_my[list_index].events.push(payload.event_data)
  },
  POPULATE_CURRENT_LIST: (state, payload) => {
    state.current_list = payload
  },

  REMOVE_FROM_CURRENT_LIST: (state, payload) => {
    state.current_list.events = state.current_list.events.filter(event => event.id !== payload.id)
  },

  POPULATE_ANNOUNCEMENTS: (state, payload) => {
    state.announcements = payload && payload.length > 0 ? [...payload] : []
  },

  // POPULATE_calendar_event: (state, event) => {
  //   //Vue.set(state.calendar_event, 'title', event.title)
  //   state.calendar_event = event
  // },
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
  DeleteTimeSegment: (context, payload) => {
    context.commit('DELETE_TIME_SEGMENT', payload)
  },

  AddNewTimeSegment: (context) => {
    context.commit('ADD_NEW_TIME_SEGMENT')
  },
  UpdateCurrentTimeSegment: (context, payload) => {
    context.commit('UPDATE_CURRENT_TIME_SEGMENT', payload)
  },

  CreateNewList: (context, payload) => {
    // Hit API to create a list
    ApiService.post('/event-lists/', { list_name: payload.name, description: payload.description })
      .then((_response) => {
        // this is almost definitely wrong (hard coded id should probably be user id)
        return ApiService.put(`/users/addList/'99af7550-f3e6-11e7-8279-f30c6795f584'/${_response.data.id}`)
      })
      .then(function (_response) {
        console.log(_response.data)
        if (_response.data.status === 'success') {
          const empty_list = {
            id: _response.data.id,
            list_name: payload.name,
            description: payload.description,
            events: []
          }

          context.commit('PUSH_NEW_LIST', empty_list)
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Hrrmm... unable create an new list. Please contact us and we will figure out what went wrong. Code: #00447'
          })
        }
      })
      .catch(function (error) {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable create an new list. Please contact us and we will figure out what went wrong. Code: #00347'
        })
      })
  },
  FollowList: () => {
    // TODO
  },
  UnFollowList: () => {
    // TODO
  },
  AddEventToMyList: (context, payload) => {
    ApiService.post(`/event-lists/addEvent/${payload.list_id}/${payload.event_data.id}`)
      .then(function (_response) {
        if (_response.data.status === 'success') {
          context.commit('PUSH_NEW_EVENT_TO_MY_LIST', { list_id: payload.list_id, event_data: payload.event_data })
          // need to get back the full list

          ComponentEventBus.$emit('SHOW_INFO', {
            message: 'Added a new event to your list.'
          })
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong. Code: #33347'
          })
        }
      })
      .catch(function (error) {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong. Code: #23997'
        })
      })
  },
  RemoveEventFromList: (context, payload) => {
    ApiService.post(`/event-lists/removeEvent/${payload.list_id}/${payload.event_id}`)
      .then(function (_response) {
        if (_response.data.status === 'success') {
          context.commit('REMOVE_FROM_CURRENT_LIST', _response.data)

          ComponentEventBus.$emit('SHOW_INFO', {
            message: 'Event taken off your list.'
          })
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Hrrmm... unable to remove this event from your list. Please contact us and we will figure out what went wrong. Code: #2347'
          })
        }
      })
      .catch(function (error) {
        console.log('error mesg:', error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable to remove this event from your list. Please contact us and we will figure out what went wrong. Code: #2647'
        })
      })
  },

  LoadAllUserData: (context, payload) => {
    return ApiService.get('/users/current', payload.idToken)
      .then(function (_response) {
        context.commit('UPDATE_USER_DATA', _response.data.user)
      })
  },

  LoadAllLocalEventData: (context) => {
    context.commit('SET_LOADING_STATUS', true)
    return ApiService.get('/events/current/verified/')
      .then((_response) => {
        context.commit('UPDATE_LOCALIZED_EVENTS', _response.data.events)
        context.commit('SET_LOADING_STATUS', false)
      })
      .catch((error) => {
        console.error(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong.'
        })
      })
  },
  LoadAllStreamingEventData: (context) => {
    return ApiService.get('/events/verified/tags/online-resource')
      .then((_response) => {
        context.commit('UPDATE_STREAMING_EVENTS', _response.data.events)
      })
      .catch((error) => {
        console.error(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable to get some event data. Please contact us and we will endeavor to address it.'
        })
      })
  },
  LoadAllVenueData: (context) => {
    return ApiService.get('/venues')
      .then((_response) => {
        context.commit('UPDATE_ALL_VENUES', _response.data.venues)
      })
      .catch((error) => {
        console.error(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong.'
        })
      })
  },

  LoadListData: (context, id) => {
    // set current_list that we will be operating on
    ApiService.get(`/event-lists/${id}`)
      .then((_response) => {
        // console.log("data from server: ",response.data.events);
        if (_response.data.status === 'success') {
          console.log(_response.data)
          context.commit('POPULATE_CURRENT_LIST', _response.data.eventList)
        } else {
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: 'Hrrmm... unable to get list data. Please contact us and we will figure out what went wrong. Code: #11647'
          })
        }
      })
      .catch((error) => {
        console.log(error)
        ComponentEventBus.$emit('SHOW_ALERT', {
          message: 'Hrrmm... unable to get list data. Please contact us and we will figure out what went wrong. Code: #11007'
        })
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
      { announcement: { message: '' } },
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
      { announcement },
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
