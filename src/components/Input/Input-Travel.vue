<template>
  <div id="InputBox" class="inputBox">
    <div>
      <div>여행지 <input ref="country" title="country"></div>
      <div>도시 리스트 <input ref="tags" title="tags" type="text" ></div>
      <div>여행일자 <input ref="dates" title="dates" type="text"></div>
      <div>설명 <textarea ref="description" title="description"></textarea></div>
      <div>썸네일 <input ref="thumbnail" type="file" title="thumbnail"></div>
    </div>
    <button @click="submit">올리기</button>
  </div>
</template>

<script>
  import Firebase from 'firebase';
  import LoadImage from 'blueimp-load-image';

  export default {
    name: 'input-it',
    data() {
      return {
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
        const ref = Firebase.storage().ref().child(name);
        ref.put(resizedImage).then((snapshot) => {
          this.arrImgUrl = snapshot.downloadURL;
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
        Firebase.database().ref('/travel').push({
          country: this.$refs.country.value,
          tags: this.$refs.tags.value,
          dates: this.$refs.dates.value,
          description: this.$refs.description.value,
          thumbnail: url ? this.arrImgUrl : '',
        }).then(() => {
          alert('포스팅 성공!'); // eslint-disable-line
        });
      },
    },
  };
</script>

<style scoped>
  .inputBox{
    text-align: left;
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
    margin-top: 10px;
    cursor: pointer;
  }
  .inputBox > div > div{
    border: 1px solid #c98474;
    border-bottom: 0;
    padding: 10px;
    background-color: #FFF;
  }
  .inputBox > div > div:last-child{
    border-bottom: 1px solid #c98474;
  }
  .inputBox textarea{
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    resize: none;
    border: 1px solid #ccc;
  }
  .inputBox input{
    border: 1px solid #ccc;
  }
  #Category{
    height: 24px;
    margin: 0 0 5px 5px;
  }
  .desc{
    font-size: 14px;
  }
</style>
