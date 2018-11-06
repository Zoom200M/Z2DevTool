import Vue from 'vue'
import axios from 'axios'
// import ElectronPhoton from 'electron-photon'
import App from './App'
import router from './router'
import './assets/css/photon.css'
// config.json这个文件中就是默认的初始配置
import config from './assets/config.json'
import Store from 'electron-store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
const store = new Store();
if (!store.get('categories')) { // 初始化默认配置
  store.set(config);
}
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
// Vue.use(ElectronPhoton)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
