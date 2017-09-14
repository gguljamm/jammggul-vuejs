// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import * as Firebase from 'firebase';
import App from './App';
import Loading from './components/Loading';

Vue.config.productionTip = false;
Vue.use(Firebase);
Vue.component('loading', Loading);

const config = {
  apiKey: 'AIzaSyAqlLiycvD34mzlTSQN4aL_kaF9eXSITSk',
  authDomain: 'jammggul.firebaseapp.com',
  databaseURL: 'https://jammggul.firebaseio.com',
  projectId: 'jammggul',
  storageBucket: 'jammggul.appspot.com',
  messagingSenderId: '1013193559148',
};
Vue.prototype.$firebase = Firebase.initializeApp(config);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
