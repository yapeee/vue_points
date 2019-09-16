<template>
  <div class="page">
    <div class="block" v-for="item in 8" :key="item">{{item}}</div>
  </div>
</template>

<script>
  export default {
    name: 'StickyPage',
    components: {
    },
    props: {
    },
    data () {
      return {
        active: 0,
        data: {}
      }
    },
    created: function () {
    },
    methods: {
      getDaySchedule (item) {
        this.data = item
      }
    }
  }
</script>
<style>

</style>
<style lang="scss" scoped>
  .block {
    height: 100px;
    background: #3a8ee6;
    margin: 20px;
    position: sticky;
    top: 0;
  }
</style>
