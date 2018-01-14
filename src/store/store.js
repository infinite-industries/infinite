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
    user_lists:[],
      lists_my:[],
      lists_follow:[],
    all_local_events:[],
    unverified_events:[],    // events stay here before review and verification
    editable_event: {}
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

    GetSettings: state => {
      // TODO
    }
  },
  mutations:{
     UpdateAllUserData: (state, user_data) => {
      state.user_settings = _.merge({},state.user_settings,user_data.settings, user_data.permissions)
      state.lists_my = user_data.lists_my;
       state.lists_follow = user_data.lists_follow;

      state.loaded_from_api = true

      //Greet users who are not logged in
      if(state.user_settings.logged_in === false){
        NotificationEventBus.$emit('SHOW_INFO', {
          message: "Welcome! Check out the local events. Please log in to start saving and sharing event lists. Submit your own events if we accidently missed something cool and cultural in your area."
        })
      }
    },
    UpdateAllLocalEvents: (state, payload) => {
      state.all_local_events = payload
    },
    PushNewList: (state, payload) => {
      state.lists_my.push(payload)
    },
    PushNewEventToMyList: (state, payload) => {
      let list_index = state.user_lists.my_lists.findIndex(list => list.list_id === payload.list_id)
      state.user_lists.my_lists[list_index].push(payload.event_data)
    },
    PopulateCurrentList: (state, payload) =>{
      state.current_list = payload
    },
    RemoveFromCurrentList: (state, payload) =>{
      console.log("MY CURRENT LIST:", state.current_list)
      state.current_list.events = state.current_list.events.filter(event => event.id !== payload.id)
    },
  },
  actions:{

    CreateNewList: (context, payload) => {
      const _self = this
      // Hit API to create a list
      Axios.post('/lists/create-new',{name:payload.name, description:payload.description})
        .then(function (_response) {
          if(_response.data.status === "success"){
            const empty_list = {
              list_id: _response.data.id,
              list_name: payload.name,
              description: payload.description,
              events:[]
            }
            context.commit('PushNewList', empty_list)
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
             context.commit('PushNewEventToMyList', {list_id:payload.list_id, event_data:payload.event_data})
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
            context.commit('RemoveFromCurrentList', _response.data)
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
          context.commit('UpdateAllUserData', _response.data)
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
          context.commit('UpdateAllLocalEvents', _response.data.events)
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
            context.commit('PopulateCurrentList', _response.data.eventList)
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
            context.commit('PopulateUnverifiedList', _response.data)
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
    ShowUnverifiedEvent:(context, payload) => {

      Axios.post('/admin/show-event', {id:payload.event_id})
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('PopulateCurrentList', _response.data)
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
            message: "API connection bit the dust. FiX!"
          })
        });
    },

    VerifyEvent:(context, payload) => {

      Axios.post('/admin/verify-event', {id:payload.event_id})
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('PopulateCurrentList', _response.data)
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

      Axios.post('/admin/update-event', {id:payload.event_id})
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('PopulateCurrentList', _response.data)
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

      Axios.post('/admin/delete-event', {id:payload.event_id})
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          if(_response.data.status === "success"){
            context.commit('PopulateCurrentList', _response.data)
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
