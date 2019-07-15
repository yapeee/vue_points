<template>
  <div>
    <div class="date-panel">
      <div class="date-list">
        <van-tabs v-model="active" @click="chooseDate">
          <van-tab v-for="(item,index) in dateList"
                   :key="item.dateStr1"
                   :name="index"
          >
            <div slot="title" class="date-item" :class="item.dateStr === selectDate.dateStr ? 'active' : ''">
              <div class="week">
                {{item.dateStr1 === today ? '今日' : item.week}}
                <span :class="item.state === 'yes'? 'hasNum' : ''">{{item.state === 'yes'? '有' : '无'}}</span>
              </div>
              <div class="date">{{item.dateStr}}</div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="calendar-btn"
           v-if="scheduleDaysForReg > 7"
           @click="show = true"
      >
        <div class="calendar"></div>
        <div class="icon"><van-icon name="arrow-down" size="10"/></div>
      </div>
    </div>
    <van-action-sheet v-model="show" title="排班日历">
      <inline-calendar
        v-model="value"
        :start-date="today"
        :end-date="lastDay"
        :return-six-rows="false"
        :render-function="buildSlotFn"
        @on-change="chooseCalendarDay"
      ></inline-calendar>
    </van-action-sheet>
  </div>
</template>

<script>
import { Tab, Tabs, Icon, ActionSheet } from 'vant'
import { InlineCalendar } from 'vux'
import axios from 'axios'
export default {
  name: 'DateSelect',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    InlineCalendar
  },
  props: {
  },
  data () {
    return {
      scheduleDaysForReg: 45,
      dateList: [],
      selectDate: {},
      show: false,
      value: '',
      buildSlotFn: () => '',
      today: '',
      lastDay: '',
      active: 0,
      stateList: {}
    }
  },
  watch: {
  },
  created: function () {
    this.today = this.formatWithPatternDate('yyyy-mm-dd', new Date())
    this.lastDay = this.formatWithPatternDate('yyyy-mm-dd', new Date(new Date().getTime() + (this.scheduleDaysForReg - 7) * 24 * 60 * 60 * 1000))

    this.getDateStatusList()
  },
  methods: {
    // 一段范围内的日期（7天）
    getDateItems (startDay, num) {
      let days = num || 7
      let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let array = []
      for (let i = 0; i < days; i++) {
        let date = new Date(startDay.getTime() + i * 24 * 60 * 60 * 1000)
        array.push({
          date: date,
          week: weekDay[date.getDay()],
          dateStr: this.formatWithPatternDate('mm-dd', date),
          dateStr1: this.formatWithPatternDate('yyyy-mm-dd', date),
          state: this.stateList[this.formatWithPatternDate('yyyy-mm-dd', date)]
        })
      }
      return array
    },
    getDateStatusList () { // 获取日期状态
      axios.get('static/resources/SchStateList.json').then((response) => {
        this.stateList = response.data.value
        // tab栏
        this.dateList = this.getDateItems(new Date(), this.scheduleDaysForReg > 7 ? 7 : this.scheduleDaysForReg)

        this.chooseDate(this.active)
        // 日历组件
        this.buildSlotFn = (line, index, data) => {
          return this.stateList[data.formatedDate] === 'yes' ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : '<div style="height:19px;"></div>'
        }
      })
    },
    chooseCalendarDay (day) { // 选择日历日期
      this.show = false
      this.active = 0
      this.dateList = []
      this.$nextTick(() => {
        let date = new Date(day)
        this.dateList = this.getDateItems(date)
        this.chooseDate(this.active)
      })
    },
    chooseDate (name) { // 选择日期
      this.selectDate = this.dateList[name]
      this.$emit('getDate', this.selectDate)
    },
    formatWithPatternDate (format, date) {
      if (!date) { return null }
      var look = function (m) { // Check whether a format character is doubled
          var n = 0
          while (i + 1 < format.length && format.charAt(i + 1) === m) {
            n++
            i++
          }
          return n
        },
        f1 = function (m, val, len) { // Format a number, with leading zero if necessary
          var n = '' + val
          if (look(m)) {
            while (n.length < len) {
              n = '0' + n
            }
          }
          return n
        },
        i,
        output = '',
        literal = false

      for (i = 0; i < format.length; i++) {
        if (literal) {
          if (format.charAt(i) === "'" && !look("'")) {
            literal = false
          } else {
            output += format.charAt(i)
          }
        } else {
          switch (format.charAt(i)) {
            case 'd':
              output += f1('d', date.getDate(), 2)
              break
            case 'o':
              output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3)
              break
            case 'm':
              output += f1('m', date.getMonth() + 1, 2)
              break
            case 'y':
              output += (look('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + date.getFullYear() % 100)
              break
            case 'h':
              var h = date.getHours()
              output += f1('h', (h > 12 ? (h - 12) : (h === 0 ? 12 : h)), 2)
              break
            case 'H':
              output += f1('H', date.getHours(), 2)
              break
            case 'i':
              output += f1('i', date.getMinutes(), 2)
              break
            case 's':
              output += f1('s', date.getSeconds(), 2)
              break
            case 'a':
              output += date.getHours() > 11 ? '下午' : '上午'
              break
            case 'A':
              output += date.getHours() > 11 ? 'PM' : 'AM'
              break
            case "'":
              if (look("'")) {
                output += "'"
              } else {
                literal = true
              }
              break
            default:
              output += format.charAt(i)
          }
        }
      }
      return output
    }
  }
}
</script>
<style lang="scss">
  .date-list {
    .van-tabs--line {
      padding-top: 50px;
    }
    .van-tabs--line .van-tabs__wrap {
      height: 50px;
    }
    .van-tabs__line {
      background-color: #1989FA;
    }
  }
  .calendar-btn .icon .van-icon {
    display: block;
  }
</style>
<style lang="scss" scoped>
  /*日历模块*/
  .date-panel {
    background: #fff;
    display: flex;
    /*padding: 0 px2rem(10);*/
    .date-list {
      flex: 5;
      white-space: nowrap;
      .date-item {
        font-size: 14px;
        padding: 10px;
        color: #969799;
        line-height: 14px;
        .week span{
          color: #7D7E80;
          background: #EBEDF0;
          margin-left: 3px;
          font-size: 10px;
          display: inline-block;
        }
        .week span.hasNum{
          color: #1989FA;
          background: rgba(25, 137, 250, 0.1);
        }
        .date {
          font-size: 11px;
          margin-top: 3px;
        }
      }
      .date-item.active {
        color: #323233;
      }
    }
    .calendar-btn {
      flex: 1;
      padding-top: 5px;
      .calendar {
        height: 25px;
        width: 25px;
        margin: 0 auto;
        background: url("../assets/calendar.png") no-repeat;
        background-size: contain;
      }
      .icon {
        text-align: center;
        height: 10px;
      }
    }
  }
</style>
