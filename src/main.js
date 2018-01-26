import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import Moment from 'moment';
import Vuetify from 'vuetify';
import VueLocalForage from '../node_modules/vlf/index.js'

import App from './App.vue';

import Home from './pages/Home.vue';
import About from './pages/About.vue';
import Admin from './pages/Admin.vue';
import AdminEventEdit from './pages/AdminEventEdit.vue';
import Contact from './pages/Contact.vue';
import UserEvents from './pages/UserEvents.vue';
import UserSettings from './pages/UserSettings.vue';
import ListViewer from './pages/ListViewer.vue'
import Logout from './pages/Logout.vue';
import SubmitEvent from './pages/SubmitEvent.vue'

import GlobalEventBus from './helpers/GlobalEventBus.js'

import { store } from './store/store.js'


Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueLocalForage);
Vue.use(GlobalEventBus);

const router = new VueRouter({
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },

      {
        path: '/about',
        name: 'about',
        component: About
      },
      {
        path: '/admin',
        name: 'admin',
        component: Admin
      },
      {
        path: '/admin-event-edit/:id',
        name: 'admin_event_edit',
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
        component: UserEvents
      },
      {
        path: '/your-settings',      //slightly more user-friendly naming might need to change later for clarity
        name: 'user_settings',
        component: UserSettings
      },
      {
        path: '/list-viewer/:id/:type',
        name: 'list_viewer',
        component: ListViewer,
        props: true
      },
      {
        path: '/logout',
        name: 'logout',
        component: Logout
      },
      {
        path:'/submit-event',
        name: 'submit_event',
        component: SubmitEvent
      }
    ]
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
