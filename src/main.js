// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Firebase from 'firebase/compat/app';
import VueLazyload from 'vue3-lazyload';
import App from './App.vue';
import Loading from './components/Loading.vue';
import firebase from './assets/lib/plugin-firebase.js';

const app = createApp(App)

app.use(VueLazyload);
app.use(createPinia())
app.component('loading', Loading);

const config = {
  apiKey: "AIzaSyCl_3LNsOUZuIO5IBNo9EN0-Pf3SSRfUZM",
  authDomain: "jammggul2.firebaseapp.com",
  projectId: "jammggul2",
  storageBucket: "jammggul2.appspot.com",
  messagingSenderId: "81221003139",
  appId: "1:81221003139:web:ea969345e03fc16c83f8b6"
};

Firebase.initializeApp(config);
app.use(firebase);

app.mount('#app')
