<template>
<div id="Daily">
  <div class="mainTitle">
    <div v-if="itemsView.length > 0" class="filter">
      <button @click="filterOpen=!filterOpen"><i class="fa fa-calendar-check-o" aria-hidden="true"></i><span>{{ filterOption }}</span></button>
      <div v-if="filterOpen">
        <div class="monthSelector" @click.stop><div>
          <span></span>
          <div class="year">
            <i class="fa fa-chevron-circle-left" aria-hidden="true"
              v-bind:class="selectedYear > 2017 ? '' : 'disabled'"
              @click="selectedYear > 2017 ? changeYear(false) : ''"
            ></i>
            {{ selectedYear }}
            <i class="fa fa-chevron-circle-right" aria-hidden="true"
              v-bind:class="selectedYear < nowYear ? '' : 'disabled'"
              @click="selectedYear < nowYear ? changeYear(true) : ''"
            ></i>
          </div>
          <ul>
            <li
              v-for="(month, index) in arrMonth"
              v-bind:class="{
                nonSelectable: month.num === 0,
                selected: `${selectedYear}-${zeros(index + 1)}` === filterOption,
              }"
              @click="month.num > 0?monthClick(index):null"
              >{{ month.text }}<span v-if="month.num > 0">{{ month.num }}</span>
            </li>
          </ul>
          <div class="recent">
            <button @click="filtering('recent')">Recently 20<i v-if="'Recent' === filterOption" class="fa fa-check"></i></button>
          </div>
        </div></div>
        <div class="monthSelectorBack" @click="popClose"></div>
      </div>
    </div>
    <div class="write">
      <button @click="authClick">
        <span v-if="!isAuth"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><span>Write</span></span>
        <span v-else><i class="fa fa-minus-square-o" aria-hidden="true"></i> 접기</span>
      </button>
    </div>
  </div>
  <input-box v-if="isAuth" v-bind:isMobile="isMobile" @reload="getData"></input-box>
  <loading v-if="!loaded"></loading>
  <ul class="dailyList">
    <transition-group tag="div" name="component-fade" mode="out-in">
      <li
        v-for="item, index in itemsView"
        v-bind:key="`${item.date}-${index}`"
        v-bind:class="item.isMore?'clickable':''"
        v-getHeight="{ item }">
          <div class="dailyBox" v-bind:class="item.viewMore?'selected':''" @click="item.isMore?listClick(item):''">
            <div>
              <div class="title">{{ item.date }}</div>
              <div class="content">
                <div>
                  <div><div v-for="line,key in item.content.split('\n')" v-bind:key="key">{{ line }}<br></div></div>
                  <span class="icons">
                    <i v-if="item.isMore&&item.isMore.indexOf('more')>=0" class="fa fa-ellipsis-h moreIcon" aria-hidden="true"></i>
                    <span class="img_gif" v-if="item.imgUrl && item.imgUrl.indexOf('.gif')>=0">.gif</span>
                    <i class="fa fa-picture-o" aria-hidden="true" v-else-if="item.imgUrl"></i>
                  </span>
                  <div v-if="isLoaded(item.imgUrl, item.loaded)" class="imgLoader">
                    <i class="fa fa-circle-o-notch fa-spin fa-1x fa-fw"></i>
                    <span class="sr-only">Loading...</span>
                  </div>
                  <transition v-if="!Array.isArray(item.imgUrl)" name="component-fade" mode="out-in">
                    <img v-if="isLoaded(item.imgUrl, !item.loaded)" v-bind:src="item.loaded?item.imgUrl:''">
                  </transition>
                  <transition-group name="component-fade" mode="out-in" v-else>
                    <img v-if="isLoaded(item.imgUrl, !item.loaded)" v-for="url in item.imgUrl" v-bind:key="url" v-bind:src="item.loaded?url:''">
                  </transition-group>
                </div>
              </div>
            </div>
          </div>
      </li>
    </transition-group>
  </ul>
  <div class="clear"></div>
</div>
</template>

<script>
  import InputBox from '../components/Input/Input-Daily';

  export default {
    name: 'daily',
    components: {
      'input-box': InputBox,
    },
    data() {
      return {
        items: [],
        itemsView: [],
        isAuth: false,
        loaded: false,
        itemsLength: {},
        filterOpen: false,
        filterOption: 'Recent',
        nowYear: (new Date()).getFullYear(),
        selectedYear: (new Date()).getFullYear(),
        arrMonth: [{ text: 'JAN', num: 0 }, { text: 'FEB', num: 0 }, { text: 'MAR', num: 0 }, { text: 'AFR', num: 0 }, { text: 'MAY', num: 0 }, { text: 'JUN', num: 0 }, { text: 'JUL', num: 0 }, { text: 'AUG', num: 0 }, { text: 'SEP', num: 0 }, { text: 'OCT', num: 0 }, { text: 'NOV', num: 0 }, { text: 'DEC', num: 0 }],
      };
    },
    props: ['isMobile'],
    methods: {
      changeYear(flag) {
        if (flag) {
          this.selectedYear += 1;
        } else {
          this.selectedYear -= 1;
        }
        this.changeMonthNum();
      },
      popClose() {
        this.filterOpen = false;
      },
      isLoaded(a, b) {
        return (a && !b);
      },
      monthClick(thisMonth) {
        const obj = {
          year: this.selectedYear,
          month: thisMonth,
        };
        this.filtering(obj);
      },
      promiseImg(item, url) {
        const thisItem = item;
        return new Promise(() => {
          const loadImg = new Image();
          loadImg.src = url;
          loadImg.onload = () => {
            thisItem.loaded = true;
          };
        });
      },
      notPromiseImg(item, url) {
        const thisItem = item;
        const loadImg = new Image();
        loadImg.src = url;
        loadImg.onload = () => {
          thisItem.loaded = true;
        };
      },
      listClick(item) {
        if (!item.viewMore) {
          for (let x = 0, leng = this.itemsView.length; x < leng; x += 1) {
            this.itemsView[x].viewMore = false;
          }
          if (item.imgUrl) {
            if (Array.isArray(item.imgUrl)) {
              const arrPromise = [];
              for (let y = 0; y < item.imgUrl.length; y += 1) {
                arrPromise.push(this.notPromiseImg(item, item.imgUrl[y]));
              }
            } else {
              this.promiseImg(item, item.imgUrl);
            }
          }
        }
        const item2 = item;
        item2.viewMore = !item2.viewMore;
      },
      authClick() {
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        this.isAuth = this.$firebase.login();
      },
      filtering(opt) {
        this.itemsView = [];
        if (opt === 'recent') {
          this.filterOption = 'Recent';
          for (let x = this.items.length - 1, y = 0; x >= 0; x -= 1, y += 1) {
            if (y >= 20) {
              break;
            }
            this.itemsView.push(this.items[x]);
          }
        } else {
          this.filterOption = `${opt.year}-${this.zeros(opt.month + 1)}`;
          const month = this.itemsLength[opt.year][1 + opt.month];
          for (let x = 0; x < month.length; x += 1) {
            this.itemsView.push(month[x]);
          }
        }
        this.filterOpen = false;
        this.changeMonthNum();
      },
      changeMonthNum() {
        const selectedMonths = this.itemsLength[this.selectedYear];
        for (let x = 0; x < 12; x += 1) {
          if (selectedMonths[x + 1] && selectedMonths[x + 1].length > 0) {
            this.arrMonth[x].num = selectedMonths[x + 1].length;
          } else {
            this.arrMonth[x].num = 0;
          }
        }
      },
      zeros(n) {
        let zero = '';
        let newN = n;
        newN = n.toString();

        if (newN.length < 2) {
          for (let i = 0; i < 2 - newN.length; i += 1) {
            zero += '0';
          }
        }
        return zero + newN;
      },
      getData() {
        this.isAuth = false;
        this.$firebase.database('/daily')
          .orderByChild('date')
          .once('value')
          .then((data) => {
            data.forEach((key) => {
              const resp = key.val();
              const getDate = resp.date.toString();
              let newDate = getDate.slice(0, 4);
              newDate += '-';
              newDate += getDate.slice(4, 6);
              newDate += '-';
              newDate += getDate.slice(6, 8);
              resp.date = newDate;
              resp.loaded = false;
              if (resp.imgUrl) {
                resp.isMore = 'img';
              } else {
                resp.isMore = false;
              }
              resp.viewMore = false;
              this.items.push(resp);
              const year = resp.date.slice(0, 4);
              const month = parseInt(resp.date.slice(5, 7), 10);
              if (this.itemsLength[year]) {
                if (this.itemsLength[year][month]) {
                  this.itemsLength[year][month].push(resp);
                } else {
                  this.itemsLength[year][month] = [resp];
                }
              } else {
                this.itemsLength[year] = {};
                this.itemsLength[year][month] = [resp];
              }
            });
            if (!this.itemsLength[this.nowYear]) {
              this.nowYear -= 1;
              this.selectedYear -= 1;
            }
            this.filtering('recent');
            this.loaded = true;
          });
      },
    },
    mounted() {
      this.getData();
    },
    directives: {
      getHeight: {
        inserted: (ele, value) => {
          const val = value.value;
          const height = ele.querySelector('.content > div > div').offsetHeight;
          if (height > 120) {
            if (val.item.isMore) {
              val.item.isMore = 'img more';
            } else {
              val.item.isMore = 'more';
            }
          }
        },
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #Daily{
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;
  }
  .mainTitle{
    position: relative;
    height: 55px;
    padding: 0 10px;
  }
  .mainTitle > div{
    margin-top: 10px;
    top: 0;
  }
  .mainTitle > div > button{
    height: 35px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    padding: 0 20px;
    cursor: pointer;
    font-size: 14px;
  }
  .mainTitle > div.filter{
    float: right;
  }
  .mainTitle > div.write{
    float: left;
  }
  .filter > button{
    border: 1px solid #a7d2cb;
    background-color: #FFF;
  }
  .write > button{
    border: 0;
    color: #FFF;
    background-color: #c98474;
    left: 10px;
  }
  .filter i, .write i{
    margin-right: 5px;
  }
  .filter li > span{
    width: 20px;
    text-align: center;
  }
  .dailyList li{
    width: 33.3333%;
    padding: 0 10px 20px 10px;
    float: left;
  }
  .dailyList li .dailyBox{
    height: 190px;
  }
  .dailyList li.clickable .dailyBox{
    cursor: pointer;
  }
  .dailyList li .dailyBox > div{
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    margin-bottom: 50px;
  }
  .dailyList li .dailyBox.selected > div{
    -webkit-box-shadow: 1px 1px 10px 2px rgba(0,0,0,.3);
    -moz-box-shadow: 1px 1px 10px 2px rgba(0,0,0,.3);
    box-shadow: 1px 1px 10px 2px rgba(0,0,0,.3);
  }
  .title{
    font-size: 16px;
    border: 1px solid #a7d2cb;
    border-bottom: 0;
    height: 30px;
    line-height: 29px;
    text-align: center;
    background-color: #a7d2cb;
    color: #FFF;
    font-family: 'Open Sans', sans-serif;
    -webkit-border-top-left-radius: 10px;
    -moz-border-radius-topleft: 10px;
    border-top-left-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    -moz-border-radius-topright: 10px;
    border-top-right-radius: 10px;
  }
  .content{
    border: 1px solid #ececec;
    background-color: #FFF;
    border-top: 0;
    height: 160px;
    padding: 10px;
    padding-bottom: 9px;
    line-height: 20px;
    -webkit-border-bottom-left-radius: 10px;
    -moz-border-radius-bottomleft: 10px;
    border-bottom-left-radius: 10px;
    -webkit-border-bottom-right-radius: 10px;
    -moz-border-radius-bottomright: 10px;
    border-bottom-right-radius: 10px;
    position: relative;
    font-family: 'Noto Sans KR', sans-serif;
  }
  .dailyList li.clickable .dailyBox:hover .title, .dailyList li.clickable .dailyBox:hover .content{
    border-color: #f2d388;
  }
  .content > div{
    height: 120px;
    overflow-y: hidden;
  }
  .selected .content > div{
    height: 100%;
  }
  .content > div img{
    visibility: hidden;
    max-width: 100%;
    width: 100%;
    margin-top: 20px;
  }
  .content .imgLoader{
    width: 100%;
    text-align: center;
    padding: 15px 0 10px 0;
    display: none;
  }
  .selected .content .imgLoader{
    display: inline-block;
  }
  .icons{
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #c98474;
  }
  .icons > i{
    margin-left: 10px;
  }
  .img_gif{
    font-size: 12px;
    font-weight: bold;
  }
  .selected .icons{
    background: none;
  }
  .selected{
    position: relative;
    z-index: 10;
  }
  .selected .content{
    height: auto;
    min-height: 160px;
  }
  .selected .content > div{
    overflow-y: visible;
  }
  .selected .content > div img{
    visibility: visible;
  }
  .more .selected .icons > i{
    visibility: hidden;
  }
  .selected .icons > i, .selected .icons .img_gif {
    visibility: hidden;
  }
  .monthSelectorBack{
    z-index: 11;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
  }
  .monthSelector{
    z-index:12;
    position: absolute;
    top: 55px;
    right: 0;
    text-align: center;
    font-family: 'Baloo Bhaijaan', sans-serif;
    padding: 0 10px;
  }
  .monthSelector > div{
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #FFF;
    width: 380px;
    border: 1px solid #a1a2a3;
    -webkit-box-shadow: 0px 0px 10px 5px rgba(0,0,0,.3);
    -moz-box-shadow: 0px 0px 10px 5px rgba(0,0,0,.3);
    box-shadow: 0px 0px 10px 5px rgba(0,0,0,.3);
  }
  .monthSelector > div > span{
    position: absolute;
    right: 30px;
    top: -15px;
    width: 0;
    height: 0;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    border-bottom: 15px solid rgba(0,0,0,.3);
  }
  .monthSelector > div > span:before{
    position: absolute;
    content: '';
    top: 2px;
    left: -10px;
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 14px solid #FFF;
  }
  .monthSelector .year{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e1e2e3;
    line-height: 49px;
    font-size: 18px;
  }
  .monthSelector .year i{
    cursor: pointer;
    width: 60px;
    height: 49px;
    line-height: 49px;
    color: #a7d2cb;
  }
  .monthSelector .year i.disabled{
    opacity: 0.5;
    cursor: default;
  }
  .monthSelector .year i.fa-chevron-circle-left{
    float: left;
  }
  .monthSelector .year i.fa-chevron-circle-right{
    float: right;
  }
  .monthSelector ul{
    padding: 9px;
    padding-bottom: 10px;
    width: 378px;
  }
  .monthSelector ul li{
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    width: 120px;
    display: inline-block;
  }
  .monthSelector ul li.selected{
    box-shadow: 0 0 0 2px #ff4e50 inset;
  }
  .monthSelector ul li.nonSelectable{
    cursor: default;
    opacity: 0.5;
    background-color: #eee;
  }
  .monthSelector ul li:not(.nonSelectable):hover{
    background-color: rgba(242, 211, 136, .5);
  }
  .monthSelector ul li > span{
    width: 16px;
    height: 16px;
    line-height: 16px;
    background-color: #c98474;
    color: #FFF;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    display: inline-block;
    margin-left: 5px;
    font-size: 12px;
  }
  .monthSelector .recent{
    width: 100%;
    padding: 0 9px;
    margin-bottom: 9px;
  }
  .monthSelector .recent > button{
    width: 100%;
    height: 40px;
    background-color: #f2d388;
    border: 0;
    color: #FFF;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
  .monthSelector .recent > button:hover{
    opacity: 0.8;
  }
  .monthSelector .recent > button > i{
    position: absolute;
    color: #ff4e50;
    margin-left: 4px;
  }
  @media all and (max-width: 768px){
    .dailyList li{
      width: 50%;
    }
  }
  @media all and (max-width: 500px){
    .dailyList li{
      width: 100%;
    }
    .monthSelector > div, .monthSelector ul{
      width: 100%;
    }
    .monthSelector ul li{
      width: 33.3333%;
    }
  }
</style>
