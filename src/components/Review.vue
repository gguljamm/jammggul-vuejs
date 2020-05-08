<template>
  <div id="Review" v-bind:class="isMobile?'mob':''">
    <input-review
      v-if="isAuth"
      @close-pop="closePop"
      @reload="getData"
    ></input-review>
    <div class="reviewHead">
      <button @click="authClick()">글쓰기</button>
      <button @click="categoryOpen=!categoryOpen">{{ categoryOpen?'목록 닫기':'목록 열기' }}</button>
    </div>
    <div class="category" v-bind:class="categoryOpen?'opened':''">
      <div class="categoryHead">
        <button @click="changeCategory('game')" v-bind:class="viewCategory==='game'?'selected':''">게임</button>
        <button @click="changeCategory('movie')" v-bind:class="viewCategory==='movie'?'selected':''">영화&드라마</button>
        <button @click="changeCategory('book')" v-bind:class="viewCategory==='book'?'selected':''">책&음악</button>
        <button @click="changeCategory('etc')" v-bind:class="viewCategory==='etc'?'selected':''">지름신</button>
      </div>
      <div class="categoryContent">
        <ul>
          <li
            v-for="(cont, index) in returnViewList(reviewInfo[viewCategory])"
            v-bind:class="selectedCategory === viewCategory && selectedNum === index + ((viewSubPaging - 1) * 10) ? 'selected' : ''"
            @click="changeContent(index + ((viewSubPaging - 1) * 10))"
          >{{ cont.title }}</li>
        </ul>
        <div class="paging">
          <span
            v-for="num in returnListNum(reviewInfo[viewCategory])"
            @click="viewSubPaging=num"
            v-bind:class="num===viewSubPaging?'selected':''"
          >{{ num }}</span>
        </div>
      </div>
    </div>
    <div v-if="reviewInfo[selectedCategory][selectedNum]" class="reviewContent">
      <p>{{ reviewInfo[selectedCategory][selectedNum].title }}</p>
      <div
        v-for="line in reviewInfo[selectedCategory][selectedNum].content.split('\n')"
        v-if="line.indexOf('#img') < 0"
      >
        {{ line ? line : '&nbsp;' }}
      </div>
      <img v-else v-bind:src="reviewInfo[selectedCategory][selectedNum].imgUrl[(line.split('#img')[1]).split('#')[0]]">
    </div>
  </div>
</template>

<script>
  import inputReview from '../components/Input/Input-Review';

  export default {
    components: {
      inputReview,
    },
    props: ['isMobile'],
    name: 'Review',
    methods: {
      closePop() {
        const temp = confirm('정말 그만쓸거야?');
        if (temp) {
          this.isAuth = false;
        }
      },
      authClick() {
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        this.isAuth = this.$firebase.login();
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
        this.$firebase.database('/review').once('value', (snap) => {
          const list = snap.val();
          const keys = Object.keys(list);
          const latestKey = keys[keys.length - 1];
          keys.reverse().forEach((x) => {
            const content = {
              content: list[x].content,
              title: list[x].title,
              imgUrl: list[x].imgUrl,
            };
            this.reviewInfo[list[x].category].push(content);
            if (x === latestKey) {
              this.selectedCategory = list[x].category;
              this.viewCategory = list[x].category;
              this.selectedNum = this.reviewInfo[list[x].category].length - 1;
            }
          });
        });
      },
    },
    data() {
      return {
        categoryOpen: false,
        selectedNum: 0,
        selectedCategory: 'game',
        viewCategory: 'game',
        reviewInfo: {
          game: [],
          book: [],
          movie: [],
          etc: [],
        },
        viewSubPaging: 1,
        viewList: [],
        isAuth: false,
      };
    },
    mounted() {
      this.getData();
    },
  };
</script>

<style scoped>
  #Review{
    max-width: 1080px;
    margin: 0 auto;
    font-family: 'Noto Sans KR', sans-serif;
  }
  .reviewHead{
    height: 40px;
    width: 100%;
    margin-bottom: 10px;
  }
  .reviewHead > button{
    height: 30px;
    margin-top: 10px;
    background-color: #FFF;
    border: 1px solid #eee;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    cursor: pointer;
  }
  .reviewHead > button:first-child{
    float: left;
  }
  .reviewHead > button:last-child{
    float: right;
  }
  .category{
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: .3s ease;
    background-color: #FFF;
  }
  .category.opened{
    height: 340px;
    opacity: 1;
    margin-bottom: 10px;
  }
  .categoryHead{
    overflow: auto;
    width: 100%;
  }
  .categoryHead > button{
    width: 25%;
    height: 40px;
    float: left;
    background-color: transparent;
    padding: 0;
    border: 1px solid #ccc;
    border-right: 0;
    cursor: pointer;
  }
  .categoryHead > button:last-child{
    border-right: 1px solid #ccc;
  }
  .categoryHead > button.selected{
    background-color: lightskyblue;
  }
  .categoryContent{
    border: 1px solid #ccc;
    border-top: 0;
    height: 300px;
    text-align: center;
  }
  .categoryContent > ul{
    height: 270px;
    padding: 10px;
    text-align: left;
  }
  .categoryContent > ul > li{
    line-height: 25px;
    height: 25px;
    cursor: pointer;
    padding: 0 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .categoryContent > ul > li.selected{
    color: cornflowerblue;
  }
  .categoryContent > ul > li:hover{
    background-color: #f2d388;
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
    color: #f2d388;
    opacity: 0.8;
  }
  .paging > span.selected{
    color: #f2d388;
  }
  .reviewContent{
    background-color: #FFF;
    margin-bottom: 30px;
    padding: 30px;
  }
  .reviewContent > p{
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .mob .reviewContent{
    padding: 10px;
  }
  .reviewContent img{
    max-width: 90%;
    display: block;
    margin: 50px auto;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
  }
  .mob .reviewContent img{
    max-width: 100%;
    margin: 20px auto;
  }
</style>
