<template>
<div id="Navigation" class="navigation">
  <ul>
    <li
      v-bind:class="{active: activeTab == 1}"
      @click="navChange('about', 1)">
      <img src="../assets/images/mug.jpg" >
      <div>ABOUT</div>
    </li>
    <li
      v-bind:class="{active: activeTab == 2}"
      @click="navChange('daily', 2)">
      <img src="../assets/images/icecoffee.jpg" >
      <div>DAILY</div>
    </li>
    <li
      v-bind:class="{active: activeTab == 3}"
      @click="navChange('practice', 3)">
      <img src="../assets/images/donut.jpg" >
      <div>PRACTICE</div>
    </li>
    <li
      v-bind:class="{active: activeTab == 4}"
      @click="navChange('devInfo', 4)">
      <img src="../assets/images/takeout.jpg" >
      <div>DEV INFO</div>
    </li>
    <li
      v-bind:class="{active: activeTab == 5}"
      @click="navChange('travel', 5)">
      <img src="../assets/images/muffin.jpg" >
      <div>TRAVEL</div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'navigation',
  data() {
    return {
      activeTab: 1,
    };
  },
  methods: {
    navChange(page, num) {
      this.activeTab = num;
      this.$emit('transChange', page);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');
  .navigation{
    position: fixed;
    background-color: #FFF;
    -webkit-box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    box-shadow: 1px 1px 5px rgba(0,0,0,.15);
    right: 50px;
    top: 50%;
    margin-top: -235px;
    border: 1px solid #f1f2f3;
    z-index: 1;
  }
  .navigation ul{
    padding: 10px 0;
  }
  .navigation ul li{
    width: 90px;
    height: 90px;
    margin: 0 5px;
    padding: 10px 15px 10px 15px;
    text-align: center;
    cursor: pointer;
    -webkit-border-radius: 45px;
    -moz-border-radius: 45px;
    border-radius: 45px;
  }
  .navigation ul li:not(.active):hover{
    border: 1px solid #a7d2cb;
    padding: 9px 14px 9px 14px;
  }
  .navigation ul li.active{
    background-color: rgba(167, 210, 203, .3);
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
  .navigation ul li div{
    position: absolute;
    width: 100px;
    left: 0;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Gloria Hallelujah', cursive;
  }
  @media all and (max-height: 470px){
    .navigation{
      position: absolute;
      top: 0;
      margin-top: 0;
    }
  }
</style>
