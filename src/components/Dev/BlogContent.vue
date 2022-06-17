<template>
  <li class="blogContentList" @click="openEdit()">
    <div v-for="content in arrContent" :class="content.type === 'code' ? 'code' : ''">
      <template v-if="content.type !== 'code'">
        <div v-for="x in splitContent(content.content)">
          <template v-if="x.indexOf('##') === 0">{{ x.replace('##', '') }}</template>
          <div v-else v-html="replaceHTMLTag(x)"></div>
        </div>
      </template>
      <template v-else>
        <div v-for="x in splitContent(content.content)" :style="{ paddingLeft: x.match(/  /g) ? `${ x.match(/  /g).length * 10 }px` : '' }">
          {{ x || '&nbsp;' }}
        </div>
      </template>
    </div>
  </li>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['data']);
const emit = defineEmits(['imgPopupOpen', 'openEdit']);

const openEdit = () => {
  emit('openEdit', props.data.id);
};

const content = props.data.content.replace(/<div>&lt;code&gt;<\/div>/g, '<code>').replace(/<div>&lt;\/code&gt;<\/div>/g, '</code>');
const arrContent = [];
if (content.indexOf('<code>') >= 0 && content.indexOf('</code>') > content.indexOf('<code>')) {
  const arr = content.split('</code>');
  arr.forEach((v) => {
    if (v.indexOf('<code>') >= 0) {
      arrContent.push({
        type: 'text',
        content : v.split('<code>')[0],
      });
      arrContent.push({
        type: 'code',
        content : v.split('<code>')[1],
      });
    } else {
      arrContent.push({
        type: 'text',
        content: v,
      })
    }
  });
} else {
  arrContent.push({
    type: 'text',
    content,
  });
}

const replaceHTMLTag = (text) => {
  let html = text;
  text.match(/&lt;a.*&gt;.*&lt;\/a&gt;/g)?.forEach((v) => {
    let line = v;
    line = line.replace('&lt;', '<').replace('&gt;', '>').replace('&lt;/a&gt;', '</a>');
    html = html.replace(v, line);
  });
  return html || '&nbsp;';
};

const splitContent = (html) => {
  if (html.slice(-6) === '</div>') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return [...div.childNodes].map((v) => v.innerHTML || v.textContent);
  }
  return html.split('\n');
};
</script>

<style lang="scss">
.blogContentList{
  line-height: 24px;
  box-shadow: 0 0 10px 1px rgba(0,0,0,.1);
  border: 1px solid #d7d8d9;
  border-radius: 8px;
  margin: 0 10px 20px 10px;
  background-color: #FFF;
  padding: 30px 20px;
  word-break: break-all;
  .code{
    background-color: #3a3b3c;
    color: #FFF;
    font-size: 14px;
    padding: 12px;
    border-radius: 10px;
    white-space: nowrap;
    overflow: auto;
  }
  .imgCont{
    text-align: center;
  }
  img{
    max-width: 100%;
    margin: 10px 0;
    cursor: zoom-in;
  }
}
</style>
