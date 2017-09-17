<template>
<div id="DevInfo">
  <div class="input">
    <button @click="authClick"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><span>Write</span></button>
  </div>
  <input-it v-if="isAuth"></input-it>
  <div class="devWrapper">
    <div>
      <div>
        <div>
          <span>IT<br>Information</span><br>
          <span>IT트랜드와 개발 이슈등을 저장하는 공간</span>
        </div>
      </div>
      <div>
        <div>
          <p>카테고리</p>
          <ul>
            <li>RECENT 20</li>
            <li>IT<span>({{categoryNum.it}})</span></li>
            <li>웹개발<span>({{categoryNum.dev}})</span></li>
            <li>하드웨어<span>({{categoryNum.hardware}})</span></li>
          </ul>
        </div>
      </div>
    </div>
    <ul><li v-for="list in list1">
      <div v-for="(content, index) in list"><span v-if="index%2===0">{{ content }}</span><img v-else v-bind:src="content" @click="imgPop(content)"></div></li></ul>
    <ul><li v-for="list in list2">
      <div v-for="(content, index) in list"><span v-if="index%2===0">{{ content }}</span><img v-else v-bind:src="content" @click="imgPop(content)"></div></li></ul>
  </div>
  <div v-if="popFlag" @click="popFlag=false;" class="imgPop">
    <div>
      <img v-bind:src="popImgSrc">
    </div>
  </div>
</div>
</template>

<script>
  import inputIt from '../components/input-IT';

  export default {
    name: 'devInfo',
    components: {
      inputIt,
    },
    data() {
      return {
        list1: [],
        list2: [],
        categoryNum: {
          it: 0,
          dev: 0,
          hardware: 0,
        },
        popFlag: false,
        popImgSrc: '',
        isAuth: false,
      };
    },
    methods: {
      authClick() {
        const firebase = this.$firebase;
        if (this.isAuth) {
          this.isAuth = false;
          return;
        }
        const user = firebase.auth().currentUser;
        if (user) {
          if (user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
            this.isAuth = true;
          } else {
            alert('나만 글쓸거야!!'); // eslint-disable-line
          }
        } else {
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider).then((result) => {
            if (result.user.uid === '6UbFoqLwRIdGulNFzs7VtkagKyC2') {
              this.isAuth = true;
            } else {
              alert('나만 글쓸거야!!'); // eslint-disable-line
              const newUser = result.user;
              let credential;
              newUser.reauthenticate(credential).then(() => {
              });
            }
          }).catch(() => {
            alert('글을 쓰려면 로그인이 필요합니다.'); // eslint-disable-line
          });
        }
      },
      imgPop(src) {
        this.popFlag = true;
        this.popImgSrc = src;
      },
    },
    mounted() {
      for (let x = 0; x < 5; x += 1) {
        this.list1.push([
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
          'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/devInfo%2F151117_LGCNS_1.png?alt=media&token=57ecf425-4273-4426-a7ba-402dcb0962b1',
          'Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.',
          'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/devInfo%2Fvuejs-logo.jpg?alt=media&token=cb3b61cf-43b6-4548-a19f-9a2887f889f7',
          'Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
          'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/devInfo%2Fwebstorm_1280x800.png?alt=media&token=d73ed538-8ea1-49a6-b371-d105a30747b2',
          'Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,',
        ]);
      }
      for (let x = 0; x < 5; x += 1) {
        this.list2.push([
          'Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
          'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/devInfo%2Fvuejs-logo.jpg?alt=media&token=cb3b61cf-43b6-4548-a19f-9a2887f889f7',
          'Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.',
          'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/devInfo%2Fwebstorm_1280x800.png?alt=media&token=d73ed538-8ea1-49a6-b371-d105a30747b2',
          'Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
          'https://firebasestorage.googleapis.com/v0/b/jammggul.appspot.com/o/devInfo%2F151117_LGCNS_1.png?alt=media&token=57ecf425-4273-4426-a7ba-402dcb0962b1',
          'Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,',
        ]);
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #DevInfo{
    max-width: 1080px;
    margin: 0 auto;
  }
  .input{
    padding: 10px;
    height: 55px;
  }
  .input > button{
    height: 35px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    padding: 0 20px;
    cursor: pointer;
    font-size: 14px;
    border: 0;
    color: #FFF;
    background-color: #c98474;
    left: 10px;
  }
  .input i{
    margin-right: 5px;
  }
  .devWrapper{
    width: 100%;
    position: relative;
    font-family: "Noto Sans KR", sans-serif;
  }
  .devWrapper, .devWrapper > div{
    overflow: auto;
    margin-top: 10px;
  }
  .devWrapper > ul, .devWrapper > div > div{
    float:left;
    width: 50%;
  }
  .devWrapper > ul > li, .devWrapper > div > div > div{
    margin: 0 10px 20px 10px;
    background-color: #FFF;
    padding: 30px;
    word-break: break-all;
  }
  .devWrapper > div > div > div{
    min-height: 300px;
  }
  .devWrapper > div > div:first-child > div{
    background-color: transparent;
    padding-left: 40px;
    padding-top: 70px;
  }
  .devWrapper > div > div > div > span:first-child{
    font-size: 60px;
    line-height: 50px;
    font-family: 'Baloo Bhaijaan', sans-serif;
    color: #f2d388;
  }
  .devWrapper > div > div > div > span:last-child{
    font-size: 20px;
    line-height: 40px;
  }
  .devWrapper > ul > li{
    line-height: 24px;
  }
  .devWrapper > ul > li img{
    width: 100%;
    margin: 10px 0;
    cursor: zoom-in;
  }
  .imgPop{
    z-index: 11;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    cursor: zoom-out;
  }
  .imgPop > div{
    width: 1080px;
    margin: 0 auto;
    text-align: center;
    height: 100%;
  }
  .imgPop > div > img{
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    max-width: 100%;
  }
  @media all and (max-width: 940px){
    .devWrapper > div > div > div > span:first-child{
      font-size: 60px;
      line-height: 50px;
      font-family: 'Baloo Bhaijaan', sans-serif;
      color: #f2d388;
    }
  }
  @media all and (max-width: 768px){
    .devWrapper > ul, .devWrapper > div > div{
      width: 100%;
      float: none;
    }
  }
</style>
