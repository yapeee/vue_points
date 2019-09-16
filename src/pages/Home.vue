<template>
  <div class="home">
    <select-tree :data="data"
                 :multiple="true"
                 :lazy="false"
                 :check-strictly="false"
                 @getValue="getSelectValue"
    >
      <span slot="tree-node" slot-scope="props">
        <span>--- {{ props.node.label }} ---</span>
      </span>
    </select-tree>
  </div>
</template>

<script>
// @ is an alias to /src
import SelectTree from '@/components/SelectTree.vue'

export default {
  name: 'home',
  components: {
    SelectTree
  },
  data() {
    return {
      data: [{
        value: '1',
        label: '一级 1',
        children: [{
          value: '1-1',
          label: '二级 1-1'
        }]
      }, {
        value: '2',
        label: '一级 2',
        children: [{
          value: '2-1',
          label: '二级 2-1'
        }, {
          value: '2-2',
          label: '二级 2-2'
        }]
      }, {
        value: '3',
        label: '一级 3',
        children: [{
          value: '3-1',
          label: '二级 3-1'
        }, {
          value: '3-2',
          label: '二级 3-2'
        }]
      }],
      multiple: true, // 多选 or 单选
      lazy: true // 按需加载
    }
  },
  methods: {
    getSelectValue(value) {
      console.log(value)
    }
  }
}
</script>
<style scoped>
</style>
