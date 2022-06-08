<template>
  <div id="InputDevBox" class="inputBox">
    <div>
      <div class="desc">( a태그 공간 #url#유알엘#url#설명#url# 이미지 공간 #img# )</div>
      <div>
        <select ref="category" class="category" title="category">
          <option value="it">IT</option>
          <option value="dev">dev</option>
          <option value="hardware">hardware</option>
        </select>
      </div>
<!--      <textarea ref="textArea" title="textArea"></textarea>-->
      <p class="textarea" ref="textArea" contenteditable="true"></p>
      <div class="btns">
        <input id="ImgArea" type="file" accept="image/*" @input="inputImg">
        <button class="del" v-if="data" @click="del"><i class="fa fa-times" aria-hidden="true"></i> 삭제</button>
        <button class="submit" @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> 올리기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, onMounted} from 'vue';
const app = getCurrentInstance();
const $firebase = app.appContext.config.globalProperties.$firebase;

// import LoadImage from 'blueimp-load-image';
import dayjs from "dayjs";
import { useStore } from "../../stores";
const store = useStore();

const props = defineProps(['isMobile', 'data']);
const emit = defineEmits(['reload']);

const textArea = ref(null);
const category = ref(null);

const inputImg = async ($event) => {
  const file = $event.target.files[0];
  console.log(file);
  await new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const newNode = document.createElement('div');
      newNode.innerHTML = `<div><img src="${ e.target.result }" /></div>`;
      textArea.value.append(newNode);
      resolve(true);
    };

    reader.readAsDataURL(file);
  });
  $event.target.value = '';
};

const del = async () => {
  store.setLoading(true);
  await $firebase.firestore('dev-blog').doc(props.data.id).delete();
  store.setLoading(false);
  emit('reload');
  alert('삭제 성공!'); // eslint-disable-line
};

const submit = async () => {
  store.setLoading(true);
  const arrImg = [...textArea.value.querySelectorAll('img')];
  const replaceImage = (imgTag) => (
    new Promise(async (resolve) => {
      if (imgTag.src.startsWith('data:image/')) {
        const mediatype = imgTag.src.split(';')[0].split('data:image/')[1];
        const name = `dev-blog/${dayjs().format('YYYYMMDDHHmmssSSS')}.${mediatype}`;
        $firebase.storage(name).putString(imgTag.src, 'data_url').then(async (snap) => {
          const url = await snap.ref.getDownloadURL();
          imgTag.src = url;
          imgTag.removeAttribute('style');
          resolve(true);
        }).catch((e) => {
          console.log(e);
        });
      }
    })
  );
  await Promise.all(arrImg.map((v) => replaceImage(v)));
  const text = textArea.value.innerHTML.replace(/\n\n\n/g, '\n\n');
  const thisCategory = category.value.value;

  await $firebase.firestore('dev-blog').add({
    category: thisCategory,
    content: text,
    date: parseInt(dayjs().format('YYYYMMDDHHmmss'), 10),
  });
  alert('포스팅 성공!'); // eslint-disable-line
  emit('reload');
  store.setLoading(false);
};

onMounted(() => {
  if (props.data) {
    textArea.value.innerHTML = props.data.content;
  }
});
</script>

<style lang="scss">
#InputDevBox{
  padding: 10px;
  > div{
    padding: 20px 16px 20px 16px;
    box-shadow: 0 0 4px 1px rgba(0,0,0,.1);
    background-color: #FFF;
    border-radius: 10px;
    text-align: right;
    .textarea{
      width: 100%;
      height: 300px;
      margin-bottom: 10px;
      border: 1px solid #f1f2f3;
      border-radius: 10px;
      padding: 10px;
      text-align: left;
      overflow-y: auto;
      img{
        max-width: 300px;
        width: 100%;
      }
      &:focus-visible{
        outline: none;
      }
    }
    .category{
      height: 24px;
      margin: 5px 0 10px;
    }
    .desc{
      line-height: 24px;
      font-size: 14px;
    }
    .btns{
      display: flex;
      justify-content: space-between;
      .submit{
        width: 100px;
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
