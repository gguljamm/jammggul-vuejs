<template>
<div id="Travel" v-bind:class="isMobile?'mob':'web'">
  <div class="topImg">
    <img src="../assets/images/burano.jpg">
  </div>
  <div class="travelWrapper">
    <ul class="travelList">
      <li v-for="list in travelArray" @click="travelPopClick">
        <div>
          <img v-bind:src="list.thumbnail || 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/thumbnail.jpg?alt=media&token=e46035b1-12c7-445e-9a89-6af32e90daa2'">
        </div>
        <div>
          <div class="county">{{ list.country }} <span class="dates">( {{ list.dates }} )</span></div>
          <div class="tags"><span v-for="tag in list.tags">{{ tag }}</span></div>
          <div class="description">
            <div v-for="desc in list.description.split('\n')">
              <span v-if="desc">{{ desc }}</span>
              <br v-else>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <transition name="fade" mode="out-in">
    <div class="pop" v-if="popOpen" @click="closePop()">
      <div @click.stop>
        <div class="head"><button @click="closePop('direct')"><i class="fa fa-times-circle" aria-hidden="true"></i></button></div>
        <input-travel v-if="popFlag==='addTravel'" @reload="getData"/>
        <div v-else-if="popFlag==='appendList'"></div>
        <div v-else-if="popFlag==='travelPop'"></div>
      </div>
    </div>
  </transition>
  <button id="TravelWrite" v-bind:class="buttonPop?'clicked':''" @click="buttonPop = !buttonPop">
    <i class="fa fa-plus" aria-hidden="true"></i>
  </button>
  <transition name="showSlideLeft" mode="out-in">
    <div v-if="buttonPop" class="travelButtonPop">
      <ul>
        <li @click="authClick('addTravel')">새로운 여행 추가</li>
        <li @click="authClick('appendList')">여행 일정 추가</li>
      </ul>
      <div class="clamp"></div>
    </div>
  </transition>
</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
const app = getCurrentInstance()
const $firebase = app.appContext.config.globalProperties.$firebase
import InputTravel from './Input/Input-Travel.vue';

const props = defineProps(['isMobile']);

const buttonPop = ref(false);
const popOpen = ref(false);
const popFlag = ref('');
const travelArray = ref([]);
const isAuth = ref(false);

const closePop = (flag) => {
  if (flag === 'direct' || confirm('정말 그만 쓸거야?')) {
    popOpen.value = false;
    isAuth.value = false;
  }
};

const authClick = async (tag) => {
  if (isAuth.value) {
    isAuth.value = false;
    return;
  }
  isAuth.value = await $firebase.login();
  if (isAuth.value) {
    writePopOpen(tag);
  }
};

const writePopOpen = (tag) => {
  popOpen.value = true;
  buttonPop.value = false;
  popFlag.value = tag;
};

const travelPopClick = () => {
  popOpen.value = true;
  popFlag.value = 'travelPop';
};

const getData = () => {
  closePop('direct');
  $firebase.firestore('travel').orderBy('date', 'desc').get().then((querySnapshot) => {
    querySnapshot.docs.forEach((x) => {
      const data = x.data();
      const content = {
        country: data.country,
        tags: data.tags.split(','),
        dates: data.dates,
        description: data.description,
        thumbnail: data.thumbnail,
      };
      travelArray.value.push(content);
    });
  });
};

onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
  .pop{
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
  }
  .pop > div{
    max-width: 1080px;
    padding: 30px;
    max-height: 100%;
    top: 50%;
    transform: translateY(-50%);
    position: relative;
    margin: 0 auto;
    overflow-y: auto;
  }
  .pop > div > div:not(.head){
    min-height: 500px;
    padding: 20px;
    width: 100%;
    background-color: #FFF;
  }
  .pop > div > div.head{
    overflow: auto;
    height: 50px;
    background-color: #FFF;
  }
  .pop > div > div.head > button{
    border: 0;
    padding: 0;
    height: 50px;
    width: 50px;
    line-height: 50px;
    background-color: transparent;
    cursor: pointer;
    float: right;
    font-size: 24px;
    color: #c98474;
  }
  .topImg{
    overflow: hidden;
    display: unset;
  }
  .topImg > img {
    top: 0;
    left: 0;
    position: sticky;
    z-index: -1;
    display: block;
    width: 100%;
    max-height: 520px;
    min-height: 200px;
  }
  .travelWrapper{
    margin: 0 auto 50px;
    max-width: 1080px;
    width: 100%;
  }
  .travelList{
    padding: 30px;
    padding-bottom: 60px;
    margin-top: -60px;
  }
  .travelList > li{
    width: 100%;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 0 10px 1px rgba(0,0,0,.1);
    transition: background .3s ease;
    display: table;
    background-color: #FFF;
    position: relative;
    z-index: 1;
  }
  .travelList > li:last-child{
    margin-bottom: 0;
  }
  .travelList > li > div{
    display: table-cell;
    vertical-align: middle;
    &:nth-of-type(1) {
      width: 40%;
    }
    &:nth-of-type(2) {
      width: 60%;
    }
  }
  .web .travelList > li{
    border: 1px solid #d7d8d9;
    > div:nth-of-type(1){
      padding: 30px 0 30px 20px;
      > img{
        border-radius: 8px;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, .1);
      }
    }
  }

  .mob .travelList{
    padding: 10px;
    padding-bottom: 60px;
    margin-top: -30px;
  }
  .mob .travelList > li{
    margin-bottom: 20px;
    display: block;
  }
  .mob .travelList > li > div{
    display: block;
    width: 100%;
  }
  .mob .travelList > li > div:first-child{
    text-align: center;
  }
  .travelList > li > div:last-child{
    padding: 30px 40px;
  }
  .mob .travelList > li > div:last-child{
    padding: 20px;
    border: 1px solid #d7d8d9;
    border-top: 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .travelList > li > div img{
    width: 100%;
    display: block;
  }
  .travelList > li > div .county{
    color: #874c62;
    font-size: 24px;
  }
  .travelList > li > div .tags{
    margin-top: 15px;
  }
  .travelList > li > div .tags:after{
    content: '';
    display: block;
    clear: both;
  }
  .travelList > li > div .tags > span{
    float:left;
    background-color: #a7d2cb;
    color: #FFF;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .travelList > li > div .dates{
    color: #c98474;
    font-size: 14px;
  }
  .travelList > li > div .description{
    height: auto;
    margin-top: 40px;
    line-height: 24px;
  }
  #TravelWrite{
    position: fixed;
    bottom: 100px;
    left: 100px;
    border: 0;
    background-color: #a7d2cb;
    color: #FFF;
    padding: 0;
    margin: 0;
    font-size: 24px;
    width: 50px;
    height: 50px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    cursor: pointer;
    z-index: 3;
    -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
  }
  .mob #TravelWrite{
    bottom: 20px;
    left: 20px;
  }
  #TravelWrite i{
    transition: .5s ease;
    transform: rotate(0deg);
    width: 30px;
    height: 30px;
    line-height: 30px;
  }
  #TravelWrite.clicked i{
    transform: rotate(45deg);
  }
  .travelButtonPop{
    position: fixed;
    bottom: 162px;
    left: 100px;
    background-color: #FFF;
    border: 1px solid #e1e3e5;
    z-index: 3;
    -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,.2);
    width: 150px;
    padding: 10px;
  }
  .mob .travelButtonPop{
    left: 20px;
    bottom: 82px;
  }
  .travelButtonPop ul{
    white-space: nowrap;
    overflow: hidden;
  }
  .travelButtonPop ul > li{
    padding: 8px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    width: 130px;
  }
  .travelButtonPop .clamp{
    bottom: -14px;
    left: 15px;
    position: absolute;
    height: 14px;
    width: 20px;
    overflow: hidden;
  }
  .travelButtonPop .clamp:before{
    content: '';
    border-top: 10px solid #FFF;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    width: 0;
    height: 0;
    top: 0;
    left: 2px;
    position: absolute;
    -webkit-filter: drop-shadow(1px 1px 2px rgba(0,0,0,.4));
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,.4));
  }
  .showSlideLeft-enter-active, .showSlideLeft-leave-active {
    transition: .2s ease;
    width: 150px;
    opacity: 1;
  }
  .showSlideLeft-enter, .showSlideLeft-leave-to  {
    width: 50px;
    opacity: 0.5;
  }
  @media all and (max-width: 1080px) {
    .travelList > li > div .description{
      height: auto;
    }
  }
</style>
