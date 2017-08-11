<template>
<div class="navigation">
  <ul>
    <li>
      <img
        @click="navChange('about')"
        src="/static/images/i_mug.jpg" >
      <div>ABOUT</div>
    </li>
    <li>
      <img
        @click="navChange('practice')"
        src="/static/images/i_icecoffee.jpg" >
      <div>PRACTICE</div>
    </li>
    <li>
      <img
        @click="navChange('devInfo')"
        src="/static/images/i_donut.jpg" >
      <div>DEV INFO</div>
    </li>
    <li>
      <img
        @click="navChange('travel')"
        src="/static/images/i_takeout.jpg" >
      <div>TRAVEL</div>
    </li>
    <li>
      <img
        @click="navChange('contacts')"
        src="/static/images/i_muffin.jpg" >
      <div>CONTACTS</div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'navigation',
  methods: {
    navChange(page) {
      this.$emit('transChange', page);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');
  .navigation{
    position: absolute;
    background-color: #FFF;
    -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    -moz-box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    right: 50px;
    top: 50%;
    margin-top: -235px;
  }
  .navigation ul{
    padding-top: 5px;
    padding-bottom: 15px;
  }
  .navigation ul li{
    width: 120px;
    height: 90px;
    padding: 15px;
    padding-bottom: 5px;
    text-align: center;
  }
  .navigation ul li img{
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  .navigation ul li img:hover{
    opacity: 0.8;
  }
  .navigation ul li div{
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Gloria Hallelujah', cursive;
  }
</style>
