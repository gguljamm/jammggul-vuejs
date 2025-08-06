<template>
  <div id="InputBox" class="inputBox">
    <div>
      <div class="date">
        <input type="number" v-model="date" placeholder="ex)20201">
      </div>
      <textarea v-model="text"></textarea>
      <div class="btns">
        <div></div>
        <button @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> {{ editData ? '수정하기' : '올리기' }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from '../../stores';
import { addDoc, doc, getFirestore, updateDoc, collection } from 'firebase/firestore';

const store = useStore();
const db = getFirestore();

const emit = defineEmits(['uploadComplete']);
const props = defineProps(['isMobile', 'editData']);

const text = ref(props.editData ? props.editData.content : '');
const date = ref(props.editData ? props.editData.date : '');

const submit = async () => {
  store.setLoading(true);

  const data = {
    content: text.value,
    date: date.value,
  };

  try {
    if (props.editData) {
      await updateDoc(doc(db, 'dev-retrospect', props.editData.id), data);
    } else {
      await addDoc(collection(db, 'dev-retrospect'), data);
    }
    alert('포스팅 성공!'); // eslint-disable-line
    emit('uploadComplete');
  } catch (error) {
    alert(error);
  } finally {
    store.setLoading(false);
  }

};
</script>

<style scoped lang="scss">
.inputBox{
  padding: 10px;
  > div{
    padding: 20px 16px 20px 16px;
    box-shadow: 0 0 4px 1px rgba(0,0,0,.1);
    background-color: #FFF;
    border-radius: 10px;
    .date{
      margin-bottom: 10px;
      > input{
        border: 1px solid #f1f2f3;
        border-radius: 10px;
        padding: 4px 10px;
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
