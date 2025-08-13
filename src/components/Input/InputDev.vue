<template>
  <div id="InputDevBox" class="inputBox">
    <div>
      <div>
        <select class="category" title="category" v-model="category">
          <option value="dev">개발 관련</option>
          <option value="it">IT 이슈</option>
          <option value="hardware">하드웨어</option>
        </select>
      </div>
      <textarea v-if="isOldContent" ref="textArea" title="textArea"></textarea>
      <p v-else class="textarea" ref="textArea" contenteditable="true"></p>
      <div class="btns">
        <input id="ImgArea" type="file" accept="image/*" @input="inputImg" />
        <div>
          <button class="del" v-if="data" @click="del">
            <i class="fa fa-times" aria-hidden="true"></i> 삭제
          </button>
          <button class="submit" @click="submit">
            <i class="fa fa-upload" aria-hidden="true"></i> {{ props.data ? '수정' : '올리기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { addDoc, deleteDoc, doc, getFirestore, updateDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref as storageRef, uploadString } from 'firebase/storage';
import dayjs from 'dayjs';
import { useStore } from '../../stores';

const store = useStore();
const db = getFirestore();
const storage = getStorage();

const props = defineProps(['isMobile', 'data']);
const emit = defineEmits(['reload']);

const isOldContent = props.data && props.data.content.slice(-6) !== '</div>';

const textArea = ref(null);
const category = ref(props.data?.category || 'dev');

const inputImg = async ($event) => {
  const file = $event.target.files[0];
  console.log(file);
  await new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const newNode = document.createElement('div');
      newNode.innerHTML = `<div><img src="${e.target.result}" /></div>`;
      textArea.value.append(newNode);
      resolve(true);
    };

    reader.readAsDataURL(file);
  });
  $event.target.value = '';
};

const del = async () => {
  store.setLoading(true);
  await deleteDoc(doc(db, 'dev-blog', props.data.id));
  store.setLoading(false);
  emit('reload');
  alert('삭제 성공!');
};

const submit = async () => {
  store.setLoading(true);
  const arrImg = [...textArea.value.querySelectorAll('img')];
  const replaceImage = (imgTag) =>
    new Promise(async (resolve) => {
      if (imgTag.src.startsWith('data:image/')) {
        const mediatype = imgTag.src.split(';')[0].split('data:image/')[1];
        const name = `dev-blog/${dayjs().format('YYYYMMDDHHmmssSSS')}.${mediatype}`;

        const _ref = storageRef(storage, name);

        const resp = await uploadString(_ref, imgTag.src, 'data_url');
        imgTag.src = await getDownloadURL(resp.ref);
        imgTag.removeAttribute('style');
        resolve(true);
      } else {
        resolve(true);
      }
    });
  await Promise.all(arrImg.map((v) => replaceImage(v)));
  const text = isOldContent
    ? textArea.value.value
    : textArea.value.innerHTML.replace(/\n\n\n/g, '\n\n');
  const thisCategory = category.value;

  if (props.data) {
    await updateDoc(doc(db, 'dev-blog', props.data.id), {
      category: thisCategory,
      content: text,
    });
  } else {
    await addDoc(collection(db, 'dev-blog'), {
      category: thisCategory,
      content: text,
      date: parseInt(dayjs().format('YYYYMMDDHHmmss'), 10),
    });
  }
  alert('포스팅 성공!');
  emit('reload');
  store.setLoading(false);
};

onMounted(() => {
  if (props.data && !isOldContent) {
    textArea.value.innerHTML = props.data.content;
  } else if (isOldContent) {
    textArea.value.value = props.data.content;
  }
});
</script>

<style lang="scss">
#InputDevBox {
  padding: 10px;
  > div {
    padding: 20px 16px 20px 16px;
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 10px;
    text-align: right;
    .textarea,
    textarea {
      width: 100%;
      height: 300px;
      margin-bottom: 10px;
      border: 1px solid #f1f2f3;
      border-radius: 10px;
      padding: 10px;
      text-align: left;
      overflow-y: auto;
      img {
        max-width: 300px;
        width: 100%;
      }
      &:focus-visible {
        outline: none;
      }
    }
    .category {
      height: 24px;
      margin: 5px 0 10px;
    }
    .desc {
      line-height: 24px;
      font-size: 14px;
    }
    .btns {
      display: flex;
      justify-content: space-between;
      .submit {
        width: 100px;
        height: 40px;
        border: 0;
        color: #fff;
        background-color: #c98474;
        border-radius: 20px;
        cursor: pointer;
      }
      .del {
        white-space: nowrap;
        width: auto;
        margin-right: 10px;
        padding: 0 10px;
        height: 40px;
        border: 0;
        color: #fff;
        background-color: coral;
        border-radius: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
