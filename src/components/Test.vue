<template>
  <div>
    <button @click="add">ADD</button>
    <button @click="update">업데이트</button>
    <button @click="imgChange">이미지갱신</button>
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

const getImgSetImg = async (url) => (new Promise(async (resolve) => {
  if (url.indexOf('.gif') >= 0) {
    const response = await fetch(url);
    const data = await response.blob();
    const ex = url.split('%2F')[1].split('?')[0].split('.').pop();
    const filename = dayjs().format('YYYYMMDDHHmmssSSS')
    const metadata = { type: `image/${ex}` };
    const file = new File([data], filename, metadata);
    const resp = await $firebase.storage(`daily/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`).put(file);
    resolve(resp.ref.getDownloadURL());
  } else {
    LoadImage(url, async (canvas, data) => {
      const blob = canvas.toDataURL()
      const ex = url.split('%2F')[1].split('?')[0].split('.').pop();
      const resp = await $firebase.storage(`daily/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`).putString(blob, 'data_url');
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
  const keys = Object.keys(data.daily);
  // const arr = [9];
  for (const x in keys) {
    const obj = data.daily[keys[x]];
    if (obj.imgUrl && !Array.isArray(obj.imgUrl)) {
      obj.imgUrl = [obj.imgUrl];
    } else if (!obj.imgUrl) {
      obj.imgUrl = [];
    }
    const arrPromise = obj.imgUrl.map((v) => getImgSetImg(v));
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
</script>
