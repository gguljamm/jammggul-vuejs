<template>
  <li class="portfolioItem" ref="item" :class="isMobile?'mob':''">
    <div>
      <div class="contImg">
        <div>
          <div :style="{
            backgroundImage: `url(${item.thumbnail?item.thumbnail:'/public/thumbnail.jpg'})`
          }"></div>
        </div>
      </div>
      <div class="hideBox">
        <button v-for="button in item.url" @click="urlClick(button.clickEvent)" :title="button.name">
          {{ button.name }}
        </button>
      </div>
      <div class="contTitle" v-html="item.title"></div>
      <div class="contSpec"><span v-for="spec in item.spec">{{ spec }}</span></div>
      <div class="contDate" v-if="item.date">[{{ item.date }}]</div>
      <ul v-if="item.participate" class="contPart">
        <li v-for="part in item.participate">
          <div class="partTitle">{{ part.title }}</div>
          <div class="partRate"><div :style="{width: part.width}">{{ part.rate }}%</div></div>
        </li>
      </ul>
<!--      <div class="hover">-->
<!--        <div>-->
<!--          <button v-for="button in item.url" @click="urlClick(button.clickEvent)"><span>{{ button.name }}</span></button>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </li>
</template>

<script>
export default {
  props: ['item', 'isMobile'],
  data() {
    return {
      observer: null,
    };
  },
  methods: {
    urlClick(url) {
      if (typeof url === 'function') {
        url();
      } else {
        window.open(url, '_blank');
      }
    },
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.item.participate) {
        for (let y = 0; y < this.item.participate.length; y += 1) {
          this.item.participate[y].width = `${this.item.participate[y].rate}%`;
        }
      }
    }, {
      root: null,
      threshold: 0.5,
    });
    this.observer.observe(this.$refs.item);
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
};

</script>

<style scoped lang="scss">
.portfolioItem{
  width: 50%;
  float: left;
  padding: 0 10px 20px;
  .contImg{
    transition: transform .3s cubic-bezier(.34,1.61,.7,1);
    background-color: #FFF;
    position: relative;
    z-index: 1;
    > div{
      transition: box-shadow .3s ease;
      border-radius: 8px;
      > div{
        width: 100%;
        padding-bottom: 60%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
  }
  .hideBox{
    margin-top: -42px;
    height: 40px;
    display: flex;
    align-items: end;
    justify-content: center;
    position: relative;
    z-index: 0;
    > button{
      padding: 0 10px;
      height: 30px;
      border-radius: 15px;
      background-color: #FFF;
      margin-right: 10px;
      cursor: pointer;
      border: 0;
      font-size: 12px;
      box-shadow: 0 0 1px 1px rgba(0, 0, 0, .08);
      &:hover{
        background-color: ghostwhite;
      }
      > i {
        color: coral;
      }
    }
  }
  &:hover{
    .contImg{
      transform: translateY(-40px);
      > div{
        box-shadow: 0 0 4px 1px rgb(0 0 0 / 8%);
      }
    }
  }
}
.portfolioItem:nth-child(odd){
  clear: both;
}
.portfolioItem > div{
  padding: 10px 10px 0 10px;
  background-color: #FFF;
  border: 1px solid #d7d8d9;
  border-radius: 8px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, .1);
  position: relative;
}
.portfolioItem .contTitle{
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  padding: 10px 0;
  text-align: center;
}
.portfolioItem .contSpec{
  text-align: center;
  padding-bottom: 10px;
  line-height: 32px;
}
.portfolioItem .contDate{
  text-align: center;
  padding-bottom: 10px;
  line-height: 32px;
}
.portfolioItem .contSpec > span{
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
.portfolioItem .contSpec > span:last-child{
  margin-right: 0;
}
.portfolioItem .contPart{
  padding: 20px;
  width: 90%;
  margin: 0 auto 30px;
}
.portfolioItem .contPart > li{
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
  font-size: 14px;
}
.portfolioItem .contPart > li:last-child{
  margin-bottom: 0;
}
.portfolioItem .contPart > li .partTitle{
  width: 30%;
  float: left;
  text-align: right;
  padding-right: 20px;
  white-space: nowrap;
}
.portfolioItem .contPart > li .partRate{
  width: 70%;
  float: left;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
}
.portfolioItem .contPart > li .partRate > div{
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
.portfolioItem .contPart > li:nth-child(1) .partRate > div{
  background-color: #ffb3ba;
}
.portfolioItem .contPart > li:nth-child(3) .partRate > div{
  background-color: #ffdfba;
}
.portfolioItem .contPart > li:nth-child(5) .partRate > div{
  background-color: #ffffba;
}
.portfolioItem .contPart > li:nth-child(2) .partRate > div{
  background-color: #baffc9;
}
.portfolioItem .contPart > li:nth-child(4) .partRate > div{
  background-color: #bae1ff;
}
.portfolioItem .hover{
  opacity: 0;
  background-color: rgba(0,0,0,.7);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  transition: opacity .2s ease;
}
.portfolioItem > div:hover .hover{
  opacity: 1;
}
.portfolioItem.mob .hover{
  opacity: 1;
  background-color: transparent;
  position: relative;
  margin-bottom: 20px;
}
.portfolioItem > div .hover > div{
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  text-align: center;
}
.portfolioItem.mob > div .hover > div{
  position: relative;
  width: 100%;
  top: 0;
  right: 0;
  transform: none;
}
.portfolioItem > div .hover button{
  cursor: pointer;
  margin-right: 16px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: #FFF;
  border: 0;
  padding: 0 20px;
  box-shadow: 0 2px 4px 1px rgba(0, 0, 0, .1);
  position: relative;
}
.portfolioItem > div .hover button > span{
  z-index: 2;
  position: relative;
}
.portfolioItem > div .hover button:hover:after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index:1;
  background-color: rgba(0,0,0,.2);
}
.portfolioItem > div .hover button:nth-child(1){
  background-color: #f2d388;
}
.portfolioItem > div .hover button:nth-child(2){
  background-color: #a7d2cb;
}
.portfolioItem > div .hover button:last-child{
  margin-right: 0;
}
@media all and (max-width: 768px){
  .portfolioItem{
    float: none;
    width: 100%;
  }
}
</style>
