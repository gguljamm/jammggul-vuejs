<template>
  <div id="InputBox" class="inputBox">
    <div>
      <label class="secure"><input type="checkbox" v-model="isSecure" /><div>나만보기</div></label>
      <textarea id="TextArea" v-model="text"></textarea>
      <div class="preview" v-if="arrImage.length > 0">
        <div v-for="(x, index) in arrImage">
          <img :src="x" />
          <span @click="popImage(index)" class="fa fa-times"></span>
        </div>
      </div>
      <div class="btns">
        <input ref="inputImage" type="file" accept="image/*" multiple @input="setPreview" />
        <button class="del" v-if="editData" @click="del"><i class="fa fa-times" aria-hidden="true"></i> 삭제</button>
        <button class="submit" @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> {{ editData ? '수정하기' : '올리기' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import dayjs from "dayjs";
import { useStore } from '../../stores';

const store = useStore();
const app = getCurrentInstance()
const $firebase = app.appContext.config.globalProperties.$firebase

import LoadImage from 'blueimp-load-image';
const emit = defineEmits(['uploadComplete']);

const props = defineProps(['isMobile', 'editData']);

const arrImage = ref(props.editData ? [...props.editData.data.arrImage] : []);
const isSecure = ref(props.editData ? props.editData.data.isSecure : false);
const arrCanvas = ref(props.editData ? [...props.editData.data.arrImage] : []);
const inputImage = ref(null);
const text = ref(props.editData ? props.editData.data.text : '');

const getImage = (file) => (
  new Promise((resolve) => {
    LoadImage(file, (img) => {
      arrImage.value.push(img.toDataURL(file.type));
      arrCanvas.value.push(file);
      resolve(true);
    }, { maxWidth: 1280, maxHeight: 720, meta: true, canvas: true, orientation: true });
  })
);

const popImage = (index) => {
  arrImage.value.splice(index, 1);
  arrCanvas.value.splice(index, 1);
};

const setPreview = async ($event) => {
  await Promise.all([...$event.target.files].map((v) => getImage(v)));
  inputImage.value.value = '';
};

const del = async () => {
  store.setLoading(true);
  for (let x in props.editData.data.arrImage) {
    const path = props.editData.data.arrImage[x].split('/o/')[1].split('?')[0];
    await $firebase.storage(decodeURIComponent(path)).delete();
  }
  await $firebase.firestore('daily').doc(props.editData.id).delete();
  store.setLoading(false);
  alert('삭제 성공!'); // eslint-disable-line
  const ym = `${`${props.editData.data.date}`.substring(0, 4)}-${`${props.editData.data.date}`.substring(5, 7)}`;
  emit('uploadComplete', ym, true);
};

const submit = async () => {
  store.setLoading(true);
  const promise = (img) => new Promise(async (resolve) => {
    if (typeof img === 'string') {
      resolve(img);
      return;
    }
    // const ex = img.substring(0, img.indexOf(';')).split('/')[1];
    const ex = img.type.split('/')[1];
    const resp = await $firebase.storage(`daily/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`).put(img);
    const url = await resp.ref.getDownloadURL();
    resolve(url);
  });
  const arrPromise = arrCanvas.value.map((v) => promise(v));
  const arrImgSrc = [];
  await Promise.all(arrPromise).then((resp) => {
    for (let x in resp) {
      const url = resp[x];
      arrImgSrc.push(url);
    }
  });
  if (props.editData) {
    const arrDelImg = props.editData.data.arrImage.filter((v) => !arrImage.value.some((v2) => v2 === v))
    for (let x in arrDelImg) {
      const path = arrDelImg[x].split('/o/')[1].split('?')[0];
      await $firebase.storage(decodeURIComponent(path)).delete();
    }
    $firebase.firestore('daily').doc(props.editData.id).update({
      content: text.value,
      imgUrl: arrImgSrc,
      isSecure: isSecure.value,
    }).then(() => {
      store.setLoading(false);
      alert('수정 성공!'); // eslint-disable-line
      emit('uploadComplete');
    });
  } else {
    const day = dayjs();
    $firebase.firestore('daily').add({
      content: text.value,
      date: parseInt(day.format('YYYYMMDDHHmmss'), 10),
      imgUrl: arrImgSrc,
      isSecure: isSecure.value,
    }).then(() => {
      store.setLoading(false);
      alert('포스팅 성공!'); // eslint-disable-line
      emit('uploadComplete', `${day.format('YYYY-MM')}`);
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .inputBox{
    padding: 10px;
    > div{
      padding: 20px 16px 20px 16px;
      box-shadow: 0 0 4px 1px rgba(0,0,0,.1);
      background-color: #FFF;
      border-radius: 10px;
      .secure{
        display: flex;
        align-items: center;
        padding-bottom: 4px;
        > div{
          margin-left: 4px;
        }
      }
      textarea{
        width: 100%;
        height: 300px;
        margin-bottom: 10px;
        resize: none;
        border: 1px solid #f1f2f3;
        border-radius: 10px;
        padding: 10px;
        &:focus-visible{
          outline: none;
        }
      }
      .preview{
        display: flex;
        margin-bottom: 10px;
        > div{
          margin-right: 10px;
          position: relative;
          height: 80px;
          width: 80px;
          display: flex;
          align-items: center;
          outline: 1px solid #f1f2f3;
          img{
            display: block;
            max-height: 80px;
            max-width: 80px;
            margin: 0 auto;
          }
          span{
            top: -4px;
            right: -4px;
            position: absolute;
            font-size: 12px;
            color: #FFF;
            background-color: #2c3e50;
            border-radius: 8px;
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            box-shadow: 0 0 2px 1px rgba(0, 0, 0, .1);
          }
          &:last-of-type{
            margin-right: 0;
          }
        }
      }
      .btns{
        display: flex;
        justify-content: space-between;
        .submit{
          white-space: nowrap;
          padding: 0 10px;
          width: auto;
          height: 40px;
          border: 0;
          color: #FFF;
          background-color: #c98474;
          border-radius: 20px;
          cursor: pointer;
        }
        .del{
          white-space: nowrap;
          width: auto;
          margin-right: 10px;
          padding: 0 10px;
          height: 40px;
          border: 0;
          color: #FFF;
          background-color: coral;
          border-radius: 20px;
          cursor: pointer;
        }
      }
    }
  }
</style>
