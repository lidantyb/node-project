import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入路由
import {routes} from './route'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
