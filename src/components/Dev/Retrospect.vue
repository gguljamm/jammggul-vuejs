<template>
  <div class="devRetrospect">
    <div>개발 회고..</div>

    <div>
      <child v-for="x in length"></child>
      <button @click="length += 1"></button>
    </div>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>

<style lang="scss">
.devRetrospect{
  padding: 20px;
  max-width: 1080px;
  margin: 0 auto;
}
</style>
