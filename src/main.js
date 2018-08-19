import Vue from 'vue';
import VueRouter from 'vue-router';
import Moment from 'moment';
import Vuetify from 'vuetify';
import VueLocalForage from '../node_modules/vlf/index.js'
import VueSmoothScroll from 'vue-smoothscroll';

import App from './App.vue'

import Home from './pages/Home.vue'
import WhoWeAre from './pages/WhoWeAre.vue'
import Legal from './pages/Legal.vue'
import OurMission from './pages/OurMission.vue'
import Admin from './pages/Admin.vue'
import AdminEventEdit from './pages/AdminEventEdit.vue'
import Contact from './pages/Contact.vue'
import UserEvents from './pages/UserEvents.vue'
import UserSettings from './pages/UserSettings.vue'
import ListViewer from './pages/ListViewer.vue'
import SubmitEvent from './pages/SubmitEvent.vue'

import FourOhFour from './pages/404.vue'
import Callback from './pages/Callback.vue'

import GlobalEventBus from './helpers/GlobalEventBus.js'

import { store } from './store/store.js'
import { requireAuth } from "./helpers/Auth"

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueLocalForage);
Vue.use(GlobalEventBus);
Vue.use(VueSmoothScroll);

const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },

      {
        path: '/who-we-are',
        name: 'who_we_are',
        component: WhoWeAre
      },
      {
        path: '/our-mission',
        name: 'our_mission',
        component: OurMission
      },
      {
        path: '/legal',
        name: 'legal',
        component: Legal
      },
      {
        path: '/admin',
        name: 'admin',
        beforeEnter: requireAuth,
        component: Admin
      },
      {
        path: '/admin-event-edit/:id',
        name: 'admin_event_edit',
        beforeEnter: requireAuth,
        component: AdminEventEdit,
        props: true
      },
      {
        path: '/contact',
        name: 'contact',
        component: Contact
      },
      {
        path: '/your-events',         //slightly more user-friendly naming might need to change later for clarity
        name: 'user_events',
        beforeEnter: requireAuth,
        component: UserEvents
      },
      {
        path: '/your-settings',      //slightly more user-friendly naming might need to change later for clarity
        name: 'user_settings',
        beforeEnter: requireAuth,
        component: UserSettings
      },
      {
        path: '/list-viewer/:id/:type',
        name: 'list_viewer',
        beforeEnter: requireAuth,
        component: ListViewer,
        props: true
      },
      {
        path: '/callback',
        name: 'callback',
        component: Callback
      },
      {
        path:'/submit-event',
        name: 'submit_event',
        component: SubmitEvent
      },
      {
        path: '*',
        name: 'error',
        component: FourOhFour
      }
    ]
})

router.beforeResolve((to, from, next) => {
  store.dispatch('closeSidebar')
  next()
})

const app = new Vue({
    router: router,
    store: store,
    render: createEle => createEle(App),
    beforeCreate: function(){
      console.log("started app");
      // can inhale user data here
      // DISPATCH to vuex
      // GlobalUserValues.$data.logged_in = true;

    }
}).$mount('#App')
