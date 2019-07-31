<template>
  <div>
    <div class="date-panel">
      <div class="date-list">
        <van-tabs v-model="active" @click="chooseDate" swipeable>
          <!--<Fragment>-->
            <van-tab v-for="(item,index) in dateList"
                     :key="item.dateStr1"
                     :name="index"
            >
              <div slot="title" ref="title" class="date-item" :class="item.dateStr === selectDate.dateStr ? 'active' : ''">
                <div>
                  <div class="week">{{item.dateStr1 === today ? '今日' : item.week}}</div>
                  <div class="date">{{item.dateStr}}</div>
                </div>
                <span class="tips" :class="item.state === 'yes'? 'hasNum' : ''">{{item.state === 'yes'? '有' : '无'}}</span>
              </div>
            </van-tab>
          <!--</Fragment>-->
        </van-tabs>
      </div>
      <div class="calendar-btn"
           v-if="scheduleDaysForReg > 7"
           @click="show = true"
      >
        <div class="calendar-icon"></div>
        <div class="icon"><van-icon name="arrow-down" size="10"/></div>
      </div>
    </div>
    <van-action-sheet v-model="show" title="排班日历">
      <div class="calendar">
        <!--week-title-->
        <div class="week-title">
          <div v-for="item in week" :key="item" class="item">{{item}}</div>
        </div>
        <!--content-->
        <div class="content">
          <div class="panel" v-for="(item, index) in dayList" :key="index">
            <div class="month">{{index}}</div>
            <div class="date">
              <div class="item"
                   v-for="(item2,index2) in item"
                   :key="index2"
                   :class="item2.dateStr === selectDate.dateStr1 ? 'active' : ''"
                   @click="chooseCalendarDay(item2)"
              >
                <div>{{item2.day}}</div>
                <div class="tips"
                     v-if="item2.day != ' '"
                     :class="item2.state === 'yes'? '' : 'none'"
                >{{item2.state === 'yes' ? '有号' : '无号'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
  import { Tab, Tabs, Icon, ActionSheet  } from 'vant';
  import { datePlugin } from '../utils/date'
  import axios from 'axios'
  export default {
    name: 'DateSelectNew',
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Icon.name]: Icon,
      [ActionSheet.name]: ActionSheet
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
        stateList: {},
        week: '日一二三四五六'.split(""),
        dayList: {}
      }
    },
    watch: {
    },
    created: function () {
      this.today = datePlugin.formatWithPatternDate('yyyy-mm-dd', new Date())
      this.lastDay = datePlugin.formatWithPatternDate('yyyy-mm-dd', new Date(new Date().getTime() + (this.scheduleDaysForReg - 7) * 24*60*60*1000))
    },
    mounted(){
      this.getDateStatusList()
      this.active = 0
    },
    methods: {
      getDateStatusList() {  // 获取日期状态
        axios.get('static/resources/SchStateList.json').then((response) => {
            this.stateList = response.data.value
            // tab栏
            this.dateList = this.getDateItems(new Date(), this.scheduleDaysForReg > 7 ? 7 : this.scheduleDaysForReg)
            this.chooseDate(this.active)
            // 获取日历
            this.dayList = this.getDayList(this.scheduleDaysForReg)
          })
      },
      // 一段范围内的日期（7天）
      getDateItems(startDay, num) {
        let days = num? num : 7;
        let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          array = [];
        for (let i = 0; i < days; i++) {
          let date = new Date(startDay.getTime() + i * 24*60*60*1000);
          array.push({
            date: date,
            week: weekDay[date.getDay()],
            dateStr: datePlugin.formatWithPatternDate('mm-dd', date),
            dateStr1: datePlugin.formatWithPatternDate('yyyy-mm-dd', date),
            state: this.stateList[datePlugin.formatWithPatternDate('yyyy-mm-dd', date)]
          })
        }
        return array;
      },
      getDayList(num) {  // 获取日历排班
        let startDay = new Date()
        let list = {}
        for (let i = 0; i < num; i++) {
          let date = new Date(startDay.getTime() + i * 24*60*60*1000);
          let key = datePlugin.formatWithPatternDate('yyyy年mm月', date)
          if(!list.hasOwnProperty(key)){
            list[key] = []
            // 判断当前日期前应该填充多少个空白项
            for (let k = 0; k < date.getDay(); k++){
              list[key].push({
                day: ' '
              })
            }
          }
          list[key].push({
            date: date,
            day: date.getDate(),
            dateStr: datePlugin.formatWithPatternDate('yyyy-mm-dd', date),
            state: this.stateList[datePlugin.formatWithPatternDate('yyyy-mm-dd', date)]
          })
        }
        return list;
      },
      chooseCalendarDay(day) {  // 选择日历日期
        // 若有排班，且选中日期小于日期范围 - 7
        if(day.dateStr) {
          this.show = false
          this.dateList = [];
          let date = new Date(day.dateStr)
          // today + range - chooseday < 7  === chooseday - today > range - 7
          let num = Math.floor((new Date().getTime() + this.scheduleDaysForReg * 24*60*60*1000 - new Date(day.dateStr).getTime()) / (1000 * 60 * 60 * 24))
          console.log(num)
          if(num < 7){
            this.active = 7 - num
            date = new Date(new Date().getTime() + (this.scheduleDaysForReg - 7) * 24*60*60*1000)
          } else {
            this.active = 0
          }
          this.$nextTick(() => {
            this.dateList = this.getDateItems(date)
            this.chooseDate(this.active)
          })
        }
      },
      chooseDate(name) {  // 选择日期
        this.selectDate = this.dateList[name]
        this.$emit("getDate", this.selectDate)
      },
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
    /*padding: 0 10);*/
    .date-list {
      flex: 5;
      white-space: nowrap;
      .date-item {
        display: flex;
        font-size: 14px;
        padding: 10px;
        color: #969799;
        line-height: 14px;
        .tips {
          color: #7D7E80;
          background: #EBEDF0;
          margin-left: 3px;
          font-size: 10px;
          height: 14px;
          &.hasNum{
            color:  #1989FA;
            background: rgba(25, 137, 250, 0.1);
          }
        }
        .date {
          font-size: 11px;
          margin-top: 3px;
        }
        &.active {
          color: #323233;
          .week {
            font-weight:600;
          }
        }
      }
    }
    .calendar-btn {
      flex: 1;
      padding-top: 5px;
      .calendar-icon {
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
  .calendar {
    margin-bottom: 8px;
    .week-title {
      display: flex;
      /*padding: 0 10);*/
      background: #fff;
      .item {
        flex: 1;
        padding: 10px;
        text-align: center;
        color: #323233;
      }
    }
    .content {
      .month {
        padding: 5px 10px;
        font-size: 18px;
        font-weight:500;
        background:rgba(247,248,250,1)
      }
      .date {
        /*padding: 10);*/
        background: #fff;
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 14.2%;
          text-align: center;
          padding: 5px 0;
          .tips {
            color: #1989FA;
            font-size: 12px;
            &.none {
              color: #C8C9CC;
            }
          }
          &.active {
            background: #1989FA;
            border-radius:4px;
            color: #fff;
            .tips {
              color: #fff;
            }
          }
        }
        .item:active {
          background-color: #ccc;
        }
      }
    }
  }
</style>
