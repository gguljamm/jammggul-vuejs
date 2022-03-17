<template>
<div id="Travel" v-bind:class="isMobile?'mob':''">
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

<script>
  import InputTravel from './Input/Input-Travel.vue';

  export default {
    components: {
      InputTravel,
    },
    props: ['isMobile'],
    name: 'travel',
    methods: {
      closePop(flag) {
        if (flag === 'direct' || confirm('정말 그만쓸거야?')) {
          this.popOpen = false;
          this.isAuth = false;
        }
      },
      async authClick(tag) {
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        this.isAuth = await this.$firebase.login();
        if (this.isAuth) {
          this.writePopOpen(tag);
        }
      },
      writePopOpen(flag) {
        this.popOpen = true;
        this.buttonPop = false;
        this.popFlag = flag;
      },
      travelPopClick() {
        this.popOpen = true;
        this.popFlag = 'travelPop';
      },
      getData() {
        this.closePop('direct');
        this.$firebase.database('/travel').once('value', (snap) => {
          const list = snap.val();
          Object.keys(list).reverse().forEach((x) => {
            const content = {
              country: list[x].country,
              tags: list[x].tags.split(','),
              dates: list[x].dates,
              description: list[x].description,
              thumbnail: list[x].thumbnail,
            };
            this.travelArray.push(content);
          });
        });
      },
    },
    data() {
      return {
        buttonPop: false,
        popOpen: false,
        popFlag: '',
        travelArray: [],
        isAuth: false,
      };
    },
    mounted() {
      this.getData();
    },
  };
</script>

<style scoped>
  .pop{
    position: fixed;
    z-index: 6;
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
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
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
  .pop > div > div.head > button:hover{
    opacity: .8;
  }
  .topImg{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    text-align: center;
    width: 100%;
    background-color: rgb(133, 179, 229);
    background: -moz-linear-gradient(left, rgb(143, 189, 239) 0%, rgb(129, 175, 228) 100%);
    background: -webkit-linear-gradient(left, rgb(143, 189, 239) 0%, rgb(129, 175, 228) 100%);
    background: linear-gradient(to right, rgb(143, 189, 239) 0%, rgb(129, 175, 228) 100%);
    height: 520px;
    overflow: hidden;
  }
  .topImg > img {
    height: 520px;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .mob .topImg{
    background-color: transparent;
    position: relative;
    margin-top: -50px;
    height: auto;
    font-size: 0;
  }
  .mob .topImg > img{
    width: 150%;
    height: auto;
    position: relative;
  }
  .travelWrapper{
    position: absolute;
    max-width: 1080px;
    width: 100%;
    background-color: #FFF;
    z-index: 1;
    top: 470px;
    transform: translateX(-50%);
    left: 50%;
    margin-bottom: 50px;
  }
  .mob .travelWrapper{
    position: relative;
    top: 0;
  }
  .travelList{
    padding: 30px;
  }
  .travelList > li{
    width: 100%;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #a7d2cb;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    overflow: auto;
    cursor: pointer;
    -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,.1);
    -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,.1);
    box-shadow: 0 0 10px 5px rgba(0,0,0,.1);
    transition: background .3s ease;
    display: table;
  }
  .travelList > li:hover{
    background-color: aliceblue;
  }
  .travelList > li:last-child{
    margin-bottom: 0;
  }
  .travelList > li > div{
    display: table-cell;
    vertical-align: middle;
    width: 50%;
    padding: 20px;
    font-family: "Noto Sans KR", sans-serif;
  }
  .mob .travelList{
    padding: 10px;
  }
  .mob .travelList > li{
    padding: 10px;
    margin-bottom: 10px;
    display: block;
  }
  .mob .travelList > li > div{
    display: block;
    width: 100%;
    padding: 10px 10px 0 10px;
  }
  .mob .travelList > li > div:first-child{
    text-align: center;
  }
  .mob .travelList > li > div:last-child{
    padding-bottom: 10px;
  }
  .travelList > li > div img{
    width: 100%;
    max-width: 450px;
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
    border: 1px solid #e1e3e5;
    height: auto;
    padding: 10px;
    margin-top: 10px;
    line-height: 24px;
    background-color: rgba(255, 255, 255, .8);
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
  .travelButtonPop ul > li:hover{
    background-color: rgba(242, 211, 136, .9);
    color: #FFF;
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
