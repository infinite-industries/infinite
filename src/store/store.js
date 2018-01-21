import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import _ from 'lodash'

import NotificationEventBus from '../helpers/NotificationEventBus.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state:{
    loaded_from_api: false,
    user_settings:{
      logged_in: false,
      admin_role: false
    },
    current_list:{},
    user_lists:[],          // not used ???
      lists_my:[],
      lists_follow:[],
    all_local_events:[],
    unverified_events:[],    // events stay here before review and verification
    editable_event: {},      // currently unused
  },
  getters:{
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
    GetUnverifiedEvents: state =>{
      return state.unverified_events
    },
    GetSettings: state => {
      // TODO
    }
  },
  mutations:{
     UPDATE_USER_DATA: (state, user_data) => {
      state.user_settings = _.merge({},state.user_settings,user_data.settings, user_data.permissions)
      state.lists_my = user_data.lists_my;
       state.lists_follow = user_data.lists_follow;

      state.loaded_from_api = true

      //Greet users who are not logged in
      if(state.user_settings.logged_in === false){
        NotificationEventBus.$emit('SHOW_INFO', {
          message: "Welcome! Check out the local cultural awesomeness! Please log in to start saving and sharing event lists. If we accidently missed something cool and cultural in your area, feel free to submit your own event via submissions page."
        })
      }
    },
    UPDATE_LOCALIZED_EVENTS: (state, payload) => {
      state.all_local_events = payload
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
    POPULATE_CURRENT_LIST: (state, payload) =>{
      state.current_list = payload
    },
    POPULATE_UNVERIFIED_LIST: (state, payload) =>{
      state.unverified_events = payload
    },
    REMOVE_FROM_CURRENT_LIST: (state, payload) =>{
      console.log("MY CURRENT LIST:", state.current_list)
      state.current_list.events = state.current_list.events.filter(event => event.id !== payload.id)
    },
    CHANGE_STATE_TO_VERIFIED: (state, payload) =>{
      console.log(state.unverified_events.find(event => event.id === payload.id));
      state.all_local_events.push(state.unverified_events.find(event => event.id === payload.id))
      state.unverified_events = state.unverified_events.filter(event => event.id !== payload.id)
    }
  },
  actions:{

    CreateNewList: (context, payload) => {
      const _self = this
      // Hit API to create a list
      Axios.post('/lists/create-new',{list_name:payload.name, description:payload.description})
        .then(function (_response) {
          console.log(_response.data);
          if(_response.data.status === "success"){
            const empty_list = {
              list_id: _response.data.id,
              list_name: payload.name,
              description: payload.description,
              events:[]
            }
            context.commit('PUSH_NEW_LIST', empty_list)
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable create an new list. Please contact us and we will figure out what went wrong. Code: #00447"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
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
      Axios.post('/events/add',{event_id:payload.event_data.id, list_id:payload.list_id})
        .then(function (_response) {
          if(_response.data.status === "success"){
             context.commit('PUSH_NEW_EVENT_TO_MY_LIST', {list_id:payload.list_id, event_data:payload.event_data})
            // need to get back the full list
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong. Code: #33347"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong. Code: #23997"
          })

        });
    },
    RemoveEventFromList: (context, payload) => {
      const _self = this
      Axios.post('/events/remove',{event_id:payload.event_id, list_id:payload.list_id})
        .then(function (_response) {
          if(_response.data.status === "success"){
            context.commit('REMOVE_FROM_CURRENT_LIST', _response.data)
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable to remove this event from your list. Please contact us and we will figure out what went wrong. Code: #2347"
            })
          }
        })
        .catch(function (error) {
          console.log("error mesg:", error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to remove this event from your list. Please contact us and we will figure out what went wrong. Code: #2647"
          })

        });
    },

    //==========================================

    LoadAllUserData: (context) => {
      Axios.get('/users/1234556')
        .then(function (_response) {
          context.commit('UPDATE_USER_DATA', _response.data)
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get your data. Please contact us and we will figure out what went wrong."
          })

        });
    },
    LoadAllLocalEventData: (context, payload) => {
      Axios.get('/lists/all')
        .then(function (_response) {
          context.commit('UPDATE_LOCALIZED_EVENTS', _response.data.events)
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get event data. Please contact us and we will figure out what went wrong."
          })

        });
    },

    LoadListData:(context, id) => {
      // set current_list that we will be operating on
      const req_url = "/lists/" + id;

      console.log('!!! id: ' + id);
      Axios.get(req_url)
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('POPULATE_CURRENT_LIST', _response.data.eventList)
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Hrrmm... unable to get list data. Please contact us and we will figure out what went wrong. Code: #11647"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get list data. Please contact us and we will figure out what went wrong. Code: #11007"
          })
        });
    },

    //================= ADMIN =====================

    LoadUnverifiedEvents:(context, payload) => {

      Axios.get('/admin/list-unverified')
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('POPULATE_UNVERIFIED_LIST', _response.data.events)
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Was not able to find unverified events."
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "API connection bit the dust. FiX!"
          })
        });
    },
    VerifyEvent:(context, payload) => {

      Axios.post('/admin/verify-event', payload)
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('CHANGE_STATE_TO_VERIFIED', payload)

            NotificationEventBus.$emit('CALENDAR_EVENT_VERIFIED', payload)

            NotificationEventBus.$emit('SHOW_INFO', {
              message: "Success! Event verified."
            })
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Unable to verify the event"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "API connection bit the dust. FiX!"
          })
        });
    },

    UpdateEvent:(context, payload) => {

      Axios.post('/admin/update-event', {id:payload.id, data: payload.event_data})
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            console.log("yo");
            NotificationEventBus.$emit('SHOW_INFO', {
              message:"Event Successfully Updated"
            })
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message:"Unable to update event :("
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "API connection bit the dust. FiX!"
          })
        });
    },

    DeleteEvent:(context, payload) => {

      Axios.post('/admin/delete-event', {id:payload.id})
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            // context.commit('POPULATE_CURRENT_LIST', _response.data)
            NotificationEventBus.$emit('CALENDAR_EVENT_DELETED', {id:_response.data.id})
          }
          else{
            NotificationEventBus.$emit('SHOW_ALERT', {
              message: "Unable to delete the event"
            })
          }
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "API connection bit the dust. FiX!"
          })
        });
    }

  }
})
