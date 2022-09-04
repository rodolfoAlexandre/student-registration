import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import StudentList from '../views/StudentList.vue'
import AddStudent from '../views/AddStudent.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'StudentList',
    component: StudentList
  },
  {
    path: '/AddStudent',
    name: 'AddStudent',
    component: AddStudent
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
