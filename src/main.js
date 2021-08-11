// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Firebase from 'firebase/app';
import VueLazyload from 'vue-lazyload';
import App from './App';
import Loading from './components/Loading';
import firebase from './assets/lib/plugin-firebase';

Vue.config.productionTip = false;
Vue.use(VueLazyload);
Vue.component('loading', Loading);

const config = {
  apiKey: 'AIzaSyAqlLiycvD34mzlTSQN4aL_kaF9eXSITSk',
  authDomain: 'jammggul.firebaseapp.com',
  databaseURL: 'https://jammggul.firebaseio.com',
  projectId: 'jammggul',
  storageBucket: 'jammggul.appspot.com',
  messagingSenderId: '1013193559148',
};

Firebase.initializeApp(config);
Vue.use(firebase);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
