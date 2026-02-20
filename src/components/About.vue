<template>
  <div class="aboutWrapper" :class="sun ? 'day' : 'night'">
    <div class="catchphrase">
      <div>
        <template v-for="(x, xIndex) in arrCatchphrase[random].content.split('<br>')">
          <br v-if="xIndex !== 0" /><span
            v-for="(y, yIndex) in x"
            :class="
              y !== ' '
                ? {
                    highlight: getIndex(xIndex, yIndex) === highlightIndex,
                    before: getIndex(xIndex, yIndex) === beforeIndex,
                  }
                : ''
            "
            >{{ y }}</span
          >
        </template>
        <!--        <span v-for="x in arrCatchphrase[random].content.split('')">{{ x }}</span>-->
      </div>
      <!--      <div>- {{ arrCatchphrase[random].name }} -</div>-->
    </div>
    <div id="CloudBack" class="cloud">
      <img src="../assets/images/cloud1.png" />
    </div>
    <div id="UpIcon">
      <img src="../assets/images/up.png" @click="logout()" />
    </div>
    <img id="Cloud1" class="movingCloud cloud" src="../assets/images/cloud4.png" />
    <img id="Cloud2" class="movingCloud cloud" src="../assets/images/cloud3.png" />
    <img id="Cloud3" class="movingCloud cloud" src="../assets/images/cloud5.png" />
    <img id="Cloud4" class="movingCloud cloud" src="../assets/images/cloud2.png" />
    <img id="Cloud5" class="movingCloud cloud" src="../assets/images/cloud3.png" />
  </div>
</template>

<script>
import { onMounted, nextTick, ref, defineComponent, computed } from 'vue';

export default {
  name: 'about',
  props: ['sun'],
  methods: {
    logout() {
      if (this.$firebase.user()) {
        this.$firebase.logout();
      } else {
        this.$firebase.login();
      }
    },
  },
  setup() {
    const arrCatchphrase = [
      // { content: '너는 머뭇거릴 수 있지만,<br>시간은 그렇지 않다.', name: '벤자민 프랭클린' },
      // { content: '웃음이 없는 하루는<br>버린 하루다.', name: '찰리 채플린' },
      // { content: '나만이 내 인생을 바꿀 수 있다.<br>아무도 날 대신해 해줄 수 없다.', name: '캐럴 버넷' },
      // { content: '매일 행복하진 않지만,<br>행복한 일은 매일있어.', name: '곰돌이 푸' },
      { content: '내안에 빛이 있으면<br>스스로 빛나는 법이다.', name: '알버트 슈바이처' },
    ];
    const random = ref(Math.floor(Math.random() * arrCatchphrase.length));
    // onMounted(() => {
    //   setInterval(() => {
    //     for(;;) {
    //       const v = Math.floor(Math.random() * arrCatchphrase.length);
    //       if (v !== random.value) {
    //         random.value = v;
    //         break;
    //       }
    //     }
    //   }, 10000);
    // });
    const maxLength = computed(() => {
      return arrCatchphrase[random.value].content.replace(/ /g, '').replace(/<br>/g, '').length;
    });
    const getIndex = (xIndex, yIndex) => {
      const length =
        (arrCatchphrase[random.value].content.split('<br>')[xIndex - 1]?.length || 0) + yIndex;
      return (
        length -
        (arrCatchphrase[random.value].content.replaceAll('<br>', '').substring(0, length).split(' ')
          .length -
          1)
      );
    };
    const beforeIndex = ref(-1);
    const highlightIndex = ref(0);
    onMounted(() => {
      setInterval(() => {
        beforeIndex.value = highlightIndex.value;
        if (highlightIndex.value === maxLength.value - 1) {
          highlightIndex.value = 0;
        } else {
          highlightIndex.value += 1;
        }
      }, 500);
    });
    return {
      highlightIndex,
      beforeIndex,
      arrCatchphrase,
      random,
      height: window.innerHeight || window.outerHeight,
      getIndex,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.aboutWrapper {
  position: relative;
  width: 100%;
  z-index: 0;
  overflow: hidden;
  height: 100vh;
  &.day {
    background: lightskyblue; /* For browsers that do not support gradients */
    background: linear-gradient(cornflowerblue, #a7d2cb);
  }
  &.night {
    background: lightskyblue; /* For browsers that do not support gradients */
    background: linear-gradient(#041e33, #141f3e);
    .cloud {
      opacity: 0.3 !important;
    }
  }
}
.catchphrase {
  width: 100%;
  text-align: center;
  text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  color: #fff;
  position: absolute;
  z-index: 10;
  top: 30%;
  > div:first-of-type {
    font-weight: 700;
    font-size: 28px;
    line-height: 40px;
    white-space: nowrap;
    > span {
      transition: 0.8s ease;
      &.highlight {
        font-size: 32px;
        color: #ffff00;
      }
      &.before {
        color: #ffff00;
        font-size: 30px;
        opacity: 0.8;
      }
    }
  }
  > div:nth-of-type(2) {
    font-size: 16px;
    margin-top: 20px;
  }
}
#UpIcon {
  animation: moveShake 6s ease-in-out infinite;
  bottom: 20px;
  left: 10px;
  position: absolute;
  z-index: 4;
}
#UpIcon > img {
  height: 200px;
  animation: moveUp 5s ease-in-out infinite;
}
.movingCloud {
  position: absolute;
  z-index: 3;
}
#CloudBack {
  animation: cloudMainX 20s linear infinite;
}
#CloudBack > img {
  position: absolute;
  width: 80%;
  right: -80%;
  top: 40px;
  animation: cloudMainY 10s linear infinite;
  opacity: 0.9;
}
#Cloud1 {
  bottom: 40px;
  animation: cloud1 30s linear infinite;
  width: 410px;
  opacity: 0.8;
}
#Cloud2 {
  bottom: 80px;
  width: 300px;
  animation: cloud2 30s linear infinite;
  animation-delay: -8s;
}
#Cloud3 {
  width: 320px;
  bottom: 10px;
  animation: cloud3 30s linear infinite;
  animation-delay: -14s;
}
#Cloud4 {
  width: 310px;
  bottom: 90px;
  animation: cloud1 30s linear infinite;
  animation-delay: -20s;
}
#Cloud5 {
  width: 320px;
  bottom: 0;
  animation: cloud3 30s linear infinite;
  animation-delay: -24s;
}
@keyframes moveUp {
  from {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes moveShake {
  from {
    transform: rotate3d(0, 0, 1, 5deg);
  }
  25%,
  75% {
    transform: rotate3d(0, 0, 1, -15deg);
  }
  50% {
    transform: rotate3d(0, 0, 1, 5deg);
  }
  to {
    transform: rotate3d(0, 0, 1, 5deg);
  }
}
@keyframes cloudMainX {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 80vw));
  }
}
@keyframes cloudMainY {
  from {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-25px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(25px);
  }
  to {
    transform: translateY(0px);
  }
}
@keyframes cloud1 {
  from {
    right: -410px;
    margin-bottom: 25px;
  }
  to {
    right: 100%;
    margin-bottom: 25px;
  }
  50% {
    margin-bottom: 25px;
  }
  25%,
  75% {
    margin-bottom: -25px;
  }
}
@keyframes cloud2 {
  from {
    right: -300px;
    margin-bottom: 40px;
  }
  to {
    right: 100%;
    margin-bottom: 40px;
  }
  50% {
    margin-bottom: 40px;
  }
  25%,
  75% {
    margin-bottom: -40px;
  }
}
@keyframes cloud3 {
  from {
    right: -320px;
    margin-bottom: 20px;
  }
  to {
    right: 100%;
    margin-bottom: 20px;
  }
  50% {
    margin-bottom: 20px;
  }
  25%,
  75% {
    margin-bottom: -20px;
  }
}
@keyframes cloud4 {
  from {
    right: -310px;
    margin-bottom: 30px;
  }
  to {
    right: 100%;
    margin-bottom: 30px;
  }
  50% {
    margin-bottom: 30px;
  }
  25%,
  75% {
    margin-bottom: -30px;
  }
}
</style>
