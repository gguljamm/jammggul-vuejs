<template>
  <div class="navigationWrap">
    <img src="../assets/images/sign.png">
    <ul>
      <li>
        <p :class="{ active: page === 'about' }" @click="navChange('about')">home.</p>
      </li>
      <li>
        <p :class="{ active: page === 'daily' }" @click="navChange('daily')">diary.</p>
      </li>
      <li>
        <p>develop.</p>
        <div>
          <div :class="{ active: page === 'dev/blog' }" @click="navChange('dev/blog')">blog</div>
          <div :class="{ active: page === 'portfolio' }" @click="navChange('portfolio')">portfolio</div>
          <div :class="{ active: page === 'dev/retrospect' }" @click="navChange('dev/retrospect')">retrospect</div>
        </div>
      </li>
      <li>
        <p>review.</p>
        <div>
          <div :class="{ active: page === 'review/game' }" @click="navChange('review/game')">game</div>
          <div :class="{ active: page === 'review/culture' }" @click="navChange('review/culture')">culture</div>
          <div :class="{ active: page === 'review/unboxing' }" @click="navChange('review/unboxing')">unboxing</div>
        </div>
      </li>
      <li>
        <p :class="{ active: page === 'travel' }" @click="navChange('travel')">travel.</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  onMounted, nextTick, ref, defineComponent, onUnmounted,
} from 'vue';

export default {
  name: 'navigation',
  props: ['page'],
  setup(props, ctx) {
    let scrollPosition = 0;
    onMounted(() => {
      scrollPosition = window.pageYOffset;
      window.document.body.classList.add('popup');
      window.document.body.style.top = `-${scrollPosition}px`;
    });
    onUnmounted(() => {
      window.document.body.classList.remove('popup');
      window.document.body.style.removeProperty('top');
      window.scrollTo(0, scrollPosition);
    });
    return {
      navChange: (page) => {
        ctx.emit('transChange', page);
      }
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .navigationWrap {
    z-index: 999;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    background-color: #39496e;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);
    > img{
      width: 180px;
      height: 44px;
      display: block;
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
    }
    ul{
      position: absolute;
      top: 124px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding-bottom: 20px;
      color: #FFF;
      > li{
        > p{
          padding: 14px 30px;
          font-weight: 600;
          font-size: 18px;
          margin: 0;
          line-height: 21px;
          cursor: pointer;
          &.active{
            background-color: rgba(23, 32, 15, .2);
          }
        }
        > div{
          > div{
            border-left: 1px solid #fff;
            margin-left: 30px;
            cursor: pointer;
            padding: 14px 20px;
            line-height: 21px;
            &.active{
              background-color: rgba(23, 32, 15, .2);
            }
          }
        }
      }
    }
  }
</style>
