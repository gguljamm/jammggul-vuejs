<template>
  <div id="Review" :class="isMobile?'mob':''">
    <input-review
      v-if="isAuth"
      @close-pop="closePop"
      @reload="getData"
    ></input-review>
    <div class="reviewHead">
      <button @click="authClick()">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </button>
      <button @click="categoryOpen = !categoryOpen">
        <i :class="categoryOpen ? 'fa fa-times' : 'fa fa-list'" aria-hidden="true"></i>
      </button>
    </div>
    <div v-if="error" style="padding: 40px; text-align: center; color: coral; font-size: 24px;" v-html="error"></div>
    <div class="category" :class="categoryOpen?'opened':''">
      <div class="categoryHead">
        <button @click="changeCategory('game')" :class="viewCategory==='game'?'selected':''">game</button>
        <button @click="changeCategory('culture')" :class="viewCategory==='culture'?'selected':''">culture</button>
        <button @click="changeCategory('unboxing')" :class="viewCategory==='unboxing'?'selected':''">unboxing</button>
      </div>
      <div class="categoryContent">
        <ul>
          <li
            v-for="(cont, index) in returnViewList(reviewInfo[viewCategory])"
            :class="selectedCategory === viewCategory && selectedNum === index + ((viewSubPaging - 1) * 10) ? 'selected' : ''"
            @click="changeContent(index + ((viewSubPaging - 1) * 10))"
          >{{ cont.title }}</li>
        </ul>
        <div class="paging">
          <span
            v-for="num in returnListNum(reviewInfo[viewCategory])"
            @click="viewSubPaging=num"
            :class="num===viewSubPaging?'selected':''"
          >{{ num }}</span>
        </div>
      </div>
    </div>
    <div v-if="reviewInfo[selectedCategory][selectedNum]" class="reviewContent">
      <p>{{ reviewInfo[selectedCategory][selectedNum].title }}</p>
      <template
        v-for="line in reviewInfo[selectedCategory][selectedNum].content.split('\n')"
      >
        <div
          v-if="line.indexOf('#img') < 0"
        >
          {{ line ? line : '&nbsp;' }}
        </div>
        <img v-else :src="reviewInfo[selectedCategory][selectedNum].imgUrl[(line.split('#img')[1]).split('#')[0]]">
      </template>
    </div>
  </div>
</template>

<script>
  import inputReview from './Input/InputReview.vue';
  import {collection, getDocs, getFirestore, limit, orderBy, query} from "firebase/firestore";

  export default {
    components: {
      inputReview,
    },
    props: ['isMobile'],
    name: 'Review',
    data() {
      let initTab = location.pathname.split('/').pop();
      return {
        categoryOpen: false,
        selectedNum: 0,
        selectedCategory: initTab,
        viewCategory: initTab,
        reviewInfo: {
          game: [],
          culture: [],
          unboxing: [],
        },
        viewSubPaging: 1,
        viewList: [],
        isAuth: false,
        error: '',
      };
    },
    methods: {
      closePop() {
        const temp = confirm('정말 그만쓸거야?');
        if (temp) {
          this.isAuth = false;
        }
      },
      async authClick() {
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        this.isAuth = await this.$firebase.login();
      },
      changeCategory(index) {
        this.viewCategory = index;
        this.viewSubPaging = 1;
      },
      changeContent(index) {
        this.selectedCategory = this.viewCategory;
        this.selectedNum = index;
      },
      returnViewList(list) {
        const subPaging = this.viewSubPaging * 10;
        const startPaging = (this.viewSubPaging - 1) * 10;
        const returnList = [];
        for (let x = startPaging; x < subPaging && x < list.length; x += 1) {
          returnList.push(list[x]);
        }
        return returnList;
      },
      returnListNum(list) {
        const numList = [];
        const lastNum = Math.ceil(list.length / 10);
        for (let x = 0; x < lastNum; x += 1) {
          numList.push(x + 1);
        }
        return numList;
      },
      getData() {
        this.isAuth = false;

        const db = getFirestore();

        const dailyQuery = query(
          collection(db, 'review'),
          orderBy('date', 'desc'),
        );
        getDocs(dailyQuery).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            const content = {
              content: data.content,
              title: data.title,
              imgUrl: data.imgUrl,
            };
            this.reviewInfo[data.category].push(content);
          });
        });
      },
    },
    mounted() {
      this.getData();
    },
  };
</script>

<style scoped lang="scss">
  #Review{
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 10px 40px;
  }
  .reviewHead{
    width: 100%;
    margin-top: 10px;
    display: flex;
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
  .category{
    margin-top: 10px;
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: .3s ease;
    background-color: #FFF;
    border-radius: 8px;
    border: 1px solid #d7d8d9;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, .1);
  }
  .category.opened{
    height: 360px;
    opacity: 1;
    margin-bottom: 10px;
  }
  .categoryHead{
    overflow: auto;
    width: 100%;
    display: flex;
  }
  .categoryHead > button{
    flex: 0 0 33.33%;
    height: 40px;
    float: left;
    background-color: transparent;
    padding: 0;
    border: 0;
    border-right: 1px solid #d7d8d9;
    border-bottom: 1px solid #d7d8d9;
    cursor: pointer;
    font-size: 16px;
    transition: background-color .3s ease;
  }
  .categoryHead > button:last-child{
    border-right: 0;
  }
  .categoryHead > button.selected{
    background-color: lightskyblue;
    color: #fff;
    font-weight: bold;
  }
  .categoryContent{
    border-top: 0;
    height: 320px;
    text-align: center;
  }
  .categoryContent > ul{
    height: 290px;
    padding: 20px 10px;
    text-align: left;
  }
  .categoryContent > ul > li{
    line-height: 25px;
    height: 25px;
    cursor: pointer;
    padding: 0 10px;
    border-radius: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .categoryContent > ul > li.selected{
    color: cornflowerblue;
  }
  .categoryContent > ul > li:hover{
    background-color: lightskyblue;
    color: #FFF;
  }
  .categoryContent .paging{
    height: 20px;
    line-height: 20px;
    display: inline-block;
  }
  .paging > span{
    cursor: pointer;
    height: 20px;
    line-height: 20px;
    float: left;
    padding: 0 5px;
  }
  .paging > span:hover{
    color: lightskyblue;
    opacity: 0.8;
  }
  .paging > span.selected{
    color: cornflowerblue;
  }
  .reviewContent{
    background-color: #FFF;
    margin-bottom: 30px;
    border: 1px solid #d7d8d9;
    border-radius: 8px;
    padding: 20px 20px 40px;
    box-shadow: 0 0 10px 1px rgb(0 0 0 / 10%);
    margin-top: 8px;
  }
  .reviewContent > p{
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #d7d8d9;
    padding: 10px 0 20px;
    margin: 0 0 30px;
  }
  .mob .reviewContent > p{
    padding: 0 0 10px;
    margin: 0 0 20px;
  }
  .reviewContent img{
    max-width: 90%;
    display: block;
    margin: 50px auto;
    box-shadow: 0 0 4px 1px rgba(0,0,0,.1);
    border-radius: 4px;
  }
  .mob .reviewContent img{
    max-width: 100%;
    margin: 20px auto;
  }
</style>
