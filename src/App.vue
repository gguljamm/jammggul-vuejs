<template>
  <div>
    <div class="mainWrap">
      <div class="header" :class="{ main: page === 'about' || page === 'travel', isScrolled: !isScrollTop, isNight: !sun }" :style="{ transform: isNavOpen ? 'translateX(-150px)' : '' }">
        <div>
          <img
            v-if="sun"
            @click="pageReload"
            src="./assets/images/jammggul_logo.png" alt="jammggul"
          />
          <img
            v-else-if="page === 'about'"
            @click="pageReload"
            src="./assets/images/jammggul_logo_night.png" alt="jammggul"
          />
          <img
            v-else
            @click="pageReload"
            src="./assets/images/jammggul_logo_night2.png" alt="jammggul"
          />
          <button
            @click="isNavOpen = true">
            <i aria-hidden="true" class="fa fa-bars"></i>
          </button>
        </div>
      </div>
      <div :style="{ transform: isNavOpen ? 'translate3d(-150px, 0, 0)' : '' }" style="transition: transform .3s ease; position: relative">
        <component :is="componentName" :isMobile="isMobile" :sun="sun" :key="page"></component>
      </div>
    </div>
    <Transition>
      <navigation
        :page="page"
        v-if="isNavOpen"
        @transChange="navigate">
      </navigation>
    </Transition>
    <Transition name="fade">
      <div class="popupBack" @click="isNavOpen = false" v-show="isNavOpen"></div>
    </Transition>
    <full-loading
      v-show="store.isLoading"
    ></full-loading>
  </div>
</template>

<script>
import {
  onMounted, nextTick, ref, defineComponent, onUnmounted, computed,
} from 'vue';
import Navigation from './components/Navigation.vue';
import About from './components/About.vue';
import Portfolio from './components/Portfolio/index.vue';
import DevBlog from './components/Dev/Blog.vue';
import DevRetrospect from './components/Dev/Retrospect.vue';
import Travel from './components/Travel.vue';
import Daily from './components/Daily.vue';
import Review from './components/Review.vue';
import Test from './components/Test.vue';
import FullLoading from './components/FullLoading.vue';
import './assets/lib/sun.js';
import { useStore } from './stores';

export default {
  name: 'app',
  components: {
    Navigation,
    About,
    Daily,
    Portfolio,
    Review,
    DevBlog,
    DevRetrospect,
    Travel,
    Test,
    FullLoading,
  },
  setup() {
    const store = ref({});
    const now = new Date();
    const sunset = new Date().sunset(37.5666805, 126.9784147);
    const sunrise = new Date().sunrise(37.5666805, 126.9784147);
    const sun = !(now > sunset && now < sunrise);
    const isScrollTop = ref(true);
    const page = ref('about');
    const scroll = () => {
      isScrollTop.value = window.scrollY <= 0;
    };
    const componentName = computed(() => {
      let name = page.value.indexOf('review') >= 0 ? 'review' : page.value;
      return name.replace('/', '-');
    });
    onMounted(() => {
      store.value = useStore();
      window.addEventListener('scroll', scroll);
    });
    onUnmounted(() => {
      window.removeEventListener('scroll', scroll);
    });
    return {
      componentName,
      page,
      sun,
      isScrollTop: isScrollTop,
      store,
    };
  },
  data() {
    return {
      isMobile: false,
      isNavOpen: false,
      resize: null,
    };
  },
  methods: {
    pageReload() {
      location.href = '/';
    },
    navigate(url, popping) {
      this.isNavOpen = false;
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
  },
  mounted() {
    this.$nextTick(() => {
      this.resize = new ResizeObserver(() => {
        this.isMobile = (window.innerWidth || window.outerWidth) < 768;
      });
      this.resize.observe(window.document.body);
    });
    window.addEventListener('popstate', () => {
      this.isNavOpen = false;
      this.navigate(location.pathname.replace('/', ''), true);
    });
    if (location.pathname && location.pathname !== '/') {
      this.page = location.pathname.replace('/', '');
    }
    this.$firebase.anonymouslyLogin();
    window.addEventListener('scroll', () => {

    })
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss">
  @import './assets/lib/normalize.css';
  @import url('https://fonts.googleapis.com/css?family=Baloo+Bhaijaan');
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  html, body {
    width: 100%;
    height: 100%;
  }

  body.popup{
    overflow: hidden;
    position: fixed;
    width: 100%;
  }

  ul, ol, li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  #app {
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    color: #2c3e50;
    font-size: 16px;
  }
  #app *{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .header {
    width: 100%;
    height: 50px;
    text-align: center;
    top: 0;
    left: 0;
    z-index: 99;
    position: sticky;
    background-color: #FFF;
    transition: .3s ease;
    &.isScrolled{
      box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);
    }
    &.main{
      position: fixed;
      background-color: transparent;
      > div > button{
        transition: color .3s ease;
        color: #FFF;
      }
    }
    &.main.isScrolled{
      background-color: #FFF;
      > div > button{
        color: #2c3e50;
      }
    }
    > div {
      position: relative;
      padding: 5px 0;
      max-width: 1080px;
      margin: 0 auto;
      > img {
        height: 40px;
        display: block;
        margin: 0 auto;
      }
      > button{
        position: absolute;
        width: 50px;
        height: 50px;
        top: 0;
        border: none;
        right: 0;
        font-size: 24px;
        background-color: transparent;
        cursor: pointer;
      }
    }
  }
  .popupBack{
    z-index: 998;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .3);
  }
  .v-enter-active,
  .v-leave-active {
    transition: transform .3s ease;
  }
  .v-enter-from,
  .v-leave-to {
    transform: translateX(300px);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .clear{
    clear: both;
  }
</style>
