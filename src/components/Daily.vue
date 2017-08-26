<template>
<div id="Daily">
  <div class="mainTitle">
    <div v-if="itemsView.length > 0" class="filter">
      <button @click="filterOpen=!filterOpen"><i class="fa fa-calendar-check-o" aria-hidden="true"></i><span>{{ filterOption }}</span></button>
      <div class="calendar" v-if="filterOpen"><div>
        <span></span>
        <div class="year">
          <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
          {{ selectedYear }}
          <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
        </div>
        <ul>
          <li
            v-for="(month, index) in arrMonth"
            v-bind:class="month.num > 0?'':'nonSelectable'"
            @click="month.num > 0?monthClick(index):null"
            >{{ month.text }}<span v-if="month.num > 0">{{ month.num }}</span></li>
        </ul>
        <div class="recent">
          <button @click="filtering('recent')">Recently 20</button>
        </div>
      </div></div>
    </div>
    <div class="write">
      <button @click="authClick">
        <span v-if="!isAuth"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><span>Write</span></span>
        <span v-else><i class="fa fa-minus-square-o" aria-hidden="true"></i> 접기</span>
      </button>
    </div>
  </div>
  <input-box v-if="isAuth"></input-box>
  <div class="sk-folding-cube"
    v-if="!loaded">
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  </div>
  <ul class="dailyList">
    <li v-for="item in itemsView" v-getHeight="{ item }">
      <div class="dailyBox" @click="listClick($event)">
        <div>
          <div class="title">{{ item.date }}</div>
          <div class="content">
            <div>
              <div><div v-for="line in item.content.split('\n')">{{ line }}<br></div></div>
              <span class="icons">
                <i class="fa fa-ellipsis-h moreIcon" aria-hidden="true"></i>
                <i v-if="item.imgUrl" class="fa fa-picture-o" aria-hidden="true"></i>
              </span>
              <img v-if="item.imgUrl" v-bind:data-url="item.imgUrl" style="width: 100%;">
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div class="clear"></div>
</div>
</template>

<script>
  import InputBox from '../components/Input-Box';

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
    methods: {
      monthClick(thisMonth) {
        const obj = {
          year: this.selectedYear,
          month: thisMonth,
        };
        this.filtering(obj);
      },
      listClick(event) {
        for (let x = 0; x < event.path.length; x += 1) {
          if (event.path[x].localName === 'li') {
            if (event.path[x].className.indexOf('clickable') < 0) {
              return;
            }
            break;
          }
        }
        const getEvent = event;
        for (let x = 0; x < getEvent.path.length; x += 1) {
          if (getEvent.path[x].className === 'dailyBox') {
            const selected = document.getElementsByClassName('selected');
            if (selected.length > 0) {
              selected[0].setAttribute('class', 'dailyBox');
            }
            getEvent.path[x].className = 'dailyBox selected';
            const img = getEvent.path[x].querySelector('img');
            if (img && img.getAttribute('data-url')) {
              img.setAttribute('src', img.getAttribute('data-url'));
              img.removeAttribute('data-url');
            }
            break;
          } else if (getEvent.path[x].className === 'dailyBox selected') {
            getEvent.path[x].className = 'dailyBox';
            break;
          }
        }
        // event.target.setAttribute('class', 'selected');
      },
      authClick() {
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
          if (result.user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
            this.isAuth = true;
          } else {
            alert('나만 글쓸거야!!'); // eslint-disable-line
          }
        }).catch(() => {
          alert('글을 쓰려면 로그인이 필요합니다.'); // eslint-disable-line
        });
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
          for (let x = month.length - 1; x >= 0; x -= 1) {
            this.itemsView.push(month[x]);
          }
        }
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
    },
    mounted() {
      firebase.database().ref('/daily')
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
          this.filtering('recent');
          this.loaded = true;
        });
    },
    directives: {
      getHeight: {
        inserted: (item) => {
          const height = item.querySelector('.content > div > div').offsetHeight;
          const img = item.querySelector('.content img');
          if (height > 120) {
            item.setAttribute('class', 'clickable more');
          } else if (img) {
            item.setAttribute('class', 'clickable img');
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
    height: 50px;
    padding: 0 10px;
  }
  .mainTitle > div{
    margin-top: 10px;
    top: 0;
  }
  .mainTitle > div > button{
    height: 30px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    padding: 0 20px;
    cursor: pointer;
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
  .dailyList > li{
    width: 33.3333%;
    padding: 0 10px 20px 10px;
    float: left;
  }
  .dailyList > li .dailyBox{
    height: 190px;
  }
  .dailyList > li.clickable .dailyBox{
    cursor: pointer;
  }
  .dailyList > li .dailyBox > div{
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
  }
  .dailyList > li .dailyBox.selected > div{
    -webkit-box-shadow: 2px 2px 2px 2px rgba(0,0,0,.3);
    -moz-box-shadow: 2px 2px 2px 2px rgba(0,0,0,.3);
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,.3);
  }
  .title{
    font-size: 16px;
    line-height: 30px;
    height: 30px;
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
    margin-top: 20px;
  }
  .icons{
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #c98474;
    background-color: #FFF;
  }
  .icons > i{
    margin-left: 10px;
  }
  .selected .icons{
    background: none;
  }
  .icons .moreIcon{
    visibility: hidden;
  }
  .more .icons .moreIcon{
    visibility: visible;
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
  .selected .icons > i{
    visibility: hidden;
  }
  .calendar{
    z-index:11;
    position: absolute;
    top: 55px;
    right: 0;
    text-align: center;
    font-family: 'Baloo Bhaijaan', sans-serif;
    padding: 0 10px;
  }
  .calendar > div{
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
  .calendar > div > span{
    position: absolute;
    right: 30px;
    top: -15px;
    width: 0;
    height: 0;
    border-right: 11px solid transparent;
    border-left: 11px solid transparent;
    border-bottom: 15px solid rgba(0,0,0,.3);
  }
  .calendar > div > span:before{
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
  .calendar .year{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e1e2e3;
    line-height: 49px;
    font-size: 18px;
  }
  .calendar .year i{
    cursor: pointer;
    width: 60px;
    height: 49px;
    line-height: 49px;
  }
  .calendar .year i.fa-chevron-circle-left{
    float: left;
  }
  .calendar .year i.fa-chevron-circle-right{
    float: right;
  }
  .calendar ul{
    padding: 9px;
    padding-bottom: 10px;
  }
  .calendar ul li{
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    width: 120px;
    display: inline-block;
  }
  .calendar ul li.nonSelectable{
    cursor: default;
    opacity: 0.5;
    background-color: #eee;
  }
  .calendar ul li:not(.nonSelectable):hover{
    background-color: rgba(242, 211, 136, .5);
  }
  .calendar ul li > span{
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
  .calendar .recent{
    width: 100%;
    padding: 0 9px;
    margin-bottom: 9px;
  }
  .calendar .recent > button{
    width: 100%;
    height: 40px;
    background-color: #f2d388;
    border: 0;
    color: #FFF;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
  .calendar .recent > button:hover{
    opacity: 0.8;
  }


  .sk-folding-cube {
    margin: 20px auto;
    width: 40px;
    height: 40px;
    position: relative;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }
  .sk-folding-cube .sk-cube {
    float: left;
    width: 50%;
    height: 50%;
    position: relative;
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }
  .sk-folding-cube .sk-cube:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #F2D388;
    -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
    animation: sk-foldCubeAngle 2.4s infinite linear both;
    -webkit-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  }
  .sk-folding-cube .sk-cube2 {
    -webkit-transform: scale(1.1) rotateZ(90deg);
    transform: scale(1.1) rotateZ(90deg);
  }
  .sk-folding-cube .sk-cube3 {
    -webkit-transform: scale(1.1) rotateZ(180deg);
    transform: scale(1.1) rotateZ(180deg);
  }
  .sk-folding-cube .sk-cube4 {
    -webkit-transform: scale(1.1) rotateZ(270deg);
    transform: scale(1.1) rotateZ(270deg);
  }
  .sk-folding-cube .sk-cube2:before {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .sk-folding-cube .sk-cube3:before {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  .sk-folding-cube .sk-cube4:before {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
  @-webkit-keyframes sk-foldCubeAngle {
    0%, 10% {
      -webkit-transform: perspective(140px) rotateX(-180deg);
      transform: perspective(140px) rotateX(-180deg);
      opacity: 0;
    } 25%, 75% {
        -webkit-transform: perspective(140px) rotateX(0deg);
        transform: perspective(140px) rotateX(0deg);
        opacity: 1;
      } 90%, 100% {
          -webkit-transform: perspective(140px) rotateY(180deg);
          transform: perspective(140px) rotateY(180deg);
          opacity: 0;
        }
  }

  @keyframes sk-foldCubeAngle {
    0%, 10% {
      -webkit-transform: perspective(140px) rotateX(-180deg);
      transform: perspective(140px) rotateX(-180deg);
      opacity: 0;
    } 25%, 75% {
        -webkit-transform: perspective(140px) rotateX(0deg);
        transform: perspective(140px) rotateX(0deg);
        opacity: 1;
      } 90%, 100% {
          -webkit-transform: perspective(140px) rotateY(180deg);
          transform: perspective(140px) rotateY(180deg);
          opacity: 0;
        }
  }
  @media all and (max-width: 768px){
    .dailyList > li{
      width: 50%;
    }
  }
  @media all and (max-width: 500px){
    .dailyList > li{
      width: 100%;
    }
    .calendar > div{
      width: 100%;
    }
    .calendar ul li{
      width: 33.3333%;
    }
  }
</style>
