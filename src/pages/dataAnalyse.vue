<template>
  <div class="viewChartBox">
    <span class="viewChartControlBar">
      <el-select v-model="plateform1" placeholder="请选择" size="mini" @change="changeType1()">
        <el-option label="全部" value="0"></el-option>
        <el-option label="方式1" value="1"></el-option>
        <el-option label="方式2" value="2"></el-option>
      </el-select>
      <el-select v-model="legendSelect1" placeholder="请选择" size="mini"  @change="changeSelect1()">
        <el-option label="全部" value="0"></el-option>
        <el-option v-for="item in type1" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </span>
    <div id="chart" v-loading="loading" style="height: 300px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'data-analyse',
  data () {
    return {
      option: {},
      seriesData1: {},
      plateform1: '0',
      legendSelect1: '0',
      type1: {},
      loading: false
    }
  },
  created () {
    this.option = this.getOption()
    this.getList2()
  },
  mounted () {
    this.myChart = echarts.init(document.getElementById('chart'))
  },
  methods: {
    getOption () {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [],
          selected: {},
          width: '55%',
          left: '20%'
        },
        grid: {
          left: 80,
          right: 30,
          bottom: 30,
          top: 80
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        backgroundColor: '#F2F3F6',
        yAxis: [
          {
            type: 'value'
          }
        ],
        color: ['#4BD083', '#EFC937', '#F079AB', '#5BABEE', '#95AAFF', '#43D4A9', '#A4D93E', '#71C27C', '#957AD6', '#A7E5A2', '#959FBC'],
        series: [
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          },
          {
            name: '',
            type: 'bar',
            stack: '总量',
            data: [],
            barMaxWidth: '10px'
          }
        ]
      }
      return option
    },
    async getList2 () {
      // 初始化
      this.type1 = {}
      this.option.legend.data = []
      for (let item of this.option.series) {
        item.data = []
        item.name = ''
      }

      // this.loading = true
      axios.get('static/resources/echartsData.json').then((response) => {
        let res = response.data
        if (res.success) {
          let list = res.data
          let xAxisData = []
          let seriesData = {
            ALIPAY: {},
            WECHAT: {},
            ALL: {}
          }
          let ii = 0
          for (let i in list) {
            xAxisData.push(i)
            for (let plateform of list[i]) { // 分类, alipay wx
              for (let item of plateform.detailTradeSourceReportList) { // 分渠道
                if (!seriesData[plateform.tradePlatform].hasOwnProperty(item.tradeSourceCode)) { // 判断是否有该渠道
                  seriesData[plateform.tradePlatform][item.tradeSourceCode] = [] // 1004、 1009、 1002
                  seriesData['ALL'][item.tradeSourceCode] = [] // 增加渠道
                  this.type1[item.tradeSourceCode] = item.tradeSourceName // 几种类型
                }
                seriesData[plateform.tradePlatform][item.tradeSourceCode].push(item.incomeFee) // fee list
              }
            }
            // 汇总
            for (let k in seriesData['ALL']) {
              let fee1 = 0
              let fee2 = 0
              if (seriesData['ALIPAY'][k]) {
                fee1 = Number(seriesData['ALIPAY'][k][ii])
              }
              if (seriesData['WECHAT'][k]) {
                fee2 = Number(seriesData['WECHAT'][k][ii])
              }
              let fee = (fee1 + fee2).toFixed(2) // 保留两位
              seriesData['ALL'][k].push(fee)
            }
            ii++
          }
          this.option.xAxis[0].data = xAxisData
          this.option.legend.data = [] // 置空
          for (let i in this.type1) {
            this.option.legend.data.push(this.type1[i])
            this.option.legend.selected[this.type1[i]] = true
          }
          // 画图
          this.seriesData1 = seriesData
          this.changeType1()
        } else {
          this.$message({
            message: res.errMsg,
            type: 'error'
          })
        }
      })
    },
    changeType1 () { //  更换类型
      let seriesData = this.seriesData1
      // 初始化
      this.myChart.clear()
      for (let i = 0; i < this.option.legend.data.length; i++) { // 置空
        this.option.series[i] = {
          name: '',
          type: 'bar',
          stack: '总量',
          data: [],
          barMaxWidth: '10px'
        }
      }
      let kk = 0
      for (let k in seriesData.ALL) {
        if (this.plateform1 === '0') { // 全部
          this.option.series[kk].data = seriesData.ALL[k]
        } else if (this.plateform1 === '1') { // 支付宝
          this.option.series[kk].data = seriesData.ALIPAY[k]
        } else {
          this.option.series[kk].data = seriesData.WECHAT[k] // 小程序
        }
        this.option.series[kk].name = this.type1[k]
        kk++
      }
      // 画图表
      this.$nextTick(() => {
        this.myChart.setOption(this.option)
        this.loading = false
      })
    },
    changeSelect1 () {
      if (this.legendSelect1 === '0') {
        for (let i in this.option.legend.selected) {
          this.option.legend.selected[i] = true
        }
      } else {
        for (let i in this.option.legend.selected) {
          if (i === this.legendSelect1) {
            this.option.legend.selected[i] = true
          } else {
            this.option.legend.selected[i] = false
          }
        }
      }
      // 画图表
      this.$nextTick(() => {
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>
