import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import Moment from 'moment';
import Vuetify from 'vuetify';

import App from './App.vue';

Vue.use(VueRouter);
Vue.use(Vuetify);

const app = new Vue({
    // router,
    render: createEle => createEle(App),
    beforeCreate: function(){
      console.log("started app");
      // can inhale user data here
    }
}).$mount('#App')
