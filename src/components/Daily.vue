<template>
<div id="Daily">
  <div class="mainTitle">
    <button class="filter"><span>All</span><i class="fa fa-calendar-check-o" aria-hidden="true"></i></button>
    <button class="write" @click="authClick">
      <span v-if="!isAuth"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> 글쓰기</span>
      <span v-else><i class="fa fa-minus-square-o" aria-hidden="true"></i> 접기</span>
    </button>
  </div>
  <div class="inputBox">
    <div v-if="isAuth">
      <textarea id="TextArea"></textarea>
      <input id="ImgArea" type="file"> <button @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> 올리기</button>
    </div>
  </div>
  <div class="sk-folding-cube"
    v-if="!loaded">
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  </div>
  <ul class="dailyList">
    <li v-for="item in items" v-getheight="{ item }">
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
              <img v-if="item.imgUrl" v-bind:src="item.imgUrl">
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
  export default {
    name: 'daily',
    methods: {
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
          }
        }).catch(() => {
          alert('나만 글쓸거야!!'); // eslint-disable-line
        });
      },
      submit() {
        const img = document.getElementById('ImgArea').files[0];
        if (img) {
          const name = `daily/${img.name}`;
          const ref = firebase.storage().ref().child(name);
          ref.put(img).then((snapshot) => {
            this.upload(snapshot.downloadURL);
          });
        } else {
          this.upload('');
        }
      },
      upload(url) {
        const newDate = new Date();
        const text = document.getElementById('TextArea').value;
        let dateString = newDate.getFullYear();
        dateString += this.zeros(parseInt(newDate.getMonth(), 10) + 1);
        dateString += this.zeros(newDate.getDate());
        firebase.database().ref('/daily').push({
          date: parseInt(dateString, 10),
          content: text,
          imgUrl: url,
        }).then(() => {
          alert('포스팅 성공!'); // eslint-disable-line
        });
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
    data() {
      return {
        items: [],
        isAuth: false,
        loaded: false,
      };
    },
    mounted() {
      firebase.database().ref('/daily').orderByChild('date').once('value', (data) => {
        const list = data.val();
        Object.keys(list).reverse().forEach((key) => {
          const getDate = list[key].date.toString();
          let newDate = getDate.slice(0, 4);
          newDate += '-';
          newDate += getDate.slice(4, 6);
          newDate += '-';
          newDate += getDate.slice(6, 8);
          list[key].date = newDate;
          this.items.push(list[key]);
        });
        this.loaded = true;
      });
    },
    directives: {
      getheight: {
        inserted: (item) => {
          const height = item.querySelector('.content > div > div').offsetHeight;
          const img = item.querySelector('.content img');
          if (height > 100) {
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
  }
  .filter{
    position: absolute;
    margin-top: 10px;
    height: 30px;
    right: 0;
    border: 1px solid #a7d2cb;
    background-color: #FFF;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    width: 80px;
    cursor: pointer;
  }
  .write{
    width: 100px;
    height: 30px;
    border: 0;
    color: #FFF;
    background-color: #c98474;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    position: absolute;
    margin-top: 10px;
    left: 0;
    cursor: pointer;
  }
  .filter > i, .write > i{
    margin-left: 10px;
  }
  .dailyList > li{
    width: 33.3333%;
    padding: 0 10px 20px 10px;
    float: left;
  }
  .dailyList > li .dailyBox{
    height: 150px;
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
    height: 120px;
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
    height: 100%;
    overflow-y: hidden;
    position: relative;
  }
  .content > div img{
    visibility: hidden;
    max-width: 100%;
    margin-top: 20px;
  }
  .icons{
    position: absolute;
    right: 0;
    bottom: 0;
    color: #c98474;
  }
  .icons > i{
    margin-left: 10px;
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
    min-height: 120px;
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
  .inputBox{
    text-align: right;
    padding-bottom: 20px;
  }
  .inputBox button{
    width: 100px;
    height: 30px;
    border: 0;
    color: #FFF;
    background-color: #c98474;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .inputBox > div{
    border: 1px solid #c98474;
    padding: 10px;
    -webkit-box-shadow: 1px 1px 1px 1px rgba(0,0,0,.3);
    -moz-box-shadow: 1px 1px 1px 1px rgba(0,0,0,.3);
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,.3);
    background-color: #FFF;
  }
  .inputBox textarea{
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    resize: none;
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
  }
</style>
