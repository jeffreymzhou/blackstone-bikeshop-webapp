import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

//firebase
import firebase from 'firebase'
import 'firebase/firestore'


// app.js
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import router from './router'
import store from './store'

const firebaseConfig = {
  apiKey: "AIzaSyDyfYvSBCAuG6oV7DzmmYL-RZvo0aVIuTM",
  authDomain: "blackstone-bikeshop-webapp.firebaseapp.com",
  databaseURL: "https://blackstone-bikeshop-webapp.firebaseio.com",
  projectId: "blackstone-bikeshop-webapp",
  storageBucket: "blackstone-bikeshop-webapp.appspot.com",
  messagingSenderId: "803558091672",
  appId: "1:803558091672:web:9003ae9e7edd4df5"
};

firebase.initializeApp(firebaseConfig)
var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
})
window.db = db
Vue.use(BootstrapVue)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

