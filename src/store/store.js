import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

import ComponentEventBus from '../helpers/ComponentEventBus'

import admin from './modules/admin'
import ui from './modules/ui'

import {getIdToken, getUsername, isAdmin, logout} from '../helpers/Auth'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules:{
    admin,
    ui
  },
  state:{

    util:{
      loading: false
    },

    calendar_event_id: null,
    calendar_event: {},
    loaded_from_api: false,

    all_venues: [],

    user_settings:{
      logged_in: false,
      admin_role: false,
      username: "",
      associated_venues: []
    },

    current_list:{},

    lists_my:[],
    lists_follow:[],

    all_local_events:[],
    unverified_events:[],    // events stay here before review and verification

    editable_event: {},      // currently unused
  },
  getters:{
    GetAllDateTimes: state => {
      return state.calendar_event.date_times;
    },
    GetAllVenues: state => {
      return state.all_venues;
    },
    GetLoadingStatus: state => {
      return state.util.loading;
    },
    GetMyLists: state => {
      return state.lists_my;
    },
    GetListsIFollow: state => {
      return state.lists_follow;
    },
    GetAllLocalEvents: state => {
      return state.all_local_events
    },

    GetCurrentList: state => {
      return state.current_list
    },

    GetSettings: state => {
      // TODO
    },
    GetUser: state => {
      return state.user_settings
    }
  },
  mutations:{
    SET_LOADING_STATUS: (state, payload) => {
      state.util.loading = payload
    },

    UPDATE_USER_DATA: (state, user_data) => {
      state.user_settings = {... state.user_settings, ...user_data, username: user_data.name }
      state.lists_my = user_data.lists_my;
      state.lists_follow = user_data.lists_follow;

      state.loaded_from_api = true
    },

    POPULATE_CURRENT_EVENT: (state, payload) => {
      state.calendar_event = payload
    },

    CREATE_NEW_EVENT: (state) => {
        state.calendar_event = {
          id:"",
          title: "",
          date_times: [

          ],
          image:"",
          social_image:"",
          organizers:"",
          admission_fee:"none",
          venue:{
            name: "",
            id:"",
            slug:"",
            createdAt:"",
            updatedAt: "",
            g_map_link:"",
            address: ""
          },
          address: "",
          brief_description:"",
          description:"",
          website_link:"",
          eventbrite_link:"",
          fb_event_link:"",
          ticket_link:"",
          organizer_contact:"",
          multi_day: false,
          additional_dates: []

        }
      },
      DELETE_TIME_SEGMENT: (state, payload) => {
        state.calendar_event.date_times.splice(payload.index,1)
      },
      ADD_NEW_TIME_SEGMENT: (state) => {
        state.calendar_event.date_times.push({
          optional_title:"",
          start_time:"",
          end_time:""
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
    UPDATE_ALL_VENUES:(state, payload) => {
      state.all_venues = payload
    },
    PUSH_NEW_LIST: (state, payload) => {
      state.lists_my.push(payload)
    },
    PUSH_NEW_EVENT_TO_MY_LIST: (state, payload) => {

      let list_index = state.lists_my.findIndex(list => {
        console.log(list.id + " ---" + payload.list_id);
        return list.id === payload.list_id
      })

      console.log("index now is", list_index);

      state.lists_my[list_index].events.push(payload.event_data)
    },
    POPULATE_CURRENT_LIST: (state, payload) => {
      state.current_list = payload
    },

    REMOVE_FROM_CURRENT_LIST: (state, payload) =>{
      console.log("MY CURRENT LIST:", state.current_list)
      state.current_list.events = state.current_list.events.filter(event => event.id !== payload.id)
    },

    POPULATE_UNVERIFIED_LIST: (state, payload) =>{
      state.unverified_events = payload
    },
    CHANGE_STATE_TO_VERIFIED: (state, payload) =>{
      console.log(state.unverified_events.find(event => event.id === payload.id));
      state.all_local_events.push(state.unverified_events.find(event => event.id === payload.id))
      state.unverified_events = state.unverified_events.filter(event => event.id !== payload.id)
    },
    // POPULATE_calendar_event: (state, event) => {
    //   //Vue.set(state.calendar_event, 'title', event.title)
    //   state.calendar_event = event
    // },
    LOGIN: (state, payload) => {
      state.user_settings.logged_in = true;
      state.user_settings.admin_role = payload.admin_role;
    },
    LOGOUT: state => {
      state.user_settings = {
        logged_in: false,
        admin_role: false,
        username: "",
        associated_venues: []
      }
    }

  },
  actions:{

    Logout: (context, payload) => {
      logout()
      context.commit('LOGOUT')
    },
    Login: (context, payload) => {
      context.commit('LOGIN', { admin_role: isAdmin() })
    },
    CreateNewEvent: (context) =>{
      context.commit('CREATE_NEW_EVENT')
    },
    DeleteTimeSegment: (context, payload) =>{
      context.commit('DELETE_TIME_SEGMENT', payload)
    },

    AddNewTimeSegment: (context) =>{
      context.commit('ADD_NEW_TIME_SEGMENT')
    },
    UpdateCurrentTimeSegment: (context, payload) =>{
      context.commit('UPDATE_CURRENT_TIME_SEGMENT', payload)
    },




    CreateNewList: (context, payload) => {
      const _self = this
      // Hit API to create a list
      Axios.post('/lists/create-new', { list_name:payload.name, description:payload.description })
        .then(function (_response) {
          console.log(_response.data);
          if(_response.data.status === "success"){
            const empty_list = {
              id: _response.data.id,
              list_name: payload.name,
              description: payload.description,
              events:[]
            }
            context.commit('PUSH_NEW_LIST', empty_list)
          }
          else{
            ComponentEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable create an new list. Please contact us and we will figure out what went wrong. Code: #00447"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable create an new list. Please contact us and we will figure out what went wrong. Code: #00347"
          })
        });
    },
    FollowList: (context, payload) => {
      // TODO
    },
    UnFollowList: (context, payload) => {
      // TODO
    },
    AddEventToMyList: (context, payload) => {
      const _self = this
      Axios.post('/events/add',{ event_id:payload.event_data.id, list_id:payload.list_id })
        .then(function (_response) {
          if(_response.data.status === "success"){
            context.commit('PUSH_NEW_EVENT_TO_MY_LIST', {list_id:payload.list_id, event_data:payload.event_data})
            // need to get back the full list

            ComponentEventBus.$emit('SHOW_INFO', {
              message: "Added a new event to your list."
            })
          }
          else{
            ComponentEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong. Code: #33347"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong. Code: #23997"
          })

        });
    },
    RemoveEventFromList: (context, payload) => {
      const _self = this
      Axios.post('/events/remove',{ event_id:payload.event_id, list_id:payload.list_id })
        .then(function (_response) {
          if(_response.data.status === "success"){
            context.commit('REMOVE_FROM_CURRENT_LIST', _response.data)

            ComponentEventBus.$emit('SHOW_INFO', {
              message: "Event taken off your list."
            })
          }
          else{
            ComponentEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable to remove this event from your list. Please contact us and we will figure out what went wrong. Code: #2347"
            })
          }
        })
        .catch(function (error) {
          console.log("error mesg:", error);
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to remove this event from your list. Please contact us and we will figure out what went wrong. Code: #2647"
          })

        });
    },

    LoadAllUserData: (context) => {
      const showWelcome = () => {
        //Greet users who are not logged in
        ComponentEventBus.$emit('SHOW_INFO', {
          message: "Welcome! Check out the local cultural awesomeness! Please log in to start saving and sharing event lists. If we accidently missed something cool and cultural in your area, feel free to submit your own event via submissions page."
        })
      }

      if (!getIdToken()) {
        return showWelcome()
      }

      Axios.get('/users/1234556')
        .then(function (_response) {
          context.commit('UPDATE_USER_DATA', _response.data)
          showWelcome()
        })
        .catch(function (error) {
          console.error(`no user data: ${error}`);
          context.commit('UPDATE_USER_DATA', {
            user_settings: {
              logged_in: false,
              admin_role: false,
              username: "",
              associated_venues: []
            }
          })
          showWelcome()
        });
    },
    LoadAllLocalEventData: (context, payload) => {
      context.commit('SET_LOADING_STATUS', true)
      Axios.get('/events')
        .then(function (_response) {
          context.commit('UPDATE_LOCALIZED_EVENTS', _response.data.events)
          context.commit('SET_LOADING_STATUS', false)
        })
        .catch(function (error) {
          console.log(error);
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong."
          })

        });
    },
    LoadAllVenueData: (context, payload) => {
      // Axios.get('/events/current/verified')
      Axios.get('/venues')
        .then(function (_response) {
          console.log(_response.data)
          context.commit('UPDATE_ALL_VENUES', _response.data.venues)
        })
        .catch(function (error) {
          console.log(error);
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong."
          })

        });
    },

    LoadListData:(context, id) => {
      // set current_list that we will be operating on
      const req_url = "/lists/" + id;

      Axios.get(req_url)
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            console.log(_response.data)
            context.commit('POPULATE_CURRENT_LIST', _response.data.eventList)
          }
          else{
            ComponentEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable to get list data. Please contact us and we will figure out what went wrong. Code: #11647"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          ComponentEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get list data. Please contact us and we will figure out what went wrong. Code: #11007"
          })
        });
    }


  }
})
