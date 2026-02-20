<template>
  <div id="Lotto">
    <div v-for="(x, index) in numbers" :key="index">
      <span>{{ index + 1 }}회차</span>
      <div class="numbers">
        <span
          v-for="(num, numIndex) in x"
          :key="numIndex"
          :style="{ backgroundColor: getColor(num) }"
          >{{ num }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const numbers = ref([]);

const colors = ['#f4cf77', '#6aa7e8', '#ff7666', '#5a5e62', '#98e187'];

const getColor = (num) => {
  if (num <= 10) return colors[0];
  if (num <= 20) return colors[1];
  if (num <= 30) return colors[2];
  if (num <= 40) return colors[3];
  return colors[4];
};

const generateNumbers = () => {
  const n = prompt('게임수');

  const getLottoNumber = (i) => {
    function getSingleNumber() {
      if (!numbers.value[i]) {
        numbers.value[i] = [];
      }
      const b = parseInt(Math.random() * 45 + 1);
      if (numbers.value[i].indexOf(b) < 0) {
        numbers.value[i].push(b);
      }
      numbers.value[i] = numbers.value[i].sort(function (a, b) {
        return a - b;
      });
      if (numbers.value[i].length < 6) {
        setTimeout(getSingleNumber, parseInt(Math.random() * 777));
      }
    }
    setTimeout(getSingleNumber, Math.random() * 777);
  };
  for (let i = 0; i < n; i++) {
    getLottoNumber(i);
  }
};

generateNumbers();
</script>

<style scoped lang="scss">
#Lotto {
  text-align: center;
  font-size: 20px;
  padding: 40px;
  & > div {
    margin: 0 auto 24px;
  }
  .numbers {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    gap: 4px;

    & > span {
      display: flex;
      width: 38px;
      height: 38px;
      border-radius: 19px;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
}
</style>
