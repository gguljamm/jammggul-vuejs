<template>
<div id="DevInfo">
  <div class="input">
    <button @click="authClick"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><span>Write</span></button>
  </div>
  <input-it v-if="isAuth" v-bind:isMobile="isMobile" @reload="getData"></input-it>
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
      <ul><transition-group name="component-fade" mode="out-in"><li v-for="(list, idx) in evenArray" :key="`even_${idx}`">
        <div v-for="(content, index) in list">
          <div v-if="index%2===0"><div v-for="text in content" :class="text.type === 'code' ? 'code' : ''">
            <template v-if="text && text.type === 'img'">
              <span>{{ text.value[0] }}</span>
              <a v-bind:href="text.value[1]" target="_blank">{{ text.value[2] }}</a>
              <span>{{ text.value[3] }}</span>
            </template>
            <template v-else-if="text && text.type === 'code'">
              <div v-for="(text2, index2) in text.value"
                :style="{ textIndent: text2.indexOf('  ') >= 0 ? `${text2.match(/  /g).length * 10}px` : '' }"
              >{{ !text2 && (index2 !== 0 && index2 !== text.value.length -1) ? '&nbsp;' : text2 }}</div>
            </template>
            <template v-else-if="text !== 'delete'">{{ text?text:'&nbsp;' }}</template>
          </div></div>
          <div v-else class="imgCont"><img v-lazy="content" @click="imgPop(content)"></div>
        </div>
      </li></transition-group></ul>
      <ul><transition-group name="component-fade" mode="out-in"><li v-for="(list, idx) in oddArray" :key="`odd_${idx}`">
        <div v-for="(content, index) in list">
          <div v-if="index%2===0"><div v-for="text in content" :class="text.type === 'code' ? 'code' : ''">
            <template v-if="text && text.type === 'img'">
              <span>{{ text.value[0] }}</span>
              <a v-bind:href="text.value[1]" target="_blank">{{ text.value[2] }}</a>
              <span>{{ text.value[3] }}</span>
            </template>
            <template v-else-if="text && text.type === 'code'">
              <div v-for="(text2, index2) in text.value"
                :style="{ textIndent: text2.indexOf('  ') >= 0 ? `${text2.match(/  /g).length * 10}px` : '' }"
              >{{ !text2 && (index2 !== 0 && index2 !== text.value.length -1) ? '&nbsp;' : text2 }}</div>
            </template>
            <template v-else-if="text !== 'delete'">{{ text?text:'&nbsp;' }}</template>
          </div></div>
          <div v-else class="imgCont"><img v-lazy="content" @click="imgPop(content)"></div>
        </div>
      </li></transition-group></ul>
    </div>
    <div class="itList" v-else>
      <ul><transition-group name="component-fade" mode="out-in"><li v-for="(list, idx) in mobList" v-bind:key="`mob_${idx}`">
        <div v-for="(content, index) in list">
          <div v-if="index%2===0"><div v-for="text in content" :class="text.type === 'code' ? 'code' : ''">
            <template v-if="text && text.type === 'img'">
              <span>{{ text.value[0] }}</span>
              <a v-bind:href="text.value[1]" target="_blank">{{ text.value[2] }}</a>
              <span>{{ text.value[3] }}</span>
            </template>
            <template v-else-if="text && text.type === 'code'">
              <div v-for="(text2, index2) in text.value"
                :style="{ textIndent: text2.indexOf('  ') >= 0 ? `${text2.match(/  /g).length * 10}px` : '' }"
              >{{ !text2 && (index2 !== 0 && index2 !== text.value.length -1) ? '&nbsp;' : text2 }}</div>
            </template>
            <template v-else-if="text !== 'delete'">{{ text?text:'&nbsp;' }}</template>
          </div></div>
          <div v-else class="imgCont"><img v-lazy="content" @click="imgPop(content)"></div>
        </div>
      </li></transition-group></ul>
    </div>
  </div>
  <div v-if="popFlag" @click="popFlag = false" class="imgPop" v-bind:class="imgHeightOver?'over':''">
    <div>
      <img v-bind:src="popImgSrc" ref="popImg">
    </div>
  </div>
</div>
</template>

<script>
  import inputIt from '../components/Input/Input-Dev';

  export default {
    name: 'devInfo',
    components: {
      inputIt,
    },
    props: ['isMobile'],
    data() {
      return {
        mobList: [],
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
        imgHeightOver: false,
      };
    },
    computed: {
      oddArray() {
        const arr = [];
        for (let x = 0; x < this.mobList.length; x += 1) {
          if (x % 2 === 1) {
            arr.push(this.mobList[x]);
          }
        }
        return arr;
      },
      evenArray() {
        const arr = [];
        for (let x = 0; x < this.mobList.length; x += 1) {
          if (x % 2 === 0) {
            arr.push(this.mobList[x]);
          }
        }
        return arr;
      },
    },
    methods: {
      changeIndex(index) {
        this.selectIndex = index;
        const list = this.objList[index];
        this.mobList = [];
        for (let x = 0, leng = list.length; x < leng; x += 1) {
          const arrContent = list[x].content.split('#img#');
          const arrContentImg = [];
          for (let y = 0; y < arrContent.length; y += 1) {
            const text = arrContent[y].split('\n');
            let procCode = false;
            for (let z = 0, leng2 = text.length; z < leng2; z += 1) {
              if (!procCode) {
                const urlMatch = text[z].match(/#url#/g);
                if (urlMatch && urlMatch.length >= 3) {
                  text[z] = {
                    type: 'img',
                    value: text[z].split('#url#'),
                  };
                } else if (text[z].indexOf('<code>') >= 0) {
                  text[z] = {
                    type: 'code',
                    value: [
                      text[z].split('<code>')[1],
                    ],
                  };
                  if (text[z].value[0].indexOf('</code>') >= 0) {
                    text[z].value[0] = text[z].value[0].replace('</code>', '');
                  } else {
                    procCode = text[z];
                  }
                }
              } else if (text[z].indexOf('</code>') >= 0) {
                procCode.value.push(text[z].split('</code>')[0]);
                text[z] = 'delete';
                procCode = false;
              } else {
                procCode.value.push(text[z]);
                text[z] = 'delete';
              }
            }
            arrContentImg.push(text);
            if (y < (arrContent.length - 1)) {
              arrContentImg.push(list[x].imgUrl[y]);
            }
          }
          this.mobList.push(arrContentImg);
        }
      },
      async authClick() {
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        this.isAuth = await this.$firebase.login();
      },
      imgPop(src) {
        this.popFlag = true;
        this.popImgSrc = src;
        setTimeout(() => {
          const imgHeight = this.$refs.popImg.height;
          const windowHeight = window.innerHeight;
          this.imgHeightOver = (imgHeight > windowHeight);
        }, 100);
      },
      getData() {
        this.isAuth = false;
        this.$firebase.database('/it-info')
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
            });
            this.changeIndex(this.selectIndex);
          });
      },
    },
    mounted() {
      this.getData();
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
  .devWrapper .itList > ul li .code{
    background-color: #3a3b3c;
    color: #FFF;
    font-size: 14px;
    padding: 12px;
    border-radius: 10px;
    white-space: nowrap;
    overflow: auto;
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
  .imgPop.over{
    overflow: auto;
  }
  .imgPop > div{
    max-width: 1080px;
    margin: 0 auto;
    text-align: center;
    height: 100%;
  }
  .imgPop > div > img{
    position: relative;
    max-width: 100%;
    box-shadow: 0 0 10px 2px rgba(0,0,0,.3);
  }
  .imgPop.over > div > img{
    margin: 40px 0;
  }
  .imgPop:not(.over) > div > img{
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
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
