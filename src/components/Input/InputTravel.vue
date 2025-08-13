<template>
  <div id="InputBox" class="inputBox">
    <div>
      <div>여행지 <input ref="country" title="country" /></div>
      <div>도시 리스트 <input ref="tags" title="tags" type="text" /></div>
      <div>여행일자 <input ref="dates" title="dates" type="text" /></div>
      <div>설명 <textarea ref="description" title="description"></textarea></div>
      <div>썸네일 <input ref="thumbnail" type="file" title="thumbnail" /></div>
    </div>
    <button @click="submit">올리기</button>
  </div>
</template>

<script setup>
import LoadImage from 'blueimp-load-image';
import { addDoc, getFirestore, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useStore } from '@/stores';
import dayjs from 'dayjs';
import { ref } from 'vue';

const store = useStore();
const db = getFirestore();
const storage = getStorage();
const emit = defineEmits(['reload']);

const arrImgUrl = ref('');
const country = ref(null);
const tags = ref(null);
const dates = ref(null);
const description = ref(null);
const thumbnail = ref(null);

const submit = () => {
  store.setLoading(true);
  const file = thumbnail.value.files;
  if (file && file.length > 0) {
    resizeImage(file[0]);
  } else {
    upload(false);
  }
};

const submitImage = async (file, resizedImage) => {
  const name = `travel/${file.name}`;

  const _ref = storageRef(storage, name);
  const resp = await uploadBytes(_ref, resizedImage);
  arrImgUrl.value = await getDownloadURL(resp.ref);
  upload(true);
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

const upload = (url) => {
  addDoc(collection(db, 'travel'), {
    country: country.value.value,
    tags: tags.value.value,
    date: parseInt(dayjs().format('YYYYMMDDHHmmss'), 10),
    dates: dates.value.value,
    description: description.value.value,
    thumbnail: url ? arrImgUrl.value : '',
  }).then(() => {
    store.setLoading(false);
    alert('포스팅 성공!');
    emit('reload');
  });
};
</script>

<style scoped>
.inputBox {
  text-align: left;
  padding-bottom: 20px;
}
.inputBox button {
  width: 100px;
  height: 30px;
  border: 0;
  color: #fff;
  background-color: #c98474;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.inputBox > div > div {
  border: 1px solid #c98474;
  border-bottom: 0;
  padding: 10px;
  background-color: #fff;
}
.inputBox > div > div:last-child {
  border-bottom: 1px solid #c98474;
}
.inputBox textarea {
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
  resize: none;
  border: 1px solid #ccc;
}
.inputBox input {
  border: 1px solid #ccc;
}
#Category {
  height: 24px;
  margin: 0 0 5px 5px;
}
.desc {
  font-size: 14px;
}
</style>
