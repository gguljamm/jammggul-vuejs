<template>
  <div id="InputBox" class="inputBox">
    <div>
      <textarea id="TextArea"></textarea>
      <input id="ImgArea" type="file"> <button @click="submit"><i class="fa fa-upload" aria-hidden="true"></i> 올리기</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'input-box',
    methods: {
      submit() {
        const file = document.getElementById('ImgArea').files[0];
        if (file) {
          const param = {
            maxSize: 500,
            thisFile: file,
          };
          this.resizeImage(param);
        } else {
          this.upload('');
        }
      },
      submitImage(file, resizedImage) {
        const name = `daily/${file.name}`;
        const ref = this.$firebase.storage().ref().child(name);
        ref.put(resizedImage).then((snapshot) => {
          this.upload(snapshot.downloadURL);
        });
      },
      resizeImage(settings) {
        if (settings.thisFile.type === 'image/gif') {
          this.submitImage(settings.thisFile, settings.thisFile);
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
          const dataUrl = canvas.toDataURL('image/jpeg');
          this.submitImage(file, dataURItoBlob(dataUrl));
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
        const newDate = new Date();
        const text = document.getElementById('TextArea').value;
        let dateString = newDate.getFullYear();
        dateString += this.zeros(parseInt(newDate.getMonth(), 10) + 1);
        dateString += this.zeros(newDate.getDate());
        this.$firebase.database().ref('/daily').push({
          date: parseInt(dateString, 10),
          content: text,
          imgUrl: url,
        }).then(() => {
          alert('포스팅 성공!'); // eslint-disable-line
        });
      },
      zeros(n) {
        let zero = '';
        let newN = n;
        newN = n.toString();

        if (newN.length < 2) {
          for (let i = 0; i < 2 - newN.length; i += 1) {
            zero += '0';
          }
        }
        return zero + newN;
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>
