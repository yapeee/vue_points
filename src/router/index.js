import Vue from 'vue'
import Router from 'vue-router'
import dataAnalyse from '@/pages/dataAnalyse'
import DateInfo from '@/pages/DateInfo'
import Home from '@/pages/Home'
import StickyPage from '@/pages/StickyPage'
import ScrollPage from '@/pages/ScrollPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dataAnalyse',
      name: 'dataAnalyse',
      component: dataAnalyse
    },
    {
      path: '/',
      name: 'DateInfo',
      component: DateInfo
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/StickyPage',
      name: 'StickyPage',
      component: StickyPage
    },
    {
      path: '/ScrollPage',
      name: 'ScrollPage',
      component: ScrollPage
    }
  ]
})
