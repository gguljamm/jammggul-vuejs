<template>
<div id="DevInfo">
  <div class="btns">
    <button @click="authClick"><i :class="isAuth ? 'fa fa-times' : 'fa fa-pencil'" aria-hidden="true"></i></button>
  </div>
  <input-it v-if="isAuth" :isMobile="isMobile" @reload="getData" :data="editData" :key="editData ? editData.id : ''"></input-it>
  <div class="devWrapper">
    <div>
      <div>
        <div>
          <span>IT<br>Information</span><br>
          <span>IT트랜드와 개발 이슈등을 저장하는 공간</span>
        </div>
      </div>
      <div>
        <div class="categoryBox">
          <p>카테고리</p>
          <ul class="category">
            <li @click="changeIndex('recent')" :class="selectedIndex === 'recent' ? 'selected' : ''">RECENT 20</li>
            <li @click="changeIndex('it')" :class="selectedIndex === 'it' ? 'selected' : ''">IT <span>({{ objCount.it }})</span></li>
            <li @click="changeIndex('dev')" :class="selectedIndex === 'dev' ? 'selected' : ''">웹개발 <span>({{ objCount.dev }})</span></li>
            <li @click="changeIndex('hardware')" :class="selectedIndex === 'hardware' ? 'selected' : ''">하드웨어 <span>({{ objCount.hardware }})</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="itList" v-if="!isMobile">
      <ul>
        <transition-group name="component-fade" mode="out-in">
          <blog-content
            v-for="(list, idx) in filteredData.filter((_, index) => index % 2 === 0)" :key="list.id" :data="list" @imgPopupOpen="imgPopupOpen" @openEdit="openEdit"
          ></blog-content>
        </transition-group>
      </ul>
      <ul>
        <transition-group name="component-fade" mode="out-in">
          <blog-content
            v-for="(list, idx) in filteredData.filter((_, index) => index % 2 === 1)" :key="list.id" :data="list" @imgPopupOpen="imgPopupOpen" @openEdit="openEdit"
          ></blog-content>
        </transition-group>
      </ul>
    </div>
    <div class="itList" v-else>
      <ul>
        <transition-group name="component-fade" mode="out-in">
          <blog-content
            v-for="(list, idx) in filteredData" :key="list.id" :data="list" @imgPopupOpen="imgPopupOpen" @openEdit="openEdit"
          ></blog-content>
        </transition-group>
      </ul>
    </div>
  </div>
  <div v-if="popImgSrc" @click="imgPopupOpen(null)" class="imgPop">
    <div>
      <img :src="popImgSrc" ref="popImg">
    </div>
  </div>
</div>
</template>

<script setup>
import InputIt from '../Input/InputDev.vue';
import BlogContent from './BlogContent.vue';

import { ref, onMounted, getCurrentInstance, computed } from 'vue';
const app = getCurrentInstance()
const $firebase = app.appContext.config.globalProperties.$firebase;

const props = defineProps(['isMobile']);

const objCount = ref({
  it: 0,
  dev: 0,
  hardware: 0,
});
const allData = ref([]);
const filteredData = computed(() => {
  if (selectedIndex.value === 'recent') {
    return allData.value.slice(0, 20);
  }
  return allData.value.filter((v) => v.category === selectedIndex.value)
});

const getData = () => {
  isAuth.value = false;
  $firebase.firestore('dev-blog').orderBy('date', 'desc').get().then((querySnapshot) => {
    allData.value = [];
    querySnapshot.docs.forEach((x) => {
      const data = x.data();
      allData.value.push({
        ...data,
        id: x.id,
      });
      objCount.value[data.category] += 1;
    });
  });
};

const selectedIndex = ref('recent');
const changeIndex = (tag) => {
  selectedIndex.value = tag;
};

const isAuth = ref(false);
const authClick = async () => {
  if (isAuth.value) {
    isAuth.value = false;
    editData.value = null;
    return;
  }
  isAuth.value = await $firebase.login();
};

const popImgSrc = ref(null);
const imgPopupOpen = (imgUrl) => {
  popImgSrc.value = imgUrl;
};

const editData = ref(null);
const openEdit = (index) => {
  console.log(index);
  if (isAuth.value) {
    editData.value = filteredData.value.find((v) => v.id === index);
    window.scrollTo(0, 0);
  }
};

onMounted(() => {
  getData();
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#DevInfo{
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
  .devWrapper{
    width: 100%;
    position: relative;
    > div {
      margin-top: 10px;
    }
  }
  .itList > ul, .devWrapper > div > div{
    float:left;
    width: 50%;
  }
}
  .devWrapper > div > div > div{
    margin: 0 10px 20px 10px;
    background-color: #FFF;
    padding: 30px 20px;
    word-break: break-all;
  }
  .devWrapper > div > div > div{
    min-height: 300px;
  }
  .devWrapper > div > div:first-child > div{
    background-color: transparent;
    padding-left: 40px;
    padding-top: 70px;
  }
  .devWrapper > div > div > div > span:first-child{
    font-size: 60px;
    line-height: 50px;
    font-family: 'Baloo Bhaijaan', sans-serif;
    color: #f2d388;
    white-space: nowrap;
  }
  .devWrapper > div > div > div > span:last-child{
    font-size: 20px;
    line-height: 40px;
    white-space: nowrap;
  }
  .categoryBox p{
    margin: 0;
    font-size: 20px;
    line-height: 24px;
    font-weight: bold;
  }
  .category{
    padding: 10px;
  }
  .category > li{
    cursor: pointer;
    border-bottom: 1px solid #eee;
    padding: 10px;
    margin-top: 10px;
    transition: .2s ease;
  }
  .category > li.selected{
    color: coral;
    font-weight: bold;
  }
  .category > li:not(.selected):hover{
    color: coral;
    opacity: .8;
  }
  .imgPop{
    z-index: 11;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    cursor: zoom-out;
  }
  .imgPop.over{
    overflow: auto;
  }
  .imgPop > div{
    max-width: 1080px;
    margin: 0 auto;
    text-align: center;
    height: 100%;
  }
  .imgPop > div > img{
    position: relative;
    max-width: 100%;
    box-shadow: 0 0 10px 1px rgba(0,0,0,.1);
  }
  .imgPop.over > div > img{
    margin: 40px 0;
  }
  .imgPop:not(.over) > div > img{
    top: 50%;
    transform: translateY(-50%);
  }
  @media all and (max-width: 940px){
    #DevInfo .devWrapper > div > div > div > span:first-child{
      font-size: 60px;
      line-height: 50px;
      font-family: 'Baloo Bhaijaan', sans-serif;
      color: #f2d388;
    }
  }
  @media all and (max-width: 768px){
    #DevInfo .devWrapper .itList > ul, #DevInfo .devWrapper > div > div{
      width: 100%;
      float: none;
    }
    #DevInfo .devWrapper > div > div:first-child > div{
      padding: 10px;
      min-height: inherit;
    }
    #DevInfo .devWrapper > div > div > div > span:first-child{
      font-size: 30px;
      line-height: 20px
    }
    #DevInfo .devWrapper > div > div > div > span:last-child{
      font-size: 16px;
      line-height: 16px;
    }
    #DevInfo .devWrapper > div > div > div.categoryBox{
      min-height: inherit;
    }
  }
</style>
