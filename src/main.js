import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
var VueCookie = require('vue-cookie');
Vue.config.productionTip = false;

Vue.use(VueCookie);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
