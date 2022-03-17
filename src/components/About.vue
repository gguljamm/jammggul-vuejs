<template>
<div id="About">
  <div class="catchphrase">Dazzling Day, Sunny Day</div>
  <div id="CloudBack">
    <img src="../assets/images/cloud2.png">
  </div>
  <img id="UpIcon" src="../assets/images/up.png" @click="logout()">
  <img id="Cloud1" class="movingCloud" src="../assets/images/cloud1.png">
  <img id="Cloud2" class="movingCloud" src="../assets/images/cloud3.png">
  <img id="Cloud3" class="movingCloud" src="../assets/images/cloud1.png">
  <img id="Cloud4" class="movingCloud" src="../assets/images/cloud2.png">
  <img id="Cloud5" class="movingCloud" src="../assets/images/cloud3.png">
</div>
</template>

<script>
  export default {
    name: 'about',
    methods: {
      logout() {
        this.$firebase.logout();
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #About{
    position: relative;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 0;
    background: lightskyblue; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(cornflowerblue, #a7d2cb); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(cornflowerblue, #a7d2cb); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(cornflowerblue, #a7d2cb); /* For Firefox 3.6 to 15 */
    background: linear-gradient(cornflowerblue, #a7d2cb); /* Standard syntax */
    overflow: hidden;
  }
  .catchphrase{
    width: 100%;
    text-align: center;
    text-shadow: 1px 1px 1px rgba(0,0,0,.8);
    font-weight: 800;
    font-family: 'Open Sans';
    font-size: 48px;
    color: #FFF;
    position: absolute;
    z-index: 10;
    line-height: 50px;
    height: 50px;
    top: 30%;
  }
  #UpIcon{
    position: absolute;
    width: 100px;
    height: 120px;
    bottom: 50px;
    left: 50px;
    animation: moveUp 5s ease-in-out infinite;
    z-index: 4;
  }
  .movingCloud{
    position: absolute;
    z-index:3;
  }
  #CloudBack{
    animation: cloudMainX 20s linear infinite;
  }
  #CloudBack > img{
    position: absolute;
    width: 80%;
    right: -80%;
    top: 20px;
    animation: cloudMainY 10s linear infinite;
  }
  #Cloud1{
    bottom: 40px;
    animation: cloud1 30s linear infinite;
    width: 410px;
  }
  #Cloud2{
    bottom: 80px;
    width: 300px;
    animation: cloud2 30s linear infinite;
    animation-delay: -8s;
  }
  #Cloud3{
    width: 320px;
    bottom: 10px;
    animation: cloud3 30s linear infinite;
    animation-delay: -14s;
  }
  #Cloud4{
    width: 310px;
    bottom: 90px;
    animation: cloud1 30s linear infinite;
    animation-delay: -20s;
  }
  #Cloud5{
    width: 320px;
    bottom: 0;
    animation: cloud3 30s linear infinite;
    animation-delay: -24s;
  }
  @-webkit-keyframes moveUp {
    from {
      -webkit-transform: rotate3d(0, 0, 1, 5deg);
      transform: rotate3d(0, 0, 1, 5deg);
      margin-bottom: 0;
    }
    25%, 75%{
      -webkit-transform: rotate3d(0, 0, 1, -20deg);
      transform: rotate3d(0, 0, 1, -15deg);
    }
    50% {
      -webkit-transform: rotate3d(0, 0, 1, 5deg);
      transform: rotate3d(0, 0, 1, 5deg);
      margin-bottom: 50px;
    }
    to {
      -webkit-transform: rotate3d(0, 0, 1, 5deg);
      transform: rotate3d(0, 0, 1, 5deg);
      margin-bottom: 0;
    }
  }
  @keyframes moveUp {
    from {
      -webkit-transform: rotate3d(0, 0, 1, 5deg);
      transform: rotate3d(0, 0, 1, 5deg);
      margin-bottom: 0;
    }
    25%, 75%{
      -webkit-transform: rotate3d(0, 0, 1, -20deg);
      transform: rotate3d(0, 0, 1, -15deg);
    }
    50% {
      -webkit-transform: rotate3d(0, 0, 1, 5deg);
      transform: rotate3d(0, 0, 1, 5deg);
      margin-bottom: 50px;
    }
    to {
      -webkit-transform: rotate3d(0, 0, 1, 5deg);
      transform: rotate3d(0, 0, 1, 5deg);
      margin-bottom: 0;
    }
  }
  @keyframes cloudMainX {
    from{
      transform: translateX(0);
    }
    To{
      transform: translateX(calc(-100% - 100vw));
    }
  }
  @keyframes cloudMainY {
    from{
      transform: translateY(0);
    }
    25%{
      transform: translateY(-25px);
    }
    50%{
      transform: translateY(0px);
    }
    75%{
      transform: translateY(25px);
    }
    to{
      transform: translateY(0px);
    }
  }
  @keyframes cloud1{
    from{
      right: -410px;
      margin-bottom: 25px;
    }
    to{
      right: 100%;
      margin-bottom: 25px;
    }
    50%{
      margin-bottom: 25px;
    }
    25%, 75%{
      margin-bottom: -25px;
    }
  }
  @keyframes cloud2 {
    from{
      right: -300px;
      margin-bottom: 40px;
    }
    to{
      right: 100%;
      margin-bottom: 40px;
    }
    50%{
      margin-bottom: 40px;
    }
    25%, 75%{
      margin-bottom: -40px;
    }
  }
  @keyframes cloud3 {
    from{
      right: -320px;
      margin-bottom: 20px;
    }
    to{
      right: 100%;
      margin-bottom: 20px;
    }
    50%{
      margin-bottom: 20px;
    }
    25%, 75%{
      margin-bottom: -20px;
    }
  }
  @keyframes cloud4 {
    from{
      right: -310px;
      margin-bottom: 30px;
    }
    to{
      right: 100%;
      margin-bottom: 30px;
    }
    50%{
      margin-bottom: 30px;
    }
    25%, 75%{
      margin-bottom: -30px;
    }
  }
  @-webkit-keyframes cloud1{
    from{
      right: -410px;
      margin-bottom: 25px;
    }
    to{
      right: 100%;
      margin-bottom: 25px;
    }
    50%{
      margin-bottom: 25px;
    }
    25%, 75%{
      margin-bottom: -25px;
    }
  }
  @-webkit-keyframes cloud2 {
    from{
      right: -300px;
      margin-bottom: 40px;
    }
    to{
      right: 100%;
      margin-bottom: 40px;
    }
    50%{
      margin-bottom: 40px;
    }
    25%, 75%{
      margin-bottom: -40px;
    }
  }
  @-webkit-keyframes cloud3 {
    from{
      right: -320px;
      margin-bottom: 20px;
    }
    to{
      right: 100%;
      margin-bottom: 20px;
    }
    50%{
      margin-bottom: 20px;
    }
    25%, 75%{
      margin-bottom: -20px;
    }
  }
  @-webkit-keyframes cloud4 {
    from{
      right: -310px;
      margin-bottom: 30px;
    }
    to{
      right: 100%;
      margin-bottom: 30px;
    }
    50%{
      margin-bottom: 30px;
    }
    25%, 75%{
      margin-bottom: -30px;
    }
  }
</style>
