import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

import NotificationEventBus from '../helpers/NotificationEventBus.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state:{
    user:{
      logged_in: false,
      admin_role: false
    },
    test_lists:[
      { list_name: "cataaaadatata" },
      { list_name: "dog" }
    ]
  },
  mutations:{
    AddNewList: state => {
      state.test_lists.push({list_name: "bird"})
    }
  },
  actions:{
    CreateNewListAndAddIt: context => {
      //EventBus.$emit('test-event', {stuff:"stuff"})
      context.commit('AddNewList')
    }
  }
})
