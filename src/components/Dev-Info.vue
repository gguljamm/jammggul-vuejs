<template>
<div id="DevInfo">
  <div class="devWrapper">
    <div>
      <div>
        <div>
          <span>Development<br>Information</span><br>
          <span>나만을 위한 개발팁과 노하우를 저장하는 공간</span>
        </div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
    <ul><li v-for="list in list1">
      <div v-for="(content, index) in list"><span v-if="index%2===0">{{ content }}</span><img v-else v-bind:src="content"></div></li></ul>
    <ul><li v-for="list in list2">
      <div v-for="(content, index) in list"><span v-if="index%2===0">{{ content }}</span><img v-else v-bind:src="content"></div></li></ul>

  </div>
</div>
</template>

<script>
  export default {
    name: 'devInfo',
//  methods: {
//    dateClick() {
//      this.$emit('p-input-click');
//    },
//  },
    data() {
      return {
        list1: [],
        list2: [],
      };
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
  .devWrapper{
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    font-family: "Noto Sans KR", sans-serif;
  }
  .devWrapper, .devWrapper > div{
    overflow: auto;
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
