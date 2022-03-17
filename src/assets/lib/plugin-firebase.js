import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

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
      login: async () => {
        const user = Firebase.auth().currentUser;
        let flag = false;
        if (user && user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
          flag = true;
        } else {
          const provider = new Firebase.auth.GoogleAuthProvider();
          await Firebase.auth().signInWithPopup(provider).then((result) => {
            if (result.user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
              flag = true;
            } else {
              alert('나만 글쓸거야!!'); // eslint-disable-line
              Firebase.auth().signOut();
            }
          }).catch((e) => {
            alert('글을 쓰려면 로그인이 필요합니다.'); // eslint-disable-line
          });
        }
        return flag;
      },
      user: () => {
        return Firebase.auth().currentUser && Firebase.auth().currentUser.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2';
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
