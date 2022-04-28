<template>
  <div class="devRetrospect">
    <div class="btns">
      <button @click="authClick"><i :class="isAuth ? 'fa fa-times' : 'fa fa-pencil'" aria-hidden="true"></i></button>
    </div>
    <input-retrospect v-if="isAuth" v-bind:isMobile="isMobile" @uploadComplete="getData"></input-retrospect>
    <loading v-if="!loaded"></loading>
    <ul>
      <li v-for="x in itemsView">
        <div>{{ `${x.date}`.substring(0, 4) }}년 {{ `${x.date}`.substring(4, 5) }}분기</div>
        <div>
          <div v-for="x in x.content.split('\n')">{{ x }}<br></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import InputRetrospect from "../Input/Input-Retrospect.vue";
import {ref, getCurrentInstance, onMounted} from 'vue';
const app = getCurrentInstance();
const $firebase = app.appContext.config.globalProperties.$firebase;

const loaded = ref(false);
const isAuth = ref(false);
const itemsView = ref([]);

const authClick = async () => {
  if (isAuth.value) {
    isAuth.value = false;
    return;
  }
  isAuth.value = await $firebase.login();
};

const props = defineProps({
  isMobile: Boolean,
});

const getData = async () => {
  isAuth.value = false;
  loaded.value = false;
  const querySnapshot = await $firebase.firestore('dev-retrospect').get()
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const d = doc.data();
    itemsView.value.push(d);
  });
  loaded.value = true;
}

onMounted(() => {
  getData();
});
</script>

<style lang="scss">
.devRetrospect{
  max-width: 1080px;
  margin: 0 auto;
  .btns{
    display: flex;
    margin-top: 10px;
    padding: 0 10px;
    justify-content: end;
    > button{
      margin-left: 10px;
      padding: 0;
      height: 40px;
      width: 40px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 16px;
      background-color: #FFF;
      box-shadow: 0 0 4px 1px rgba(0, 0, 0, .1);
      border: 1px solid #c98474;
    }
  }
  ul{
    padding: 20px 10px 0;
    li{
      line-height: 24px;
      box-shadow: 0 0 10px 1px rgba(0,0,0,.1);
      border: 1px solid #d7d8d9;
      border-radius: 8px;
      margin-bottom: 20px;
      padding: 10px;
      > div:first-of-type{
        padding-bottom: 10px;
        border-bottom: 1px solid #e1e3e5;
      }
      > div:nth-of-type(2){
        padding-top: 10px;
      }
    }
  }
}
</style>
