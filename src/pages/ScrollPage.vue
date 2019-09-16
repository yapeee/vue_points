<template>
  <div>
    <content-wrapper>
      <div class="block" v-for="item in 10" :key="item">{{item}}</div>
    </content-wrapper>
  </div>
</template>

<script>
  import ContentWrapper from '../components/ContentWrapper'
  export default {
    name: 'ScrollPage',
    components: {
      ContentWrapper
    }
  }
</script>

<style scoped>
  .block {
    height: 100px;
    background: #3a8ee6;
    margin: 20px;
  }
</style>
