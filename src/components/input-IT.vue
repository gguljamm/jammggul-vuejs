<template>
  <div id="InputBox" class="inputBox">
    <div>
      <span class="desc">( 이미지 공간 #img# )</span>
      <select id="Category" title="category">
        <option value="it">IT</option>
        <option value="dev">dev</option>
        <option value="hardware">hardware</option>
      </select>
      <textarea title="textArea" id="TextArea"></textarea>
      <input id="ImgArea" type="file" v-bind:multiple="!isMobile"> <button @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> 올리기</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'input-it',
    data() {
      return {
        arrImgUrl: [],
      };
    },
    props: ['isMobile'],
    methods: {
      submit() {
        const file = document.getElementById('ImgArea').files;
        if (file && file.length > 0) {
          for (let x = 0; x < file.length; x += 1) {
            this.arrImgUrl.push(null);
            const param = {
              maxSize: 1080,
              thisFile: file[x],
            };
            this.resizeImage(param, x);
          }
        } else {
          this.upload(false);
        }
      },
      submitImage(file, resizedImage, index) {
        const name = `it-info/${file.name}`;
        const ref = this.$firebase.storage().ref().child(name);
        ref.put(resizedImage).then((snapshot) => {
          this.arrImgUrl[index] = snapshot.downloadURL;
          let flag = true;
          for (let x = 0; x < this.arrImgUrl.length; x += 1) {
            if (!this.arrImgUrl[x]) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.upload(true);
          }
        });
      },
      resizeImage(settings, index) {
        if (settings.thisFile.type === 'image/gif') {
          this.submitImage(settings.thisFile, settings.thisFile, index);
          return false;
        }
        const file = settings.thisFile;
        const maxSize = settings.maxSize;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');
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
          let width = image.width;
          let height = image.height;

          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(settings.thisFile.type);
          this.submitImage(file, dataURItoBlob(dataUrl), index);
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
        const text = document.getElementById('TextArea').value;
        const thisCategory = document.getElementById('Category').value;
        this.$firebase.database().ref('/it-info').push({
          category: thisCategory,
          content: text,
          imgUrl: url ? this.arrImgUrl : '',
        }).then(() => {
          alert('포스팅 성공!'); // eslint-disable-line
        });
      },
    },
  };
</script>

<style scoped>
  .inputBox{
    text-align: right;
    padding-bottom: 20px;
  }
  .inputBox button{
    width: 100px;
    height: 30px;
    border: 0;
    color: #FFF;
    background-color: #c98474;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .inputBox > div{
    border: 1px solid #c98474;
    padding: 10px;
    -webkit-box-shadow: 1px 1px 1px 1px rgba(0,0,0,.3);
    -moz-box-shadow: 1px 1px 1px 1px rgba(0,0,0,.3);
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,.3);
    background-color: #FFF;
  }
  .inputBox textarea{
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    resize: none;
  }
  #Category{
    height: 24px;
    margin: 0 0 5px 5px;
  }
  .desc{
    font-size: 14px;
  }
</style>
