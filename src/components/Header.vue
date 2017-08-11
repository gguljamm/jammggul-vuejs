<template>
  <div id="GNB">
    <img @click="logoClick" src="../assets/images/logo_org.png" >
  </div>
</template>

<script>
  export default {
    name: 'header',
    methods: {
      logoClick() {
        this.$emit('transLogoClick');
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #GNB {
    width: 100%;
    height: 80px;
    text-align: center;
  }
  #GNB > img {
    margin: 5px;
    height: 70px;
    cursor: pointer;
  }
</style>
