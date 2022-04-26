<template>
  <div id="InputPortfolio" class="inputBox" @click="$emit('close-pop')">
    <div @click.stop>
      <button @click="$emit('close-pop')" class="close"><i class="fa fa-times"></i></button>
      <div>
        <div>
          <h3>타이틀</h3>
          <div><input v-model="title"></div>
        </div>
        <div>
          <h3>기술스택</h3>
          <div v-for="(x, index) in spec">
            <input v-model="x.name">
            <button v-if="index === spec.length - 1" @click="spec.push({ name: '' })"><i class="fa fa-plus"></i></button>
            <button v-else @click="spec.splice(index, 1)"><i class="fa fa-times"></i></button>
          </div>
        </div>
        <div>
          <h3>날짜<span>[ YYYY-MM ~ YYYY-MM ]</span></h3>
          <div><input v-model="date"></div>
        </div>
        <div>
          <h3>기여</h3>
          <div class="box" v-for="x in contribute">
            <div>영역</div>
            <div><input v-model="x.name"></div>
            <div>기여도</div>
            <div><input v-model="x.percent" type="number"></div>
          </div>
          <button @click="contribute.push({ name: '', percent: 0 })"><i class="fa fa-plus"></i></button>
        </div>
        <div>
          <h3>동작</h3>
          <div class="box" v-for="x in operate">
            <div>버튼명</div><div><input v-model="x.name"></div>
            <div>URL</div><div><input v-model="x.url"></div>
          </div>
          <button @click="operate.push({ name: '', url: '' })"><i class="fa fa-plus"></i></button>
        </div>
        <div>
          <h3>썸네일</h3>
          <div><input ref="thumbnail" type="file" title="thumbnail"></div>
        </div>
      </div>
      <button class="submit" @click="submit">UPLOAD</button>
    </div>
  </div>
</template>

<script>
import LoadImage from 'blueimp-load-image';

export default {
  name: 'input-it',
  data() {
    return {
      title: '',
      spec: [{ name: '' }],
      date: '',
      contribute: [
        {
          name: '',
          percent: 0,
        },
      ],
      operate: [
        {
          name: '',
          url: '',
        },
      ],
      arrImgUrl: '',
    };
  },
  props: ['isMobile'],
  methods: {
    submit() {
      const file = this.$refs.thumbnail.files;
      if (file && file.length > 0) {
        this.resizeImage(file[0]);
      } else {
        this.upload(false);
      }
    },
    submitImage(file, resizedImage) {
      const name = `travel/${file.name}`;
      this.$firebase.storage(name).put(resizedImage).then(async () => {
        const downloadUrl = await this.$firebase.storage(name).getDownloadURL();
        this.arrImgUrl = downloadUrl;
        this.upload(true);
      });
    },
    resizeImage(file) {
      if (file.type === 'image/gif') {
        this.submitImage(file, file);
        return false;
      }
      const reader = new FileReader();
      const image = new Image();
      const dataURItoBlob = (dataURI) => {
        const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
          atob(dataURI.split(',')[1]) :
          unescape(dataURI.split(',')[1]);
        const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const max = bytes.length;
        const ia = new Uint8Array(max);
        for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
      };
      const resize = () => {
        LoadImage.parseMetaData(file, (data) => {
          let orientation = 0;
          if (data.exif) {
            orientation = data.exif.get('Orientation');
          }
          LoadImage(file, (canvas) => {
            const dataUrl = canvas.toDataURL(file.type);
            this.submitImage(file, dataURItoBlob(dataUrl));
          }, { canvas: true, orientation, maxWidth: 1280, maxHeight: 720 });
        });
      };

      return new Promise((ok) => {
        if (!file.type.match(/image.*/)) {
          alert('no image file!'); // eslint-disable-line
          return;
        }

        reader.onload = (readerEvent) => {
          image.onload = () => ok(resize());
          image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    upload(url) {
      this.$firebase.database('/portfolio').push({
        title: this.title,
        spec: this.spec.map(v => v.name).filter(v => v),
        date: this.date,
        contribute: this.contribute.filter(v => v.name),
        operate: this.operate.filter(v => v.url && v.name),
        thumbnail: url ? this.arrImgUrl : '',
      }).then(() => {
        alert('포스팅 성공!'); // eslint-disable-line
        this.$emit('reload');
      });
    },
  },
};
</script>

<style scoped lang="scss">
#InputPortfolio{
  position: fixed;
  z-index: 6;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.5);
  padding: 20px;
  h3{
    margin: 0;
    padding: 10px 0;
    > span{
      font-weight: normal;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .box{
    border: 1px solid #e1e3e5;
    padding: 10px;
    border-radius: 4px;
  }
  > div{
    max-width: 1080px;
    padding: 0;
    height: 100%;
    top: 50%;
    transform: translateY(-50%);
    position: relative;
    margin: 0 auto;
    background-color: #FFF;
    border-radius: 8px;
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, .1);
    > div{
      padding: 20px 20px 64px;
      max-height: 100%;
      overflow-y: auto;
    }
    .close{
      position: absolute;
      top: 4px;
      right: 4px;
      width: 24px;
      height: 24px;
      background: transparent;
      padding: 0;
      border: 0;
      font-size: 24px;
    }
  }
  .submit{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 44px;
    border: 0;
    background-color: #c98474;
    color: #FFF;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>
