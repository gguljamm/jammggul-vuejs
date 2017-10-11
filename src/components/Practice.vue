<template>
<div id="Practice" v-bind:class="isMobile?'mob':''">
  <ul class="ulPrac">
    <li v-for="temp in list">
      <div>
        <div class="contImg"><img v-bind:src="temp.thumbnail?temp.thumbnail:'/static/thumbnail.jpg'"></div>
        <div class="contTitle">{{ temp.title }}</div>
        <div class="contSpec"><span v-for="spec in temp.spec">{{ spec }}</span></div>
        <ul v-if="temp.participate" class="contPart">
          <li v-for="part in temp.participate">
            <div class="partTitle">{{ part.title }}</div>
            <div class="partRate"><div v-bind:style="{width: part.width}">{{ part.rate }}%</div></div>
          </li>
        </ul>
        <div class="hover">
          <div>
            <button class="demo" v-if="temp.url.demo" @click="urlClick(temp.url.demo)"><span>DEMO</span></button>
            <button class="web" v-if="temp.url.website" @click="urlClick(temp.url.website)"><span>WEBSITE</span></button>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div class="popPrac"></div>
</div>
</template>

<script>
  export default {
    name: 'practice',
    props: ['isMobile'],
    methods: {
      urlClick(url) {
        if (typeof url === 'function') {
          url();
        } else {
          window.open(url, '_blank');
        }
      },
      openPop(param) {
        console.log(param); // eslint-disable-line
      },
    },
    mounted() {
      setTimeout(() => {
        for (let x = 0; x < this.list.length; x += 1) {
          if (this.list[x].participate) {
            for (let y = 0; y < this.list[x].participate.length; y += 1) {
              this.list[x].participate[y].width = `${this.list[x].participate[y].rate}%`;
            }
          }
        }
      }, 1000);
    },
    data() {
      return {
        list: [
          {
            title: 'For European Traveler, BringPrice',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbringprice_europe.jpg?alt=media&token=860a45d9-71f8-4535-8a99-1ecc2828243b',
            spec: ['HTML5', 'CSS3', 'Vue.js'],
            url: {
              demo: 'https://europe-project-88861.firebaseapp.com/',
              website: 'http://europe.bringprice.com',
            },
            participate: [
              { title: '화면설계', rate: 90, width: 0 },
              { title: '디자인', rate: 100, width: 0 },
              { title: '프론트개발', rate: 100, width: 0 },
            ],
          },
          {
            title: 'Example',
            thumbnail: '',
            spec: ['HTML5', 'CSS3', 'Vue.js'],
            url: {
              demo: () => { this.openPop('for europe'); },
              website: 'http://europe.bringprice.com',
            },
          },
          {
            title: 'Example',
            thumbnail: '',
            spec: ['HTML5', 'CSS3', 'Vue.js'],
            url: {
              demo: 'https://europe-project-88861.firebaseapp.com/',
              website: 'http://europe.bringprice.com',
            },
          },
          {
            title: 'Example',
            thumbnail: '',
            spec: ['HTML5', 'CSS3', 'Vue.js', 'JQuery', 'React.js'],
            url: {
              demo: 'https://europe-project-88861.firebaseapp.com/',
            },
          },
        ],
      };
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #Practice{
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;
    font-family: "Noto Sans KR", sans-serif;
    padding-bottom: 20px;
  }
  .ulPrac{
    overflow: auto;
    margin: 20px 0;
  }
  .ulPrac > li{
    width: 50%;
    float: left;
    padding: 0 10px;
    padding-bottom: 20px;
  }
  .ulPrac > li:nth-child(odd){
    clear: both;
  }
  .ulPrac > li > div{
    border: 1px solid #e1e3e5;
    padding: 10px;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    position: relative;
  }
  .ulPrac > li .contImg{

  }
  .ulPrac > li .contImg > img{
    width: 100%;
    border: 1px solid #e1e3e5;
  }
  .ulPrac > li .contTitle{
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    padding: 10px 0;
    text-align: center;
  }
  .ulPrac > li .contSpec{
    text-align: center;
    padding-bottom: 10px;
  }
  .ulPrac > li .contSpec > span{
    background-color: skyblue;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    margin-right: 5px;
    padding: 0 10px;
    color: #FFF;
    font-size: 14px;
  }
  .ulPrac > li .contSpec > span:last-child{
    margin-right: 0;
  }
  .ulPrac > li .contPart{
    padding: 20px;
    width: 90%;
    margin: 0 auto;
    border: 1px solid #a7d2cb;
  }
  .ulPrac > li .contPart > li{
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .ulPrac > li .contPart > li:last-child{
    margin-bottom: 0;
  }
  .ulPrac > li .contPart > li .partTitle{
    width: 30%;
    float: left;
    text-align: center;
    padding-right: 10px;
    white-space: nowrap;
  }
  .ulPrac > li .contPart > li .partRate{
    width: 70%;
    float: left;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
  }
  .ulPrac > li .contPart > li .partRate > div{
    text-align: center;
    line-height: 30px;
    color: #FFF;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    width: 0;
    overflow: hidden;
    transition: width 1s ease;
  }
  .ulPrac > li .contPart > li:nth-child(1) .partRate > div{
    background-color: #ffb3ba;
  }
  .ulPrac > li .contPart > li:nth-child(3) .partRate > div{
    background-color: #ffdfba;
  }
  .ulPrac > li .contPart > li:nth-child(5) .partRate > div{
    background-color: #ffffba;
  }
  .ulPrac > li .contPart > li:nth-child(2) .partRate > div{
    background-color: #baffc9;
  }
  .ulPrac > li .contPart > li:nth-child(4) .partRate > div{
    background-color: #bae1ff;
  }
  .ulPrac > li .hover{
    opacity: 0;
    background-color: rgba(0,0,0,.7);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    transition: opacity .2s ease;
  }
  .ulPrac > li > div:hover .hover{
    opacity: 1;
  }
  .mob .ulPrac > li .hover{
    opacity: 1;
    background-color: transparent;
    position: relative;
    margin-top: 10px;
  }
  .ulPrac > li > div .hover > div{
    position: relative;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
  }
  .mob .ulPrac > li > div .hover > div{
    position: relative;
    width: 100%;
    top: 0;
    right: 0;
    transform: none;
  }
  .ulPrac > li > div .hover button{
    cursor: pointer;
    margin-right: 16px;
    height: 40px;
    line-height: 40px;
    color: #FFF;
    border: 0;
    padding: 0 10px;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.2);
    position: relative;
  }
  .ulPrac > li > div .hover button > span{
    z-index: 2;
    position: relative;
  }
  .ulPrac > li > div .hover button:hover:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index:1;
    background-color: rgba(0,0,0,.2);
  }
  .ulPrac > li > div .hover button.demo{
    background-color: #f2d388;
  }
  .ulPrac > li > div .hover button.web{
    background-color: #a7d2cb;
  }
  .ulPrac > li > div .hover button:last-child{
    margin-right: 0;
  }
  @media all and (max-width: 768px){
    .ulPrac > li{
      float: none;
      width: 100%;
    }
  }
</style>
