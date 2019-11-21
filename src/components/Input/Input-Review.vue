<template>
  <div class="inputReview" @click="$emit('close-pop')">
    <div @click.stop>
      <div>
        <select ref="category">
          <option value="game">게임</option>
          <option value="movie">영화&드라마</option>
          <option value="book">책&음악</option>
          <option value="etc">etc</option>
        </select>
      </div>
      <div>
        <input class="textInput" ref="title" type="text" />
      </div>
      <div>
        <textarea ref="content"></textarea>
      </div>
      <div>
        <input @change="imgUpload" ref="url" type="file"/>
        <button @click="submit">올리기</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Firebase from 'firebase';
  import LoadImage from 'blueimp-load-image';

  export default {
    data() {
      return {
        arrImg: [],
      };
    },
    methods: {
      submit() {
        Firebase.database().ref('/review').push({
          category: this.$refs.category.value,
          title: this.$refs.title.value,
          content: this.$refs.content.value,
          imgUrl: this.arrImg,
        }).then(() => {
          alert('포스팅 성공!'); // eslint-disable-line
        });
      },
      imgUpload() {
        this.resizeImage(this.$refs.url.files[0]);
      },
      submitImage(file, resizedImage) {
        const name = `review/${file.name}`;
        const ref = Firebase.storage().ref().child(name);
        ref.put(resizedImage).then((snapshot) => {
          this.arrImg.push(snapshot.downloadURL);
          this.$refs.content.value += `#img${this.arrImg.length - 1}#\n`;
          this.$refs.url.value = '';
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
    },
  };
</script>

<style scoped>
  .inputReview{
    position: fixed;
    z-index: 6;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
  }
  .inputReview > div{
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
  .inputReview > div > div:not(:last-child){
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
