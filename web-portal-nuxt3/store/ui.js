export const state = () => {
  return {
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
}

export const getters = {
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

export const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebarOpen = !state.sidebarOpen
  },
  CLOSE_SIDEBAR: (state) => {
    state.sidebarOpen = false
  },
  SHOW_NOTIFICATIONS: (state, payload) => {
    state.notifications.open = payload.open
    if (payload.open) {
      state.notifications.message = payload.message
    }
  },
  SHOW_MODAL: (state, payload) => {
    state.modal.open = payload.open
    if (payload.open) {
      state.modal.message = payload.message
    }
  }
}

export const actions = {
  toggleSidebar: function (context) {
    context.commit('TOGGLE_SIDEBAR')
  },
  closeSidebar: function (context) {
    context.commit('CLOSE_SIDEBAR')
  },
  showNotifications: function (context, payload) {
    context.commit('SHOW_NOTIFICATIONS', payload)
  },
  showModal: function (context, payload) {
    context.commit('SHOW_MODAL', payload)
  }
}

export const COMMIT_SHOW_NOTIFICATIONS = 'ui/SHOW_NOTIFICATIONS'
