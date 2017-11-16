<template>
<div id="Navigation" class="navigation">
  <span class="clamp"></span>
  <span v-if="leftArrow" class="leftArrow"></span>
  <span v-if="rightArrow" class="rightArrow"></span>
  <ul @scroll="navScroll">
    <li
      v-bind:class="{active: activeTab == 'about'}"
      @click="navChange('about')">
      <div>
        <img src="../assets/images/mug.jpg" >
        <div>ABOUT</div>
      </div>
    </li>
    <li
      v-bind:class="{active: activeTab == 'daily'}"
      @click="navChange('daily')">
      <div>
        <img src="../assets/images/icecoffee.jpg" >
        <div>DAILY</div>
      </div>
    </li>
    <li
      v-bind:class="{active: activeTab == 'portfolio'}"
      @click="navChange('portfolio')">
      <div>
        <img src="../assets/images/donut.jpg" >
        <div>PORTFOLIO</div>
      </div>
    </li>
    <li
      v-bind:class="{active: activeTab == 'review'}"
      @click="navChange('review')">
      <div>
        <img src="../assets/images/cream.jpg" >
        <div>REVIEW</div>
      </div>
    </li>
    <li
      v-bind:class="{active: activeTab == 'devInfo'}"
      @click="navChange('devInfo')">
      <div>
        <img src="../assets/images/takeout.jpg" >
        <div>IT INFO</div>
      </div>
    </li>
    <li
      v-bind:class="{active: activeTab == 'travel'}"
      @click="navChange('travel')">
      <div>
        <img src="../assets/images/muffin.jpg" >
        <div>TRAVEL</div>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
  export default {
    name: 'navigation',
    props: ['page'],
    data() {
      return {
        activeTab: this.page,
        leftArrow: false,
        rightArrow: true,
      };
    },
    methods: {
      navScroll(e) {
        this.leftArrow = !(e.srcElement.scrollLeft === 0);
        this.rightArrow = !(350 - e.srcElement.clientWidth - e.srcElement.scrollLeft === 0);
      },
      navChange(page) {
        this.activeTab = page;
        this.$emit('transChange', page);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navigation{
    z-index: 1;
  }
  .web .navigation{
    position: fixed;
    -webkit-box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    right: 20px;
    top: 50%;
    margin-top: -235px;
    border: 1px solid #f1f2f3;
    z-index: 1;
    background-color: #FFF;
  }
  .web .navigation ul{
    padding: 10px 0;
  }
  .mobile .navigation .clamp{
    position: absolute;
    width: 25px;
    height: 25px;
    right: 22px;
    top: -20px;
    overflow: hidden;
  }
  .mobile .navigation .clamp:before{
    content: '';
    position: absolute;
    bottom: 0;
    left: 2px;
    border-bottom: 15px solid #FFF;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    width: 0;
    height: 0;
    -webkit-filter: drop-shadow(1px 1px 2px rgba(0,0,0,.5));
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,.5));
  }
  .mobile .navigation.about .clamp:before{
    -webkit-filter: none;
    filter: none;
    border-bottom-color: rgba(255,255,255,.5);
  }
  .mobile .navigation{
    position: relative;
    padding: 5px 10px 0 10px;
  }
  .mobile .navigation.about ul{
    background-color: rgba(255,255,255,.5);
  }
  .mobile .navigation ul{
    background-color: #FFF;
    -webkit-box-shadow: 1px 1px 2px 2px rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 2px 2px rgba(0,0,0,.15);
    box-shadow: 1px 1px 2px 2px rgba(0,0,0,.15);
  }
  .mobile .navigation .leftArrow{
    position: absolute;
    border-right: 5px solid #cecece;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    left: 15px;
    top: 30px;
    z-index: 1;
    visibility: hidden;
  }
  .mobile .navigation .rightArrow{
    position: absolute;
    border-left: 5px solid #cecece;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    right: 15px;
    top: 30px;
    z-index: 1;
    visibility: hidden;
  }
  .mobile .navigation.about .leftArrow{
    border-right-color: #FFF;
  }
  .mobile .navigation.about .rightArrow{
    border-left-color: #FFF;
  }
  .mobile .navigation.travel{
    position: absolute;
    width: 100%;
  }
  .mobile .navigation ul{
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: center;
  }
  .navigation ul li{
    padding: 0 5px;
    position: relative;
  }
  .navigation ul li > div{
    width: 80px;
    height: 80px;
    padding: 10px 15px 10px 15px;
    text-align: center;
    cursor: pointer;
    -webkit-border-radius: 45px;
    -moz-border-radius: 45px;
    border-radius: 45px;
  }
  .mobile .navigation ul li{
    display: inline-block;
  }
  .navigation ul li:not(.active):hover > div{
    border: 1px solid #a7d2cb;
    padding: 9px 14px;
  }
  .navigation ul li.active > div{
    background-color: rgba(167, 210, 203, .3);
  }
  .mobile .navigation.about ul li.active > div{
    background-color: rgb(167, 210, 203);
  }
  .navigation ul li img{
    width: 40px;
    height: 40px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
  }
  .navigation ul li:hover img{
    opacity: 0.8;
  }
  .navigation ul li > div div{
    position: absolute;
    width: 90px;
    left: 0;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Baloo Bhaijaan', sans-serif;
  }
  .clear{
    clear:both;
  }
  @media all and (max-height: 470px){
    .web .navigation{
      position: absolute;
      top: 74px;
      margin-top: 0;
    }
  }
  @media all and (max-width: 768px){
    .mobile .navigation ul li > div {
      width: 60px;
      height: 60px;
    }
    .mobile .navigation ul li img{
      width: 30px;
      height: 30px;
    }
    .mobile .navigation ul li > div div{
      width: 70px;
      font-size: 12px;
      bottom: 0;
    }
  }
  @media all and (max-width: 390px){
    .mobile .navigation .leftArrow{
      visibility: visible;
    }
    .mobile .navigation .rightArrow{
      visibility: visible;
    }
  }
</style>
