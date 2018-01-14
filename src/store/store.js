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
    all_local_events:[]
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
    PopulateCurrentList: (state, payload) =>{
      state.current_list = payload
    }
  },
  actions:{

    CreateNewList: (context, payload) => {
      const _self = this
      // Hit API to create a list
      Axios.post('/lists/create-new',{name:payload.name, description:payload.description})
        .then(function (_response) {

          const empty_list = {
            list_id: _response.data.id,
            list_name: payload.name,
            description: payload.description,
            events:[]
          }
          context.commit('PushNewList', empty_list)
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong."
          })

        });
    },
    FollowList: (context, payload) => {
      // TODO
    },
    UnFollowList: (context, payload) => {
      // TODO
    },
    AddEventToList: (context, payload) => {
      const _self = this
      Axios.post('/events/add',{event_id:EVENT_ID, list_id:LIST_ID})
        .then(function (_response) {
          context.commit('UpdateListData', _response.data)
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable add this event to your list. Please contact us and we will figure out what went wrong."
          })

        });
    },
    RemoveEventFromList: (context, payload) => {
      // TODO
      console.log("remove " + payload.event +" from "+ payload.list);
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

      Axios.get(req_url)
        .then(function (_response) {
          // console.log("data from server: ",response.data.events);
          context.commit('PopulateCurrentList', _response.data)
        })
        .catch(function (error) {
          console.log(error);
        });

    }

  }
})
