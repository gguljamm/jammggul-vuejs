<template>
  <div class="hello">
    <h1 id="catchphrase"></h1>
    <input-box
      @p-input-click="hi"
      :date="date"
    ></input-box>
    <calendar
      @p-date-click="inputClick"
    v-if="isShowCalendar"></calendar>
  </div>
</template>

<script>
import InputBox from './InputBox';
import Calendar from './Calendar';

export default {
  name: 'hello',
  data() {
    return {
      msg: '',
      date: '2017-05-06',
      isShowCalendar: false,
    };
  },
  methods: {
    hi() {
      this.isShowCalendar = !this.isShowCalendar;
    },
    inputClick(a) {
      this.date = a;
      this.isShowCalendar = false;
    },
  },
  components: {
    InputBox,
    Calendar,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}*/
#catchphrase > span{
  color: red;
  font-size: 36px;
}
</style>
