<template>
    <div class="select-tree">
        <el-select v-model="value1"
                   :multiple="multiple"
                   placeholder="请选择"
                   @remove-tag="handleRemoveTag"
        >
            <el-option :value="valueArr">
                <el-tree :data="data"
                         node-key="value"
                         ref="tree"
                         show-checkbox
                         highlight-current
                         :props="defaultProps"
                         :lazy="lazy"
                         :load="loadNode"
                         :check-strictly="checkStrictly"
                         @check-change="handleCheckChange"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <slot name="tree-node" :node="node" :data="data"></slot>
                    </span>
                </el-tree>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'SelectTree',
        props: {
            data: { // 选项列表数据(树形结构的对象数组)
                type: Array,
                default: []
            },
            multiple: { // 多选 or 单选
                type: Boolean,
                default: false
            },
            lazy: { // 是否按需加载
                type: Boolean,
                default: false
            },
            checkStrictly: { // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                value1: '',
                valueArr: [],
                count: 1
            }
        },
        watch: {
            value1(){
                this.$emit('getValue', this.value1)
            }
        },
        methods: {
            // tree选中节点发生变化
            handleCheckChange(data, checked, node) {
                // 若父节点未选中，子节点选中，则不执行
                if(!checked && node){
                    return
                }
                // 判断是否为多选
                if (!this.multiple) { // 单选
                    if (checked == true) {
                        this.$refs.tree.setCheckedNodes([data]);
                    }
                }
                let res = this.$refs.tree.getCheckedNodes();
                let arrLabel = [];
                let arr = [];
                res.forEach(item => {
                    arrLabel.push(item.label);
                    arr[item.label] = item;
                });
                this.valueArr = arr;
                this.value1 = this.multiple ? arrLabel : arrLabel.toString();
            },
            // 多选模式 tag移除
            handleRemoveTag(value) {
                let item = this.valueArr[value]
                this.$refs.tree.setChecked(item.value, false, true) // 节点，是否选中，是否设置子节点
            },
            // 按需加载
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{ value: 'region1', label: 'region1' }, { value: 'region2', label: 'region2' }]);
                }
                if (node.level > 3) return resolve([]);

                var hasChild;
                if (node.data.value === 'region1') {
                    hasChild = true;
                } else if (node.data.value === 'region2') {
                    hasChild = false;
                } else {
                    hasChild = Math.random() > 0.5;
                }

                setTimeout(() => {
                    var data;
                    if (hasChild) {
                        data = [{
                            value: 'zone' + this.count++,
                            label: 'zone' + this.count++
                        }, {
                            value: 'zone' + this.count++,
                            label: 'zone' + this.count++
                        }];
                    } else {
                        data = [];
                    }

                    resolve(data);
                }, 500);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .select-tree .el-select {
        width: 400px;
    }
    .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
        height: auto;
        max-height: 300px;
        padding: 0;
        overflow: hidden;
        overflow-y: auto;
    }
</style>
