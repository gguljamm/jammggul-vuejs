<template>
<div id="Navigation" class="navigation">
  <ul>
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
      v-bind:class="{active: activeTab == 'practice'}"
      @click="navChange('practice')">
      <div>
        <img src="../assets/images/donut.jpg" >
        <div>PRACTICE</div>
      </div>
    </li>
    <li
      v-bind:class="{active: activeTab == 'devInfo'}"
      @click="navChange('devInfo')">
      <div>
        <img src="../assets/images/takeout.jpg" >
        <div>DEV INFO</div>
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
      };
    },
    methods: {
      navChange(page) {
        this.activeTab = page;
        this.$emit('transChange', page);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Baloo+Bhaijaan');
  .navigation{
    z-index: 1;
  }
  .web .navigation{
    position: fixed;
    -webkit-box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    right: 10px;
    top: 50%;
    margin-top: -235px;
    border: 1px solid #f1f2f3;
    z-index: 1;
    background-color: #FFF;
  }
  .mobile .navigation.about{
    position: relative;
    background-color: rgba(255,255,255,.5);
  }
  .mobile .navigation:not(.about){
    position: relative;
    background-color: #FFF;
    border-bottom: 1px solid #c1c2c3;
  }
  .web .navigation ul{
    padding: 10px 0;
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
    width: 90px;
    height: 90px;
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
    width: 50px;
    height: 50px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
  }
  .navigation ul li:hover img{
    opacity: 0.8;
  }
  .navigation ul li > div div{
    position: absolute;
    width: 100px;
    left: 0;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Baloo Bhaijaan', cursive;
  }
  .clear{
    clear:both;
  }
  @media all and (max-height: 470px){
    .web .navigation{
      position: absolute;
      top: 0;
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
</style>
