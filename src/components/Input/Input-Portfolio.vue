<template>
  <div id="InputPortfolio" class="inputBox" @click="$emit('close-pop')">
    <div @click.stop>
      <div>
        <div>타이틀 <input v-model="title"></div>
        <div>
          기술스택
          <span v-for="x in spec">
            <input v-model="x.name">
          </span>
          <button @click="spec.push({ name: '' })"><i class="fa fa-plus"></i></button>
        </div>
        <div>날짜 <input v-model="date"></div>
        <div>
          기여<br>
          <div v-for="x in contribute">
            영역 <input v-model="x.name">
            기여도 <input v-model="x.percent" type="number">
          </div>
          <button @click="contribute.push({ name: '', percent: 0 })"><i class="fa fa-plus"></i></button>
        </div>
        <div>
          동작<br>
          <div v-for="x in operate">
            버튼명 <input v-model="x.name">
            URL <input v-model="x.url">
          </div>
          <button @click="operate.push({ name: '', url: '' })"><i class="fa fa-plus"></i></button>
        </div>
        <div>썸네일 <input ref="thumbnail" type="file" title="thumbnail"></div>
      </div>
      <button @click="submit">올리기</button>
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

<style scoped>
#InputPortfolio{
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.5);
}
#InputPortfolio > div{
  max-width: 1080px;
  padding: 30px;
  max-height: 100%;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  position: relative;
  margin: 0 auto;
  overflow-y: auto;
  background-color: #FFF;
}
#InputPortfolio > div > div:not(:last-child){
  margin-bottom: 10px;
}
textarea{
  border: 1px solid #ddd;
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
  resize: none;
}
.textInput{
  border: 1px solid #ddd;
  width: 100%;
  height: 30px;
  line-height: 28px;
}
</style>
