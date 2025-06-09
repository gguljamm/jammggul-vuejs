<template>
  <div id="InputBox" class="inputBox">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <label class="secure"><input type="checkbox" v-model="isSecure" /><div>나만보기</div></label>
        <div v-if="editData">
          <input type="date" v-model="date"/>
        </div>
      </div>
      <textarea id="TextArea" v-model="text"></textarea>
      <div class="preview" v-if="arrImage.length > 0">
        <div v-for="(x, index) in arrImage">
          <img :src="x" />
          <span @click="popImage(index)" class="fa fa-times"></span>
        </div>
      </div>
      <div class="btns">
        <input ref="inputImage" type="file" accept="image/*" multiple @input="setPreview" />
        <div>
          <button class="del" v-if="editData" @click="del"><i class="fa fa-times" aria-hidden="true"></i> 삭제</button>
          <button class="submit" @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> {{ editData ? '수정하기' : '올리기' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref as storageRef, getStorage, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import dayjs from "dayjs";
import { useStore } from '../../stores';

const store = useStore();
const db = getFirestore();

import LoadImage from 'blueimp-load-image';
const emit = defineEmits(['uploadComplete']);

const props = defineProps(['isMobile', 'editData']);

const arrImage = ref(props.editData ? [...props.editData.data.arrImage] : []);
const isSecure = ref(props.editData ? props.editData.data.isSecure : false);
const date = ref(props.editData ? props.editData.data.date : false);
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

    const storage = getStorage();
    const fileRef = storageRef(storage, decodeURIComponent(path));

    try {
      await deleteObject(fileRef);
    } catch (e) {
      console.error('Error deleting file:', e);
    }
  }
  await deleteDoc(doc(db, 'daily', props.editData.id));
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
    const ex = img.type.split('/')[1];

    const storage = getStorage();
    const _ref = storageRef(storage, `daily/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`);

    const resp = await uploadBytes(_ref, img);
    const url = await getDownloadURL(resp.ref);
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
      const path = props.editData.data.arrImage[x].split('/o/')[1].split('?')[0];

      const storage = getStorage();
      const fileRef = storageRef(storage, decodeURIComponent(path));

      try {
        await deleteObject(fileRef);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    updateDoc(doc(db, 'daily', props.editData.id), {
      content: text.value,
      date: parseInt(dayjs(date.value).format('YYYYMMDDHHmmssSSS'), 10),
      imgUrl: arrImgSrc,
      isSecure: isSecure.value,
    }).then(() => {
      store.setLoading(false);
      alert('수정 성공!'); // eslint-disable-line
      emit('uploadComplete');
    });
  } else {
    const day = dayjs();
    addDoc(collection(db, 'daily'), {
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
        align-items: center;
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
