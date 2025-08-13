<template>
  <div id="Practice">
    <div class="btns">
      <button @click="authClick()">
        <i :class="isAuth ? 'fa fa-times' : 'fa fa-pencil'" aria-hidden="true"></i>
      </button>
    </div>
    <input-portfolio v-if="isAuth" @close-pop="closePop" @reload="getData"></input-portfolio>
    <ul class="ulPrac">
      <portfolio-item v-for="temp in list" :item="temp" :isMobile="isMobile" />
    </ul>
    <div class="popPrac"></div>
  </div>
</template>

<script>
import inputPortfolio from '../Input/InputPortfolio.vue';
import PortfolioItem from './PortfolioItem.vue';
import { collection, getFirestore, query, orderBy, limit, getDocs } from 'firebase/firestore';

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

      const db = getFirestore();

      const dailyQuery = query(collection(db, 'dev-portfolio'), orderBy('date', 'desc'));
      getDocs(dailyQuery).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          this.list.push({
            title: data.title,
            thumbnail: data.thumbnail,
            spec: data.spec,
            date: data.dates,
            url: data.operate
              ? data.operate.map((v) => ({
                  name: v.name,
                  clickEvent: v.url,
                }))
              : [],
            participate: data.contribute
              ? data.contribute.map((v) => ({
                  title: v.name,
                  width: 0,
                  rate: v.percent,
                }))
              : [],
          });
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
#Practice {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
  .btns {
    display: flex;
    margin-top: 10px;
    padding: 0 10px;
    justify-content: end;
    > button {
      margin-left: 10px;
      padding: 0;
      height: 40px;
      width: 40px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 16px;
      background-color: #fff;
      box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
      border: 1px solid #d7d8d9;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #f1f2f3;
      }
    }
  }
}
.ulPrac {
  margin: 0;
  padding-top: 20px;
}
</style>
