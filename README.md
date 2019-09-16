#### 1.echarts较为复杂的数据展示
**简介**
图表最近几日收入统计柱状图，其中包括两种收入方式，默认显示两种方式的总计，可选择一种方式进行切换。每日的收入包括多种收入，可以选择其中一种收入查看最近几日该收入的柱状图。

**亮点**
通过选择框控制显示想要显示多种legend中的一个。

**位置**
`pages/dataAnalyse.vue`

#### 2.日期选择器
**简介**
tab栏+日历模式展示一段范围内日期（及日期标记）。若想要展示n（n>7）天日期，则页面为tab栏+日历模式；如果展示n（n<=7）天日期，则页面只显示tab栏。

**亮点**
teb栏+日历模式选择日期
自定义日期样式

**位置**
`pages/DateInfo.vue`
`components/DateSelect.vue`(使用vux日历组件)
`components/DateSelectNew.vue`(自定义日历组件)

#### 3.select-tree-demo
**简介**
根据element提供的组件构建一个下拉选择树结构的下拉框。

**亮点**
可配置单选多选
可配置懒加载
提供自定节点插槽
可配置树结构的父子节点是否关联

**位置**
`pages/Home.vue`
`components/SelectTree.vue`
