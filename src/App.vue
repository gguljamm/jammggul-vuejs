<template>
  <div id="app">
    <div id="GNB">
      <img v-on:click="logoClick" src="/static/images/logo_org.png" >
    </div>
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello';

export default {
  name: 'app',
  components: {
    Hello,
  },
  methods: {
    logoClick() {
      location.reload();
    },
  },
};
</script>

<style>

html, body{
  width: 100%;
  height: 100%;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: rgb(249,249,239);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#GNB {
  width: 100%;
  height: 50px;
  text-align: left;
}
#GNB > img {
  margin: 5px;
  height: 40px;
  cursor: pointer;
}
</style>
