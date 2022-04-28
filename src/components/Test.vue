<template>
  <div>
    <button @click="add">ADD</button>
    <button @click="update">업데이트</button>
    <button @click="renew">dev-blog 갱신</button>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue';
import data from '../assets/jammggul-export.json';
import LoadImage from "blueimp-load-image";
const app = getCurrentInstance()
const $firebase = app.appContext.config.globalProperties.$firebase;
import dayjs from "dayjs";

const add = async () => {
  const obj = {
    k: 123444,
    b: 'cccccc',
  };
  await $firebase.firestore('daily').doc('2022-04').collection('0').add(obj);
};

const getImgSetImg = async (category, url) => (new Promise(async (resolve) => {
  if (url.indexOf('.gif') >= 0) {
    const response = await fetch(url);
    const data = await response.blob();
    const ex = url.split('%2F')[1].split('?')[0].split('.').pop();
    const filename = dayjs().format('YYYYMMDDHHmmssSSS')
    const metadata = { type: `image/${ex}` };
    const file = new File([data], filename, metadata);
    const resp = await $firebase.storage(`${category}/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`).put(file);
    resolve(resp.ref.getDownloadURL());
  } else {
    LoadImage(url, async (canvas, data) => {
      const blob = canvas.toDataURL()
      const ex = url.split('%2F')[1].split('?')[0].split('.').pop();
      const resp = await $firebase.storage(`${category}/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`).putString(blob, 'data_url');
      resolve(resp.ref.getDownloadURL());
    }, { meta: true, canvas: true });
  }
}));

const update = async () => {
  // const obj = {};
  // for (const v of Object.keys(data.daily)) {
  //   const o = data.daily[v];
  //   const ym = `${o.date}`.substring(0, 4) + '-' + `${o.date}`.substring(4, 6);
  //   if (obj[ym]) {
  //     obj[ym] += 1;
  //   } else {
  //     obj[ym] = 1;
  //   }
  // }
  // await $firebase.firestore('daily-count').doc('0').set(obj);
  /* daily백업
  const keys = Object.keys(data.daily);
  // const arr = [9];
  for (const x in keys) {
    const obj = data.daily[keys[x]];
    if (obj.imgUrl && !Array.isArray(obj.imgUrl)) {
      obj.imgUrl = [obj.imgUrl];
    } else if (!obj.imgUrl) {
      obj.imgUrl = [];
    }
    const arrPromise = obj.imgUrl.map((v) => getImgSetImg('daily', v));
    const resp = await Promise.all(arrPromise);
    const imgUrl = [];
    resp.forEach((v) => {
      imgUrl.push(v);
    });
    obj.imgUrl = imgUrl;
    obj.date = obj.date * 1000000;
    obj.isSecure = false;
    console.log(obj);
    await $firebase.firestore('daily').doc(keys[x]).set(obj);
  }
  */
  const keys = Object.keys(data.review);
  // const arr = [9];
  for (const x in keys) {
    const obj = data.review[keys[x]];
    if (obj.imgUrl && !Array.isArray(obj.imgUrl)) {
      obj.imgUrl = [obj.imgUrl];
    } else if (!obj.imgUrl) {
      obj.imgUrl = [];
    }
    const arrPromise = obj.imgUrl.map((v) => getImgSetImg('review', v));
    const resp = await Promise.all(arrPromise);
    const imgUrl = [];
    resp.forEach((v) => {
      imgUrl.push(v);
    });
    obj.imgUrl = imgUrl;
    obj.date = parseInt(dayjs().format('YYYYMMDDHHmmss'), 10);
    obj.category = obj.category === 'etc' ? 'unboxing' : ((obj.category === 'book' || obj.category === 'movie') ? 'culture' : 'game');
    console.log(obj);
    await $firebase.firestore('review').add(obj);
  }
};
const imgChange = async () => {
  $firebase.firestore('daily').get()
    .then(async (querySnapshot) => {
      for (const doc in querySnapshot) {
        console.log(doc.id, " => ", doc.data());
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

const renew = async () => {
  $firebase.firestore('dev-blog').get().then(async (querySnapshot) => {
    for (const x in querySnapshot.docs) {
      const data = querySnapshot.docs[x].data();
      $firebase.firestore('dev-blog').add({
        ...data,
        date: parseInt(dayjs().format('YYYYMMDDHHmmss'), 10),
      })
    }
    // querySnapshot.docs.forEach((x, index) => {
    //   const data = x.data();
    //   const content = { content: data.content, imgUrl: data.imgUrl };
    //   if (this.objList[data.category]) {
    //     this.objList[data.category].push(content);
    //   }
    //   if (index < 20) {
    //     this.objList.recent.push(content);
    //   }
    // });
    // this.changeIndex(this.selectIndex);
  });
};
</script>
