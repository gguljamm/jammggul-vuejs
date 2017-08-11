<template>
<div class="inputBox">
    <div v-on:click="dateClick">{{date}}</div>
</div>
</template>

<script>
export default {
  name: 'inputBox',
  props: ['date'],
  methods: {
    dateClick() {
      this.$emit('p-input-click');
    },
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
.inputBox > div{
  border: 1px solid #CCC;
  width: 300px;
  height: 50px;
}
</style>
