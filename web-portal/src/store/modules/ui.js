
// initial states of UI widgets
const state = {
  sidebarOpen: false,
  notifications: {
    open: false,
    message: ''
  },
  modal: {
    open: false,
    message: ''
  }
}



const getters = {
  sidebarOpen: (state) => {
    return state.sidebarOpen
  },
  notificationsData: (state) => {
    return state.notifications
  },
  modalData: (state) => {
    return state.modal
  }
}

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebarOpen = !state.sidebarOpen
  },
  CLOSE_SIDEBAR: (state) => {
    state.sidebarOpen = false
  },
  SHOW_NOTIFICATIONS: (state, payload) => {
    state.notifications.open = payload.open
    if(payload.open){
      state.notifications.message = payload.message
    }
  },
  SHOW_MODAL: (state, payload) => {
    state.modal.open = payload.open
    if(payload.open){
      state.modal.message = payload.message
    }
  }
}

const actions = {
  toggleSidebar: (context) => {
    context.commit('TOGGLE_SIDEBAR')
  },
  closeSidebar: (context) => {
    context.commit('CLOSE_SIDEBAR')
  },
  showNotifications: (context, payload) => {
    context.commit('SHOW_NOTIFICATIONS', payload)
  },
  showModal: (context, payload) => {
    context.commit('SHOW_MODAL', payload)
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
