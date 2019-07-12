<template>
  <div class="page">
    <!--<date-select @getDate="getDaySchedule"></date-select>-->
    <van-tabs v-model="active">
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
    </van-tabs>
    <div style="padding: 50px 20px">父组件接收值：{{data.dateStr1}}</div>
  </div>
</template>

<script>
// import DateSelect from '../components/DateSelect'
import { Tab, Tabs } from 'vant'
export default {
  name: 'DateInfo',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs
    // DateSelect
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
  .content {
    background: #fff;
    padding: 10px;
  }
</style>
