import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
// import { getFirestore, addDoc, collection, query, where, getDocs, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

/* eslint-disable */

export default {
  install (Vue) {
    Vue.config.globalProperties.$firebase = {
      database: (path) => {
        return Firebase.database().ref(path);
      },
      storage: (path) => {
        return Firebase.storage().ref(path);
      },
      firestore: (path) => {
        return Firebase.firestore().collection(path);
      },
      login: async () => {
        const user = Firebase.auth().currentUser;
        let flag = false;
        if (user && user.uid === 'AOU0Bl6hvROI3w2wcCU0IDoA6At2') {
          flag = true;
        } else {
          const provider = new Firebase.auth.GoogleAuthProvider();
          await Firebase.auth().signInWithPopup(provider).then((result) => {
            if (result.user.uid === 'AOU0Bl6hvROI3w2wcCU0IDoA6At2') {
              flag = true;
            } else {
              alert('나만 글쓸거야!!'); // eslint-disable-line
              Firebase.auth().signOut();
            }
          }).catch((e) => {
            console.log(e);
            alert('글을 쓰려면 로그인이 필요합니다.'); // eslint-disable-line
          });
        }
        return flag;
      },
      user: () => {
        return Firebase.auth().currentUser && Firebase.auth().currentUser.uid === 'AOU0Bl6hvROI3w2wcCU0IDoA6At2';
      },
      logout: () => {
        Firebase.auth().signOut().then(() => {
          alert('로그아웃');
        });
      },
      anonymouslyLogin: async () => {
        Firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            Firebase.auth().signInAnonymously();
          }
        });
      }
    };
  }
};
