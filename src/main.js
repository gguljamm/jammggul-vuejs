// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Firebase from 'firebase/compat/app';
import VueLazyload from 'vue3-lazyload';
import App from './App.vue';
import Loading from './components/Loading.vue';
import firebase from './assets/lib/plugin-firebase.js';
import firebaseConfig from './firebase.json';

const app = createApp(App)

app.use(VueLazyload);
app.use(createPinia())
app.component('loading', Loading);

const config = firebaseConfig;

Firebase.initializeApp(config);
app.use(firebase);

app.mount('#app')
