import { initializeApp } from 'firebase/app';
import { collection } from 'firebase/firestore/lite';
import { GoogleAuthProvider, signInWithPopup, signOut, getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ref } from 'firebase/storage';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import config from './config.json';

// console.firebase.google.com > firebaseConfig 에서 가져오기
initializeApp(config);

export default {
  install (Vue) {
    Vue.config.globalProperties.$firebase = {
      storage: (path) => {
        return ref(path);
      },
      firestore: (path) => {
        return collection(db, path);
      },
      login: async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        let flag = false;
        if (user && user.uid === 'AOU0Bl6hvROI3w2wcCU0IDoA6At2') {
          flag = true;
        } else {
          const provider = new GoogleAuthProvider();
          signInWithPopup(auth, provider).then((result) => {
            if (result.user.uid === 'AOU0Bl6hvROI3w2wcCU0IDoA6At2') {
              flag = true;
            } else {
              alert('나만 글쓸거야!!'); // eslint-disable-line
              signOut();
            }
          }).catch((e) => {
            console.log(e);
          });
        }
        return flag;
      },
      user: () => {
        const auth = getAuth();
        return auth.currentUser && auth.currentUser.uid === 'AOU0Bl6hvROI3w2wcCU0IDoA6At2';
      },
      logout: () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          alert('로그아웃');
        });
      },
      anonymouslyLogin: async () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (!user) {
            signInAnonymously(auth);
          }
        });
      }
    };
  }
};
