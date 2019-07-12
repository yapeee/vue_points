import Vue from 'vue'
import Router from 'vue-router'
import dataAnalyse from '@/pages/dataAnalyse'
import DateInfo from '@/pages/DateInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dataAnalyse',
      component: dataAnalyse
    },
    {
      path: '/DateInfo',
      name: 'DateInfo',
      component: DateInfo
    }
  ]
})
