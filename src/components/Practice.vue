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
            <button v-for="button in temp.url"@click="urlClick(button.clickEvent)"><span>{{ button.name }}</span></button>
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
            title: 'BringPrice renewal with nuxt.js',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbp_nuxt.jpg?alt=media&token=0c95cfb6-cffc-4adc-8f0c-beeb1d2e3c00',
            spec: ['HTML5', 'SCSS', 'nuxt.js', 'Vue.js'],
            url: [
              {
                name: 'SITE',
                clickEvent: 'https://bringprice.com',
              },
            ],
            participate: [
              { title: '화면설계', rate: 30, width: 0 },
              { title: '디자인', rate: 20, width: 0 },
              { title: '프론트개발', rate: 80, width: 0 },
            ],
          },
          {
            title: 'WeMakePrice Hotel Meta Search',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fwmp.jpg?alt=media&token=67562e26-9ba4-4b38-8cc0-4470a7a01ed2',
            spec: ['HTML5', 'CSS3', 'Vue.js'],
            url: [
              {
                name: 'DEMO',
                clickEvent: 'https://wmp-hotel.firebaseapp.com',
              },
              {
                name: 'SITE',
                clickEvent: 'https://mhotel.wonders.app',
              },
            ],
            participate: [
              { title: '화면설계', rate: 10, width: 0 },
              { title: '디자인', rate: 10, width: 0 },
              { title: '프론트개발', rate: 100, width: 0 },
            ],
          },
          {
            title: 'For European Traveler, BringPrice',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbringprice_europe.jpg?alt=media&token=860a45d9-71f8-4535-8a99-1ecc2828243b',
            spec: ['HTML5', 'CSS3', 'Vue.js'],
            url: [
              {
                name: 'DEMO',
                clickEvent: 'https://europe-project-88861.firebaseapp.com/',
              },
              {
                name: 'SITE',
                clickEvent: 'http://europe.bringprice.com',
              },
            ],
            participate: [
              { title: '화면설계', rate: 90, width: 0 },
              { title: '디자인', rate: 100, width: 0 },
              { title: '프론트개발', rate: 100, width: 0 },
            ],
          },
          {
            title: '여행박사 - 다구간 일정 추천 (웹, 모바일)',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Ftourbaksa.jpg?alt=media&token=92b9d5d9-d73e-40c2-b34f-e5a89cf9b149',
            spec: ['HTML5', 'CSS3', 'JQuery', 'JsRender/JsViews'],
            url: [
              {
                name: 'WEB',
                clickEvent: 'http://air2.tourbaksa.com',
              },
              {
                name: 'MOBILE',
                clickEvent: 'http://air2.tourbaksa.com/mobile',
              },
            ],
            participate: [
              { title: '화면설계', rate: 10, width: 0 },
              { title: '디자인', rate: 90, width: 0 },
              { title: '프론트개발', rate: 100, width: 0 },
              { title: '백앤드개발', rate: 10, width: 0 },
            ],
          },
          {
            title: '브링프라이스 어플리케이션',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbp_app.png?alt=media&token=e7b14407-d17a-43ae-8312-d6ce7862220f',
            spec: ['Hybrid App', 'Corbova', 'Phonegap', 'JQuery Mobile'],
            url: [
              {
                name: 'DOWNLOAD',
                clickEvent: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbringprice_0.0.3.apk?alt=media&token=dbc1a99d-04ae-4e37-9345-0d30803b43de',
              },
            ],
            participate: [
              { title: '화면설계', rate: 100, width: 0 },
              { title: '디자인', rate: 100, width: 0 },
              { title: '프론트개발', rate: 100, width: 0 },
            ],
          },
          {
            title: 'BringPrice Web',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbringprice.jpg?alt=media&token=52daa116-5453-41e6-a7e6-ed179f26d5cc',
            spec: ['HTML5', 'CSS3', 'JQuery', 'JsRender/JsViews'],
            url: [
              {
                name: 'SITE',
                clickEvent: 'https://bringprice.com',
              },
            ],
            participate: [
              { title: '화면설계', rate: 10, width: 0 },
              { title: '디자인', rate: 20, width: 0 },
              { title: '프론트개발', rate: 90, width: 0 },
              { title: '백앤드개발', rate: 10, width: 0 },
            ],
          },
          {
            title: 'BringPrice Mobile',
            thumbnail: 'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/practice%2Fbringprice_mobile.jpg?alt=media&token=5b49e4fc-b2fc-43f7-a6e1-8ffc03b925f7',
            spec: ['HTML5', 'CSS3', 'JQuery', 'JsRender/JsViews'],
            url: [
              {
                name: 'SITE',
                clickEvent: 'https://m.bringprice.com',
              },
            ],
            participate: [
              { title: '화면설계', rate: 90, width: 0 },
              { title: '디자인', rate: 100, width: 0 },
              { title: '프론트개발', rate: 100, width: 0 },
            ],
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
    background-color: #FFF;
    border: 1px solid #e1e3e5;
    -webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    box-shadow: 1px 1px 1px 0 rgba(0,0,0,.15);
    position: relative;
  }
  .ulPrac > li .contImg{
    padding: 5px;
  }
  .ulPrac > li .contImg > img{
    width: 100%;
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
    line-height: 32px;
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
    margin-bottom: 30px;
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
    margin-bottom: 10px;
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
  .ulPrac > li > div .hover button:nth-child(1){
    background-color: #f2d388;
  }
  .ulPrac > li > div .hover button:nth-child(2){
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
