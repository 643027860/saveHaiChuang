import { createStore } from 'vuex'
import {HANDLERCOLLAPSE, HANDLERMENUS, HANDLERMENUID, HANDLERLANGUAGE} from './mutation_types'
import {HANDLERNAVMENUS, HANDLERSETTING, HANDLERUSER} from './mutation_types'
import {getNavMenus, setNavMenus} from '../utils/sessionStorage'

export default createStore({
  state: {
    user: {}, // 用户信息
    isCollapse: true, // 侧边导航栏是否收缩，默认收缩
    menus: [], // 侧边导航栏
    currentMenu: '', // 当前选中的侧边导航栏
    navMenus: [], // 任务导航
    isSetting: false, // 是否展开设置栏
    language: '中', // 语言
  },
  mutations: {
    // 更新用户信息
    [HANDLERUSER](state, user){
      state.user =  user
    },
    // 展开 / 收缩 侧边导航栏
    [HANDLERCOLLAPSE](state, isCollapse){
      state.isCollapse =  isCollapse
    },
    // 更新侧边导航栏
    [HANDLERMENUS](state, menus){
      state.menus =  menus
    },
    // 侧边导航栏选中菜单
    [HANDLERMENUID](state, currentMenu){
      console.log(currentMenu)
      state.currentMenu =  currentMenu
    },
    // 更新任务导航
    [HANDLERNAVMENUS](state, navMenus){
      state.navMenus = navMenus
    },
    // 是否展开设置栏
    [HANDLERSETTING](state, isSetting){
      state.isSetting = isSetting
    },
    // 切换语言
    [HANDLERLANGUAGE](state, language){
      state.language =  language
    }
  },
  actions: {
    // 更新用户信息
    handlerUser({commit}, user){
      commit(HANDLERUSER, user)
    },
    // 展开 / 收缩 侧边导航栏
    handlerCollapse({commit}, isCollapse){
      commit(HANDLERCOLLAPSE, isCollapse)
    },
    // 更新侧边导航栏
    handlerMenus({commit}, menus){
      commit(HANDLERMENUS, menus)
    },
    // 侧边导航栏选中菜单
    handlerMenuId({commit}, currentMenu){
      commit(HANDLERMENUID, currentMenu)
    },
    // 更新任务导航
    handlerNavMenus({state, commit}, options){
      const {type, data} = options
      let newNavMenus: any[] = getNavMenus() // 将任务栏数据从 session 中取出
      // 1: 添加； 2：单个删除； 3：关闭左侧； 4：关闭右侧； 5：关闭其他； 6：关闭所有
      if (type === 1) {
        let had = false // 判断标志：是否已经拥有该任务,组件名是否一致
        let replaceIndex : number | undefined = undefined // 相同组件，判断参数是否一致，记录下标以便更新
        newNavMenus.forEach((item: any, index: number) => {
          // 判断是否已存在该任务
          if (item.name === data.name) {
            // 判断参数是否一致
            if (item.fullPath !== data.fullPath) {
              replaceIndex = index
            }
            return had = true
          }
        })
        // 未存在该任务则新增任务则直接添加任务，否则看是否参数不一致，若不一致则更新该任务
        if (!had) {
          newNavMenus.push(data)
        } else if (had && replaceIndex !== undefined) {
          newNavMenus[replaceIndex] = data
        }
      } else if (type === 2) {
        newNavMenus = newNavMenus.filter((item: any) => item.name !== data.name)
      } else if (type === 3) {
        const index = newNavMenus.findIndex((item: any) => item.name === data.name)
        newNavMenus = newNavMenus.slice(index, newNavMenus.length)
      } else if (type === 4) {
        const index = newNavMenus.findIndex((item: any) => item.name === data.name)
        newNavMenus = newNavMenus.slice(0, index + 1)
      } else if (type === 5) {
        newNavMenus = newNavMenus.filter((item: any) => item.name === data.name)
      } else if (type === 6) {
        newNavMenus = []
      }
      setNavMenus(newNavMenus) // 将任务栏存入 session 中
      commit(HANDLERNAVMENUS, newNavMenus)
    },
    // 是否展开设置栏
    handlerSetting({commit}, isSetting){
      commit(HANDLERSETTING, isSetting)
    },
    // 切换语言
    handlerLanguage({commit}, language){
      commit(HANDLERLANGUAGE, language)
    }
  },
  getters: {
  },
  modules: {
  }
})
