import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import _ from 'lodash'

import NotificationEventBus from '../helpers/NotificationEventBus.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state:{
    user_settings:{
      logged_in: false,
      admin_role: false
    },
    user_lists:[]
  },
  getters:{
    GetMyLists: state => {
      return state.user_lists.my_lists
    },

    GetListsIFollow: state => {
      return state.user_lists.lists_i_follow
    },

    GetList: (state, payload) => {
      // TODO
    },

    GetSettings: (state, payload) => {
      // TODO
    }
  },
  mutations:{
    AddAllUserData: (state, user_data) => {
      state.user_settings = _.merge({},state.user_settings,user_data.settings, user_data.permissions)
      state.user_lists = user_data.lists

      //Greet users who are not logged in
      if(state.user_settings.logged_in === false){
        NotificationEventBus.$emit('SHOW_INFO', {
          message: "Welcome! Check out the local events. Please log in to start saving and sharing event lists. Submit your own events if we accidently missed something cool and cultural in your area."
        })
      }
    },
    PushNewList: (state, payload) => {
      state.user_lists.my_lists.push(payload)
    }
  },
  actions:{
    CreateNewList: (context, payload) => {
      // Hit API to create a list
      context.commit('PushNewList', payload)
    },
    FollowList: (context, payload) => {
      // TODO
    },
    UnFollowList: (context, payload) => {
      // TODO
    },
    AddEventToList: (context, payload) => {
      // TODO
    },
    RemoveEventFromList: (context, payload) => {
      // TODO
    },
    LoadUserData: (context) => {
      const _self = this
      Axios.get('/users/1234556')
        .then(function (_response) {
          context.commit('AddAllUserData', _response.data)
        })
        .catch(function (error) {
          console.log(error);
          NotificationEventBus.$emit('SHOW_ALERT', {
            message: "Hrrmm... unable to get your data. Please contact us and we will figure out what went wrong."
          })

        });

    }
  }
})
