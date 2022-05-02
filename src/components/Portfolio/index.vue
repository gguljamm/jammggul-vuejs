<template>
  <div id="Practice">
    <div class="btns">
      <button @click="authClick()">
        <i :class="isAuth ? 'fa fa-times' : 'fa fa-pencil'" aria-hidden="true"></i>
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
      // this.$firebase.database('/portfolio').once('value', (snap) => {
      //   const list = snap.val();
      //   const keys = Object.values(list);
      //   keys.reverse().forEach((x) => {
      //     const content = {
      //       title: x.title,
      //       thumbnail: x.thumbnail,
      //       spec: x.spec,
      //       date: x.date,
      //       url: x.operate ? x.operate.map(v => ({
      //         name: v.name,
      //         clickEvent: v.url,
      //       })) : [],
      //       participate: x.contribute ? x.contribute.map(v => ({
      //         title: v.name,
      //         width: 0,
      //         rate: v.percent,
      //       })) : [],
      //     };
      //     this.list.push(content);
      //   });
      // });
      this.$firebase.firestore('dev-portfolio').orderBy('date', 'desc').get().then(async (querySnapshot) => {
        querySnapshot.docs.forEach((x, index) => {
          const data = x.data();
          this.list.push({
            title: data.title,
            thumbnail: data.thumbnail,
            spec: data.spec,
            date: data.dates,
            url: data.operate ? data.operate.map(v => ({
              name: v.name,
              clickEvent: v.url,
            })) : [],
            participate: data.contribute ? data.contribute.map(v => ({
              title: v.name,
              width: 0,
              rate: v.percent,
            })) : [],
          })
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
<style scoped lang="scss">
#Practice{
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .btns{
    display: flex;
    margin-top: 10px;
    padding: 0 10px;
    justify-content: end;
    > button{
      margin-left: 10px;
      padding: 0;
      height: 40px;
      width: 40px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 16px;
      background-color: #FFF;
      box-shadow: 0 0 4px 1px rgba(0, 0, 0, .1);
      border: 1px solid #c98474;
    }
  }
}
.ulPrac{
  overflow: auto;
  margin: 0;
  padding-top: 20px
}
</style>
