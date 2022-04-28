<template>
<div id="Daily">
  <div class="mainTitle">
    <div class="btns">
      <button v-if="itemsView.length > 0" @click="filterOpen = !filterOpen"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></button>
      <button @click="authClick">
        <i v-if="!isAuth" class="fa fa-pencil" aria-hidden="true"></i>
        <i v-else class="fa fa-times" aria-hidden="true"></i>
      </button>
    </div>
    <div class="monthSelector" v-if="filterOpen">
      <div @click.stop><div>
        <span></span>
        <div class="year">
          <i class="fa fa-chevron-circle-left" aria-hidden="true"
            v-bind:class="selectedYear > 2017 ? '' : 'disabled'"
            @click="selectedYear > 2017 ? changeYear(false) : ''"
          ></i>
          {{ selectedYear }}
          <i class="fa fa-chevron-circle-right" aria-hidden="true"
            v-bind:class="selectedYear < nowYear ? '' : 'disabled'"
            @click="selectedYear < nowYear ? changeYear(true) : ''"
          ></i>
        </div>
        <ul>
          <li
            v-for="(month, index) in arrMonth"
            v-bind:class="{
              nonSelectable: !selectedMonthCount[index],
              selected: `${selectedYear}-${zeros(index + 1)}` === filterOption,
            }"
            @click="selectedMonthCount[index] > 0 ? changeMonth(index) : null"
            >{{ month }}<span v-if="selectedMonthCount[index]">{{ selectedMonthCount[index] }}</span>
          </li>
        </ul>
        <div class="recent">
          <button @click="changeRecent()">Recently 20<i v-if="'Recent' === filterOption" class="fa fa-check"></i></button>
        </div>
      </div></div>
    </div>
    <div class="monthSelectorBack" v-if="filterOpen" @click="filterOpen = false"></div>
  </div>
  <input-box v-if="isAuth" v-bind:isMobile="isMobile" @uploadComplete="uploadComplete"></input-box>
  <loading v-if="!loaded"></loading>
  <ul class="dailyList">
    <transition-group tag="div" name="component-fade" mode="out-in">
      <li
        v-for="(item, index) in itemsView"
        v-bind:key="`${item.date}-${index}`"
        v-bind:class="item.isMore?'clickable':''"
        v-getHeight="{ item }">
          <div class="dailyBox" v-bind:class="item.viewMore?'selected':''" @click="item.isMore?listClick(item):''">
            <div>
              <div class="title">{{ item.date }}</div>
              <div class="content">
                <div>
                  <div><div v-for="(line,key) in item.content.split('\n')" v-bind:key="key">{{ line }}<br></div></div>
                  <span class="icons">
                    <i v-if="item.isMore&&item.isMore.indexOf('more')>=0" class="fa fa-ellipsis-h moreIcon" aria-hidden="true"></i>
                    <span class="img_gif" v-if="item.imgUrl.join('').indexOf('.gif') >= 0">.gif</span>
                    <i class="fa fa-picture-o" aria-hidden="true" v-else-if="item.imgUrl.length > 0"></i>
                  </span>
                  <div v-if="isLoaded(item.imgUrl, item.loaded)" class="imgLoader">
                    <i class="fa fa-circle-o-notch fa-spin fa-1x fa-fw"></i>
                    <span class="sr-only">Loading...</span>
                  </div>
                  <transition-group name="component-fade" mode="out-in" tag="div" class="images">
                    <img v-if="isLoaded(item.imgUrl, !item.loaded)" v-for="url in item.imgUrl" v-bind:key="url" v-bind:src="item.loaded?url:''">
                  </transition-group>
                </div>
              </div>
            </div>
          </div>
      </li>
    </transition-group>
  </ul>
  <div class="clear"></div>
</div>
</template>

<script lang="ts" setup>
import InputBox from './Input/Input-Daily.vue';
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
const app = getCurrentInstance()
const $firebase = app.appContext.config.globalProperties.$firebase

const itemsView = ref([]);
const loaded = ref(false);
const isLoaded = (a, b) => (a && !b);
const selectedYear = ref(new Date().getFullYear());
const nowYear = ref(new Date().getFullYear());
const filterOpen = ref(false);
const filterOption = ref('Recent');
const objCount = ref({});
const isAuth = ref(false);

const props = defineProps({
  isMobile: Boolean,
});

const getData = async () => {
  isAuth.value = false;
  let querySnapshot;
  if (filterOption.value === 'Recent') {
    querySnapshot = await $firebase.firestore('daily').orderBy('date', 'desc').limit(20).get()
  } else {
    const min = parseInt(`${filterOption.value.replace(/-/g, '')}01000000`);
    const max = parseInt(`${filterOption.value.replace(/-/g, '')}31999999`);
    querySnapshot = await $firebase.firestore('daily').where('date', '>=', min).where('date', '<=', max).orderBy('date').get();
  }
  itemsView.value = [];
  loaded.value = false;
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const d = doc.data();
    const getDate = d.date.toString();
    d.date = `${getDate.slice(0, 4)}-${getDate.slice(4, 6)}-${getDate.slice(6, 8)}`;
    d.loaded = false;
    if (d.imgUrl.length > 0) {
      d.isMore = 'img';
    } else {
      d.isMore = false;
    }
    d.viewMore = false;
    itemsView.value.push(d);
  });
  loaded.value = true;
}

const getCount = () => {
  $firebase.firestore('daily-count').doc('0').get().then((snap) => {
    objCount.value = snap.data();
  });
};

const authClick = async () => {
  if (isAuth.value) {
    isAuth.value = false;
    return;
  }
  isAuth.value = await $firebase.login();
};

const zeros = (n) => {
  let zero = '';
  let newN = n;
  newN = n.toString();

  if (newN.length < 2) {
    for (let i = 0; i < 2 - newN.length; i += 1) {
      zero += '0';
    }
  }
  return zero + newN;
}

const arrMonth = ['JAN', 'FEB', 'MAR', 'AFR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const selectedMonthCount = computed(() => {
  const arr = [];
  for (let x = 1; x <= arrMonth.length; x += 1) {
    arr.push(objCount.value[`${selectedYear.value}-${zeros(x)}`]);
  }
  return arr;
});

const changeYear = (acc) => {
  if (acc) {
    selectedYear.value += 1;
  } else {
    selectedYear.value -= 1;
  }
};

const changeMonth = (index) => {
  filterOpen.value = false;
  filterOption.value = `${selectedYear.value}-${zeros(index + 1)}`;
  getData();
}

const changeRecent = () => {
  filterOpen.value = false;
  filterOption.value = 'Recent';
  getData();
};

const promiseLoading = (item, url) => {
  return new Promise((resolve) => {
    const loadImg = new Image();
    loadImg.src = url;
    loadImg.onload = () => {
      resolve(true);
    };
  });
};
const listClick = (item) => {
  if (!item.viewMore) {
    for (let x = 0, leng = itemsView.value.length; x < leng; x += 1) {
      itemsView.value[x].viewMore = false;
    }
    const arrPromise = [];
    for (let y = 0; y < item.imgUrl.length; y += 1) {
      arrPromise.push(promiseLoading(item, item.imgUrl[y]));
    }
    Promise.all(arrPromise).then(() => {
      item.loaded = true;
    });
  }
  item.viewMore = !item.viewMore;
};

const uploadComplete = async (ym) => {
  await $firebase.firestore('daily-count').doc('0').update({
    [ym]: objCount.value[ym] + 1,
  })
  objCount.value[ym] += 1;
  getData();
};

onMounted(() => {
  getData();
  getCount();
});

const vGetHeight = {
  inserted: (ele, value) => {
    const val = value.value;
    const height = ele.querySelector('.content > div > div').offsetHeight;
    if (height > 120) {
      if (val.item.isMore) {
        val.item.isMore = 'img more';
      } else {
        val.item.isMore = 'more';
      }
    }
  }
};
</script>

<style scoped lang="scss">
  #Daily{
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;
    .mainTitle .btns{
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
  }
  .filter > button{
    border: 1px solid #a7d2cb;
    background-color: #FFF;
  }
  .write > button{
    border: 0;
    color: #FFF;
    background-color: #c98474;
    left: 10px;
  }
  .filter i, .write i{
    margin-right: 5px;
  }
  .filter li > span{
    width: 20px;
    text-align: center;
  }
  .dailyList{
    padding-top: 20px;
  }
  .dailyList li{
    width: 33.3333%;
    padding: 0 10px 20px 10px;
    float: left;
  }
  .dailyList li .dailyBox{
    height: 200px;
  }
  .dailyList li.clickable .dailyBox{
    cursor: pointer;
  }
  .dailyList li .dailyBox > div{
    border-radius: 10px;
    box-shadow: 0 0 10px 1px rgba(0,0,0,.1);
  }
  .dailyList li .dailyBox.selected > div{
    box-shadow: 0 0 15px 2px rgba(0,0,0,.2);
  }
  .title{
    font-size: 18px;
    border: 1px solid #a7d2cb;
    border-bottom: 0;
    height: 40px;
    line-height: 39px;
    text-align: center;
    background-color: #a7d2cb;
    color: #FFF;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .content{
    border: 1px solid #d7d8d9;
    background-color: #FFF;
    border-top: 0;
    height: 160px;
    padding: 10px;
    padding-bottom: 9px;
    line-height: 20px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position: relative;
  }
  .content > div{
    height: 120px;
    overflow-y: hidden;
  }
  .selected .content > div{
    height: 100%;
  }
  .content > div img{
    visibility: hidden;
    max-width: 100%;
    width: 100%;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
  }
  .content .images{
    padding: 0 10px 10px;
  }
  .content .imgLoader{
    width: 100%;
    text-align: center;
    padding: 15px 0 10px 0;
    display: none;
  }
  .selected .content .imgLoader{
    display: inline-block;
  }
  .icons{
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #c98474;
  }
  .icons > i{
    margin-left: 10px;
  }
  .img_gif{
    font-size: 12px;
    font-weight: bold;
  }
  .selected .icons{
    background: none;
  }
  .selected{
    position: relative;
    z-index: 10;
  }
  .selected .content{
    height: auto;
    min-height: 160px;
  }
  .selected .content > div{
    overflow-y: visible;
  }
  .selected .content > div img{
    visibility: visible;
  }
  .more .selected .icons > i{
    visibility: hidden;
  }
  .selected .icons > i, .selected .icons .img_gif {
    visibility: hidden;
  }
  .monthSelectorBack{
    z-index: 13;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
  }
  .monthSelector{
    position: relative;
    > div{
      z-index: 14;
      position: absolute;
      top: 15px;
      right: 0;
      text-align: center;
      font-family: 'Baloo Bhaijaan', sans-serif;
      padding: 0 20px;
      > div{
        border-radius: 8px;
        background-color: #FFF;
        max-width: 380px;
        width: 100%;
        border: 1px solid #d7d8d9;
        box-shadow: 0 0 10px 1px rgba(0,0,0,.1);
        > span{
          position: absolute;
          right: 55px;
          top: -15px;
          width: 0;
          height: 0;
          border-right: 11px solid transparent;
          border-left: 11px solid transparent;
          border-bottom: 15px solid rgba(0,0,0,.01);
          &:before{
            position: absolute;
            content: '';
            top: 2px;
            left: -25px;
            width: 0;
            height: 0;
            border-right: 10px solid transparent;
            border-left: 10px solid transparent;
            border-bottom: 14px solid #FFF;
          }
        }
      }
    }
  }
  .monthSelector .year{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #d7d8d9;
    line-height: 49px;
    font-size: 18px;
  }
  .monthSelector .year i{
    cursor: pointer;
    width: 60px;
    height: 49px;
    line-height: 49px;
    color: #a7d2cb;
    font-size: 24px;
  }
  .monthSelector .year i.disabled{
    opacity: 0.3;
    cursor: default;
  }
  .monthSelector .year i.fa-chevron-circle-left{
    float: left;
  }
  .monthSelector .year i.fa-chevron-circle-right{
    float: right;
  }
  .monthSelector ul{
    padding: 9px;
    padding-bottom: 10px;
    width: 378px;
  }
  .monthSelector ul li{
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    width: 120px;
    display: inline-block;
  }
  .monthSelector ul li.selected{
    box-shadow: 0 0 0 2px #ff4e50 inset;
  }
  .monthSelector ul li.nonSelectable{
    cursor: default;
    opacity: 0.5;
    background-color: #eee;
  }
  .monthSelector ul li:not(.nonSelectable):hover{
    background-color: rgba(242, 211, 136, .5);
  }
  .monthSelector ul li > span{
    width: 16px;
    height: 16px;
    line-height: 16px;
    background-color: #c98474;
    color: #FFF;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    display: inline-block;
    margin-left: 5px;
    font-size: 12px;
  }
  .monthSelector .recent{
    width: 100%;
    padding: 0 9px;
    margin-bottom: 9px;
  }
  .monthSelector .recent > button{
    width: 100%;
    height: 40px;
    background-color: #f2d388;
    border: 0;
    color: #FFF;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
  .monthSelector .recent > button:hover{
    opacity: 0.8;
  }
  .monthSelector .recent > button > i{
    position: absolute;
    color: #ff4e50;
    margin-left: 4px;
  }
  @media all and (max-width: 768px){
    .dailyList li{
      width: 50%;
    }
  }
  @media all and (max-width: 500px){
    .dailyList li{
      width: 100%;
    }
    .monthSelector > div, .monthSelector ul{
      width: 100%;
    }
    .monthSelector ul li{
      width: 33.3333%;
    }
  }
</style>
