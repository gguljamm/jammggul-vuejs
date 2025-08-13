<template>
  <div class="inputReview" @click="$emit('close-pop')">
    <div @click.stop>
      <div>
        <select ref="category">
          <option value="game">게임</option>
          <option value="movie">문화</option>
          <option value="etc">언박싱</option>
        </select>
      </div>
      <div>
        <input class="textInput" ref="title" type="text" />
      </div>
      <div>
        <textarea ref="content"></textarea>
      </div>
      <div>
        <input @change="imgUpload" ref="url" type="file" />
        <button @click="submit">올리기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoadImage from 'blueimp-load-image';
import { addDoc, getFirestore, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import dayjs from 'dayjs';
import { useStore } from '@/stores';
import { ref } from 'vue';

const db = getFirestore();
const storage = getStorage();
const store = useStore();
const emit = defineEmits(['reload']);

const category = ref(null);
const title = ref(null);
const content = ref(null);
const url = ref(null);
const arrImg = ref([]);

const submit = () => {
  store.setLoading(true);

  addDoc(collection(db, 'review'), {
    category: category.value.value,
    title: title.value.value,
    content: content.value.value,
    imgUrl: arrImg.value,
    date: parseInt(dayjs().format('YYYYMMDDHHmmss'), 10),
  }).then(() => {
    store.setLoading(false);
    alert('포스팅 성공!');
    emit('reload');
  });
};

const imgUpload = () => {
  resizeImage(url.value.files[0]);
};

const submitImage = async (file, resizedImage) => {
  const name = `review/${file.name}`;

  const _ref = storageRef(storage, name);
  const resp = await uploadBytes(_ref, resizedImage);
  const downloadUrl = await getDownloadURL(resp.ref);

  arrImg.value.push(downloadUrl);
  content.value.value += `#img${arrImg.value.length - 1}#\n`;
  url.value.value = '';
};

const resizeImage = (file) => {
  if (file.type === 'image/gif') {
    submitImage(file, file);
    return false;
  }
  const reader = new FileReader();
  const image = new Image();
  const dataURItoBlob = (dataURI) => {
    const bytes =
      dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };
  const resize = () => {
    LoadImage.parseMetaData(file, (data) => {
      let orientation = 0;
      if (data.exif) {
        orientation = data.exif.get('Orientation');
      }
      LoadImage(
        file,
        (canvas) => {
          const dataUrl = canvas.toDataURL(file.type);
          submitImage(file, dataURItoBlob(dataUrl));
        },
        { canvas: true, orientation, maxWidth: 1280, maxHeight: 720 },
      );
    });
  };

  return new Promise((ok) => {
    if (!file.type.match(/image.*/)) {
      alert('no image file!');
      return;
    }

    reader.onload = (readerEvent) => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};
</script>

<style scoped lang="scss">
.inputReview {
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
}
.inputReview > div {
  max-width: 1080px;
  padding: 20px;
  max-height: 100%;
  top: 50%;
  border-radius: 8px;
  transform: translateY(-50%);
  position: relative;
  margin: 0 auto;
  overflow-y: auto;
  background-color: #fff;
}
.inputReview > div > div:not(:last-child) {
  margin-bottom: 10px;
}
.inputReview > div > div:last-child {
  display: flex;
  justify-content: space-between;
  button {
    width: 100px;
    height: 40px;
    border: 0;
    color: #fff;
    background-color: #c98474;
    border-radius: 20px;
    cursor: pointer;
  }
}
textarea {
  border: 1px solid #ddd;
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
  resize: none;
}
.textInput {
  border: 1px solid #ddd;
  width: 100%;
  height: 30px;
  line-height: 28px;
}
</style>
