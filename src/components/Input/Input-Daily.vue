<template>
  <div id="InputBox" class="inputBox">
    <div>
      <textarea id="TextArea" v-model="text"></textarea>
      <div class="preview" v-if="arrImage.length > 0">
        <div v-for="(x, index) in arrImage">
          <img :src="x" />
          <span @click="popImage(index)" class="fa fa-times"></span>
        </div>
      </div>
      <div class="btns">
        <input ref="inputImage" type="file" accept="image/*" multiple @input="setPreview" />
        <button @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> 올리기</button>
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

const props = defineProps({
  isMobile: Boolean,
});

const arrImage = ref([]);
const arrCanvas = ref([]);
const inputImage = ref(null);
const text = ref('');

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
};

const setPreview = async ($event) => {
  arrImage.value = [];
  arrCanvas.value = [];
  await Promise.all([...$event.target.files].map((v) => getImage(v)));
  inputImage.value.value = '';
};

const submit = async () => {
  store.setLoading(true);
  const promise = (img) => new Promise(async (resolve) => {
    // const ex = img.substring(0, img.indexOf(';')).split('/')[1];
    const ex = img.type.split('/')[1];
    const resp = await $firebase.storage(`daily/${dayjs().format('YYYYMMDDHHmmssSSS')}.${ex}`).put(img);
    resolve(resp);
  });
  const arrPromise = arrCanvas.value.map((v) => promise(v));
  const arrImgSrc = [];
  await Promise.all(arrPromise).then(async (resp) => {
    for (let x in resp) {
      const url = await resp[x].ref.getDownloadURL();
      arrImgSrc.push(url);
    }
  });
  const day = dayjs();
  $firebase.firestore('daily').add({
    content: text.value,
    date: parseInt(day.format('YYYYMMDDHHmmss'), 10),
    imgUrl: arrImgSrc,
    isSecure: false,
  }).then(() => {
    store.setLoading(false);
    alert('포스팅 성공!'); // eslint-disable-line
    emit('uploadComplete', `${day.format('YYYY-MM')}`);
  });
};

  // import LoadImage from 'blueimp-load-image';
  //
  // export default {
  //   name: 'input-box',
  //   data() {
  //     return {
  //       arrImgUrl: [],
  //       arrPreview: [],
  //     };
  //   },
  //   props: ['isMobile'],
  //   methods: {
  //     setPreview() {
  //       const img = this.$refs.inputImg.files;
  //       for (let x = 0; x < img.length; x +=1) {
  //
  //       }
  //     },
  //     getImage() {
  //       return new Promise((resolve) => {
  //         const reader = new FileReader();
  //
  //       });
  //     },
  //     submit() {
  //       const file = document.getElementById('ImgArea').files;
  //       if (file && file.length > 0) {
  //         for (let x = 0; x < file.length; x += 1) {
  //           this.arrImgUrl.push(null);
  //           this.resizeImage(file[x], x);
  //         }
  //       } else {
  //         this.upload(false);
  //       }
  //     },
  //     submitImage(file, resizedImage, index) {
  //       const name = `daily/${file.name}`;
  //       this.$firebase.storage(name).put(resizedImage).then(async () => {
  //         const downloadUrl = await this.$firebase.storage(name).getDownloadURL();
  //         this.arrImgUrl[index] = downloadUrl;
  //         let flag = true;
  //         for (let x = 0; x < this.arrImgUrl.length; x += 1) {
  //           if (!this.arrImgUrl[x]) {
  //             flag = false;
  //             break;
  //           }
  //         }
  //         if (flag) {
  //           this.upload(true);
  //         }
  //       });
  //     },
  //     resizeImage(file, index) {
  //       if (file.type === 'image/gif') {
  //         this.submitImage(file, file, index);
  //         return false;
  //       }
  //       const reader = new FileReader();
  //       const image = new Image();
  //       const dataURItoBlob = (dataURI) => {
  //         const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
  //           atob(dataURI.split(',')[1]) :
  //           unescape(dataURI.split(',')[1]);
  //         const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //         const max = bytes.length;
  //         const ia = new Uint8Array(max);
  //         for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i);
  //         return new Blob([ia], { type: mime });
  //       };
  //       const resize = () => {
  //         LoadImage.parseMetaData(file, (data) => {
  //           let orientation = 0;
  //           if (data.exif) {
  //             orientation = data.exif.get('Orientation');
  //           }
  //           LoadImage(file, (canvas) => {
  //             const dataUrl = canvas.toDataURL(file.type);
  //             this.submitImage(file, dataURItoBlob(dataUrl), index);
  //           }, { canvas: true, orientation, maxWidth: 1280, maxHeight: 720 });
  //         });
  //       };
  //
  //       return new Promise((ok) => {
  //         if (!file.type.match(/image.*/)) {
  //           alert('no image file!'); // eslint-disable-line
  //           return;
  //         }
  //
  //         reader.onload = (readerEvent) => {
  //           image.onload = () => ok(resize());
  //           image.src = readerEvent.target.result;
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     },
  //     upload(isUrl) {
  //       const newDate = new Date();
  //       const text = document.getElementById('TextArea').value;
  //       let dateString = newDate.getFullYear();
  //       dateString += this.zeros(parseInt(newDate.getMonth(), 10) + 1);
  //       dateString += this.zeros(newDate.getDate());
  //       this.$firebase.database('/daily').push({
  //         date: parseInt(dateString, 10),
  //         content: text,
  //         imgUrl: isUrl ? this.arrImgUrl : '',
  //       }).then(() => {
  //         alert('포스팅 성공!'); // eslint-disable-line
  //         this.$emit('reload');
  //       });
  //     },
  //     zeros(n) {
  //       let zero = '';
  //       let newN = n;
  //       newN = n.toString();
  //
  //       if (newN.length < 2) {
  //         for (let i = 0; i < 2 - newN.length; i += 1) {
  //           zero += '0';
  //         }
  //       }
  //       return zero + newN;
  //     },
  //   },
  // };
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
        button{
          width: 100px;
          height: 40px;
          border: 0;
          color: #FFF;
          background-color: #c98474;
          border-radius: 20px;
          cursor: pointer;
        }
      }
    }
  }
</style>
