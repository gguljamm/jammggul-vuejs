<template>
  <div id="GNB">
    <img
      @click="logoClick"
      src="../assets/images/jamm-resize.png" alt="jammggul" >
  </div>
</template>

<script>
  export default {
    name: 'header',
    methods: {
      logoClick() {
        this.$emit('transReload');
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #GNB {
    width: 100%;
    height: 70px;
    text-align: center;
    text-shadow: 1px 1px 1px #000;
    z-index: 1;
    position: relative;
  }
  #GNB > img {
    margin: 5px;
    height: 60px;
    padding: 5px;
    cursor: pointer;
    background-color: #FFF;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.15);
    -moz-box-shadow: 1px 1px 1px rgba(0,0,0,.15);
    box-shadow: 1px 1px 1px rgba(0,0,0,.15);
  }
</style>
