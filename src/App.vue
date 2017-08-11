<template>
  <div id="app">
    <div class="wrapper">
      <gnb></gnb>
      <navigation
        @transChange="changePage"></navigation>
      <about
        v-if="page=='about'"></about>
      <practice
        v-if="page=='practice'"></practice>
      <devInfo
        v-if="page=='devInfo'"></devInfo>
      <travel
        v-if="page=='travel'"></travel>
      <contacts
        v-if="page=='contacts'"></contacts>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
  import Gnb from './components/Header';
  import Navigation from './components/Navigation';
  import About from './components/About';
  import Practice from './components/Practice';
  import DevInfo from './components/Dev-Info';
  import Travel from './components/Travel';
  import Contacts from './components/Contacts';

  export default {
    name: 'app',
    components: {
      Gnb,
      Navigation,
      About,
      Practice,
      DevInfo,
      Travel,
      Contacts,
    },
    methods: {
      pageReload() {
        location.reload();
      },
      changePage(changePage) {
        this.page = changePage;
      },
    },
    data() {
      return {
        page: 'about',
      };
    },
  };
</script>

<style>
  @import './assets/lib/normalize.css';
  @import url('https://fonts.googleapis.com/css?family=Fredoka+One');
  html, body {
    width: 100%;
    height: 100%;
  }
  ul, ol, li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  #app *{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .wrapper{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 10px;
    background-color: rgb(249,249,239);
    -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    -moz-box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    box-shadow: 1px 1px 1px rgba(0,0,0,.3);
  }
  .footer{
    background-color: #aabbcc;
    height: 10px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
</style>
