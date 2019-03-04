import Vue from 'vue'
import Router from 'vue-router'
import dataAnalyse from '@/pages/dataAnalyse'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dataAnalyse',
      component: dataAnalyse
    }
  ]
})
