<template>
  <div id="app" v-bind:class="[isMobile?'mobile':'web']">
    <div class="wrapper">
      <div id="GNB" v-bind:class="backColor">
        <div>
          <img
            @click="pageReload"
            src="./assets/images/jamm-resize.png" alt="jammggul" >
          <transition name="fade">
            <button id="MobMenu"
              v-if="isMobile"
              v-bind:key="mobNavOpen"
              @click="mobNavOpen=!mobNavOpen">
              <i aria-hidden="true"
                v-bind:class="[mobNavOpen?'fa fa-times':'fa fa-bars']"></i>
            </button>
          </transition>
        </div>
      </div>
      <navigation
        v-bind:class="[this.page]"
        :page="this.page"
        v-if="mobNavOpen"
        @transChange="navigate"></navigation>
      <transition name="component-fade" mode="out-in">
        <commponent v-bind:is="page" v-bind:isMobile="mobFlag"></commponent>
      </transition>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
  import Navigation from './components/Navigation';
  import About from './components/About';
  import Portfolio from './components/Portfolio';
  import DevInfo from './components/Dev-Info';
  import Travel from './components/Travel';
  import Daily from './components/Daily';
  import Review from './components/Review';

  export default {
    name: 'app',
    components: {
      Navigation,
      About,
      Daily,
      Portfolio,
      Review,
      DevInfo,
      Travel,
    },
    methods: {
      pageReload() {
        location.href = '/';
      },
      getWindowWidth() {
        const nowWidth = document.documentElement.clientWidth;
        this.windowWidth = nowWidth;
        if (nowWidth < 1270) {
          if (!this.isMobile) {
            this.isMobile = true;
            this.mobNavOpen = false;
          }
        } else {
          this.isMobile = false;
          this.mobNavOpen = true;
        }
        this.mobFlag = (nowWidth < 768);
      },
      navigate(url, popping) {
        if (url) {
          this.page = url;
        } else {
          this.page = 'about';
        }
        if (!popping) {
          window.history.pushState({ hash: '' }, '', `/${url === 'about' ? '' : url}`);
        }
      },
    },
    computed: {
      backColor() {
        return {
          backColor: this.page !== 'about' && this.page !== 'travel',
        };
      },
    },
    mounted() {
      this.$nextTick(function catchResize() {
        window.addEventListener('resize', this.getWindowWidth);
        this.getWindowWidth();
      });
      window.addEventListener('popstate', () => {
        this.navigate(location.pathname.replace('/', ''), true);
      });
      if (location.pathname && location.pathname !== '/') {
        this.page = location.pathname.replace('/', '');
      }
      this.$firebase.anonymouslyLogin();
    },
    data() {
      return {
        mobFlag: false,
        page: 'about',
        windowWidth: 0,
        isMobile: false,
        mobNavOpen: false,
      };
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
    },
  };
</script>

<style>
  @import './assets/lib/normalize.css';
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:800);
  @import url(https://fonts.googleapis.com/earlyaccess/notosanskr.css);
  @import url('https://fonts.googleapis.com/css?family=Baloo+Bhaijaan');
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
    overflow: hidden;
  }
  #app *{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .wrapper{
    position: absolute;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    top: 0;
    left: 0;
    right: 0;
    bottom: 10px;
    background-color: #f6f6f6;
    -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    -moz-box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    box-shadow: 1px 1px 1px rgba(0,0,0,.3);
  }
  #GNB {
    width: 100%;
    height: 70px;
    text-align: center;
    text-shadow: 1px 1px 1px #000;
  }
  #GNB.backColor{
    background-color: cornflowerblue;
  }
  #GNB > div {
    position: relative;
    margin: 0 auto;
    z-index: 1;
  }
  #GNB > div > img {
    margin: 5px;
    height: 60px;
    padding: 5px;
    cursor: pointer;
    background-color: #FFF;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 1px rgba(0,0,0,.15);
    box-shadow: 1px 1px 1px rgba(0,0,0,.15);
  }
  #MobMenu{
    position: absolute;
    z-index: 10;
    width: 40px;
    height: 40px;
    margin-top: 15px;
    border: none;
    right: 15px;
    font-size: 24px;
    color: #FFF;
    background-color: transparent;
    cursor: pointer;
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
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .2s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
  .clear{
    clear: both;
  }
  @media all and (max-width: 768px){
    #GNB {
      height: 50px;
    }
    #GNB > div > img {
      margin: 5px;
      height: 40px;
      padding: 5px;
    }
    #MobMenu{
      margin-top: 5px;
      right: 10px;
    }
  }
</style>
