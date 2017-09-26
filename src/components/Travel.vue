<template>
<div id="Travel">
  <div class="topImg">
    <img src="../assets/images/burano.jpg">
  </div>
  <div class="travelWrapper">

  </div>
  <transition name="fade" mode="out-in">
    <div class="pop" v-if="popOpen" @click="popOpen = false"></div>
  </transition>
  <button id="TravelWrite" v-bind:class="buttonPop?'clicked':''" @click="buttonPop = !buttonPop"><i class="fa fa-plus" aria-hidden="true"></i></button>
  <transition name="showSlideLeft" mode="out-in">
    <div v-if="buttonPop" class="travelButtonPop">
      <ul>
        <li @click="writePopOpen">새로운 여행 추가</li>
        <li @click="writePopOpen">여행 일정 추가</li>
      </ul>
      <div class="clamp"></div>
    </div>
  </transition>
</div>
</template>

<script>
  export default {
    props: ['isMobile'],
    name: 'travel',
    methods: {
      writePopOpen() {
        this.popOpen = true;
        this.buttonPop = false;
      },
    },
    data() {
      return {
        buttonPop: false,
        popOpen: false,
      };
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
    background-color: rgba(0,0,0,.3);
  }
  .topImg{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    text-align: center;
    width: 100%;
    background-color: rgb(133, 179, 229);
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
  .travelWrapper{
    position: relative;
    max-width: 1080px;
    margin: 0 auto;
    background-color: #FFF;
    height: 1500px;
    z-index: 1;
    margin-top: 400px;
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
  .travelButtonPop ul{
    white-space: nowrap;
    overflow: hidden;
  }
  .travelButtonPop ul > li{
    padding: 4px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    width: 130px;
  }
  .travelButtonPop ul > li:hover{
    background-color: rgba(167, 210, 203, .8);
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
</style>
