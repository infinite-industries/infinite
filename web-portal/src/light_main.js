/**
 * This is a special bundle for the event show page,
 * which isn't routed client-side
 *
 * Just need the navigation "toolbar"
 */
import Vue from 'vue'

import Toolbar from './components/ii-toolbar.vue'
import { store } from './store/store.js'

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  store: store,
  render: createEle => createEle(Toolbar)
}).$mount('#Toolbar')
