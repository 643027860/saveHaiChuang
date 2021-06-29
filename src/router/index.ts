import { createRouter, createWebHashHistory,createWebHistory, RouteRecordRaw } from 'vue-router'
import {ElMessageBox} from 'element-plus'
import MenusData from '../data/menus' // 获取本地的 menus 数据
import {getUser} from "../utils/sessionStorage" // 获取用户信息的工具方法

const Data = JSON.parse(JSON.stringify(MenusData)) // 将本地的数据转换为一个普通数组

// 处理动态引入组件函数
const getComponent = (data: any) => {
  data.map((item: any) => {
    const name = item.component
    // 这里必须使用模板字符串方式拼接路径，否则无法识别。
    // 而且不能变量开头！！例如将 @/ 加入变量中再直接使用变量......
    item.component = () => import(`@/${name}`)
    // 利用递归，处理多级路由
    if (item.children && item.children.length) {
      getComponent(item.children)
    }
  })
  return data
}
const routerData = getComponent(Data) // 获取处理后的理由数据

const routes: Array<RouteRecordRaw> = routerData

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // 主要用来做一些身份验证
  // 跳转需要验证的组件
  if (to.meta && to.meta.auth) {
    // 获取用户信息
    const {user, expire} = getUser()
    const time = new Date().getTime()
    // 验证是否已经登录，且未过期
    if (user.number && time < expire) {
      // 验证权限够则跳转，不够则跳转首页
      if (user.role < (to.meta.role as number)) {
        console.log('权限不够')
        next({name: 'manage'})
      }
      next()
    } else {
      if (time > expire) {
        ElMessageBox.alert('登录已过期，请重新登陆', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            // 重定向登录界面
            next({name: 'login'})
          }
        })
      } else {
        // 未登录则重定向登录界面
        console.log('未登录')
        next({name: 'login'})
      }
    }
  } else {
    next()
  }
})

export default router
