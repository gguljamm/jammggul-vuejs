<template>
<div id="DevInfo">
  <div class="input">
    <button @click="authClick"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><span>Write</span></button>
  </div>
  <input-it v-if="isAuth" v-bind:isMobile="isMobile"></input-it>
  <div class="devWrapper">
    <div>
      <div>
        <div>
          <span>IT<br>Information</span><br>
          <span>IT트랜드와 개발 이슈등을 저장하는 공간</span>
        </div>
      </div>
      <div>
        <div class="categoryBox">
          <p>카테고리</p>
          <ul class="category">
            <li @click="changeIndex('recent')" v-bind:class="selectIndex==='recent'?'selected':''">RECENT 20</li>
            <li @click="changeIndex('it')" v-bind:class="selectIndex==='it'?'selected':''">IT <span>({{objList.it.length}})</span></li>
            <li @click="changeIndex('dev')" v-bind:class="selectIndex==='dev'?'selected':''">웹개발 <span>({{objList.dev.length}})</span></li>
            <li @click="changeIndex('hardware')" v-bind:class="selectIndex==='hardware'?'selected':''">하드웨어 <span>({{objList.hardware.length}})</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="itList" v-if="!isMobile">
      <ul><transition-group name="component-fade" mode="out-in"><li v-for="list in list1" v-bind:key="list[0][0]">
        <div v-for="(content, index) in list">
          <div v-if="index%2===0"><div v-for="text in content">{{ text?text:'&nbsp;' }}</div></div>
          <div v-else class="imgCont"><img v-bind:src="content" @click="imgPop(content)"></div>
        </div>
      </li></transition-group></ul>
      <ul><transition-group name="component-fade" mode="out-in"><li v-for="list in list2" v-bind:key="list[0][0]">
        <div v-for="(content, index) in list">
          <div v-if="index%2===0"><div v-for="text in content">{{ text?text:'&nbsp;' }}</div></div>
          <div v-else class="imgCont"><img v-bind:src="content" @click="imgPop(content)"></div>
        </div>
      </li></transition-group></ul>
    </div>
    <div class="itList" v-else>
      <ul><transition-group name="component-fade" mode="out-in"><li v-for="list in mobList" v-bind:key="list[0][0]">
        <div v-for="(content, index) in list">
          <div v-if="index%2===0"><div v-for="text in content">{{ text?text:'&nbsp;' }}</div></div>
          <div v-else class="imgCont"><img v-bind:src="content" @click="imgPop(content)"></div>
        </div>
      </li></transition-group></ul>
    </div>
  </div>
  <div v-if="popFlag" @click="popFlag=false;" class="imgPop">
    <div>
      <img v-bind:src="popImgSrc">
    </div>
  </div>
</div>
</template>

<script>
  import Firebase from 'firebase';
  import inputIt from '../components/input-IT';

  export default {
    name: 'devInfo',
    components: {
      inputIt,
    },
    props: ['isMobile'],
    data() {
      return {
        mobList: [],
        list1: [],
        list2: [],
        popFlag: false,
        popImgSrc: '',
        isAuth: false,
        objList: {
          recent: [],
          it: [],
          dev: [],
          hardware: [],
        },
        selectIndex: 'recent',
      };
    },
    methods: {
      changeIndex(index) {
        this.selectIndex = index;
        const list = this.objList[index];
        this.list1 = [];
        this.list2 = [];
        this.mobList = [];
        for (let x = 0, leng = list.length; x < leng; x += 1) {
          const arrContent = list[x].content.split('#img#');
          const arrContentImg = [];
          for (let y = 0; y < arrContent.length; y += 1) {
            arrContentImg.push(arrContent[y].split('\n'));
            if (y < (arrContent.length - 1)) {
              arrContentImg.push(list[x].imgUrl[y]);
            }
          }
          if (x % 2 === 0) {
            this.list1.push(arrContentImg);
          } else {
            this.list2.push(arrContentImg);
          }
          this.mobList.push(arrContentImg);
        }
      },
      authClick() {
        const firebase = this.$firebase;
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        const user = firebase.auth().currentUser;
        if (user) {
          if (user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
            this.isAuth = true;
          } else {
            alert('나만 글쓸거야!!'); // eslint-disable-line
          }
        } else {
          const provider = Firebase.auth.GoogleAuthProvider();
          Firebase.auth().signInWithPopup(provider).then((result) => {
            if (result.user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
              this.isAuth = true;
            } else {
              alert('나만 글쓸거야!!'); // eslint-disable-line
              const newUser = result.user;
              let credential;
              newUser.reauthenticate(credential).then(() => {
              });
            }
          }).catch(() => {
            alert('글을 쓰려면 로그인이 필요합니다.'); // eslint-disable-line
          });
        }
      },
      imgPop(src) {
        this.popFlag = true;
        this.popImgSrc = src;
      },
    },
    mounted() {
      this.$firebase.database().ref('/it-info')
        .once('value', (snap) => {
          const list = snap.val();
          Object.keys(list).reverse().forEach((x, index) => {
            const content = { content: list[x].content, imgUrl: list[x].imgUrl };
            if (this.objList[list[x].category]) {
              this.objList[list[x].category].push(content);
            }
            if (index < 20) {
              this.objList.recent.push(content);
            }
            this.changeIndex(this.selectIndex);
          });
        });
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #DevInfo{
    max-width: 1080px;
    margin: 0 auto;
  }
  .input{
    padding: 10px;
    height: 55px;
  }
  .input > button{
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
  }
  .input i{
    margin-right: 5px;
  }
  .devWrapper{
    width: 100%;
    position: relative;
    font-family: "Noto Sans KR", sans-serif;
  }
  .devWrapper, .devWrapper > div{
    overflow: auto;
    margin-top: 10px;
  }
  .devWrapper .itList > ul, .devWrapper > div > div{
    float:left;
    width: 50%;
  }
  .devWrapper .itList > ul li, .devWrapper > div > div > div{
    margin: 0 10px 20px 10px;
    background-color: #FFF;
    padding: 30px;
    word-break: break-all;
  }
  .devWrapper > div > div > div{
    min-height: 300px;
  }
  .devWrapper > div > div:first-child > div{
    background-color: transparent;
    padding-left: 40px;
    padding-top: 70px;
  }
  .devWrapper > div > div > div > span:first-child{
    font-size: 60px;
    line-height: 50px;
    font-family: 'Baloo Bhaijaan', sans-serif;
    color: #f2d388;
  }
  .devWrapper > div > div > div > span:last-child{
    font-size: 20px;
    line-height: 40px;
  }
  .categoryBox p{
    margin: 0;
    font-size: 20px;
    line-height: 24px;
    font-weight: bold;
  }
  .category{
    padding: 10px;
  }
  .category > li{
    cursor: pointer;
    border-bottom: 1px solid #eee;
    padding: 10px;
    margin-top: 10px;
  }
  .category > li.selected{
    color: coral;
  }
  .category > li:not(.selected):hover{
    color: coral;
    opacity: .8;
  }
  .devWrapper .itList > ul li{
    line-height: 24px;
    -webkit-box-shadow: 1px 1px 1px 1px rgba(0,0,0,.1);
    -moz-box-shadow: 1px 1px 1px 1px rgba(0,0,0,.1);
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,.1);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
  .imgCont{
    text-align: center;
  }
  .devWrapper .itList > ul li img{
    max-width: 100%;
    margin: 10px 0;
    cursor: zoom-in;
  }
  .imgPop{
    z-index: 11;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    cursor: zoom-out;
  }
  .imgPop > div{
    max-width: 1080px;
    margin: 0 auto;
    text-align: center;
    height: 100%;
  }
  .imgPop > div > img{
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    max-width: 100%;
  }
  @media all and (max-width: 940px){
    .devWrapper > div > div > div > span:first-child{
      font-size: 60px;
      line-height: 50px;
      font-family: 'Baloo Bhaijaan', sans-serif;
      color: #f2d388;
    }
  }
  @media all and (max-width: 768px){
    .devWrapper .itList > ul, .devWrapper > div > div{
      width: 100%;
      float: none;
    }
    .devWrapper > div > div:first-child > div{
      padding: 10px;
      min-height: inherit;
    }
    .devWrapper > div > div > div > span:first-child{
      font-size: 30px;
      line-height: 20px
    }
    .devWrapper > div > div > div > span:last-child{
      font-size: 16px;
      line-height: 16px;
    }
    .devWrapper > div > div > div.categoryBox{
      min-height: inherit;
    }
  }
</style>
