<template>
  <div id="Practice">
    <div class="portfolioHead">
      <button @click="authClick()">
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>Write</span>
      </button>
    </div>
    <input-portfolio
      v-if="isAuth"
      @close-pop="closePop"
      @reload="getData"
    ></input-portfolio>
    <ul class="ulPrac">
      <portfolio-item v-for="temp in list" :item="temp" :isMobile="isMobile" />
    </ul>
    <div class="popPrac"></div>
  </div>
</template>

<script>
import inputPortfolio from '../Input/Input-Portfolio.vue';
import PortfolioItem from './PortfolioItem.vue';

export default {
  components: {
    inputPortfolio,
    PortfolioItem,
  },
  name: 'practice',
  props: ['isMobile'],
  methods: {
    async authClick() {
      if (this.isAuth) {
        this.isAuth = false;
        return;
      }
      this.isAuth = await this.$firebase.login();
    },
    closePop() {
      const temp = confirm('정말 그만쓸거야?');
      if (temp) {
        this.isAuth = false;
      }
    },
    getData() {
      this.list = [];
      this.isAuth = false;
      this.$firebase.database('/portfolio').once('value', (snap) => {
        const list = snap.val();
        const keys = Object.values(list);
        keys.reverse().forEach((x) => {
          const content = {
            title: x.title,
            thumbnail: x.thumbnail,
            spec: x.spec,
            date: x.date,
            url: x.operate ? x.operate.map(v => ({
              name: v.name,
              clickEvent: v.url,
            })) : [],
            participate: x.contribute ? x.contribute.map(v => ({
              title: v.name,
              width: 0,
              rate: v.percent,
            })) : [],
          };
          this.list.push(content);
        });
      });
    },
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      isAuth: false,
      list: [],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.portfolioHead{
  height: 55px;
  padding: 10px;
}
.portfolioHead > button{
  height: 35px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  padding: 0 20px;
  cursor: pointer;
  font-size: 14px;
  border: 0;
  color: #FFF;
  background-color: #c98474;
  left: 10px;
  float: left;
}
.portfolioHead i{
  margin-right: 5px;
}
#Practice{
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  font-family: "Noto Sans KR", sans-serif;
  padding-bottom: 20px;
}
.ulPrac{
  overflow: auto;
  margin: 0;
  padding-top: 20px
}
</style>
