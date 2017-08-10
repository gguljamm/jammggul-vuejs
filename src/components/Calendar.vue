<template>
<div class="calendar">
    <div id="calendar">
        <ol>
            <li v-for="date in dates" v-on:click="dateClick(date)">
               {{ date }}
            </li>
        </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calendar',
  data() {
    return {
      msg: '',
      dates: ['2017-09-09', '2017-09-12'],
    };
  },
  methods: {
    dateClick(date) {
      this.$emit('p-date-click', date);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}*/
#calendar{
  border: 1px solid #CCC;
  width: 300px;
  padding: 20px 0;
}
</style>
