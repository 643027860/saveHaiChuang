<template>
  <div class="hc-manage">
    <Menus></Menus>
    <el-scrollbar max-height="100vh">
      <NavBar :class="{'content-big': isCollapse, 'content-small': !isCollapse}"></NavBar>
      <div :class="{'hc-manage-content': true, 'content-big': isCollapse, 'content-small': !isCollapse}">
        <router-view></router-view>
      </div>
    </el-scrollbar>
    <!-- 设置栏 -->
    <el-drawer
        :size="250"
        v-model="isSetting"
        :with-header="false">
      <Setting></Setting>
    </el-drawer>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed} from 'vue'
  import {useStore} from 'vuex'
  import {useRouter, onBeforeRouteUpdate} from 'vue-router'
  import NavBar from '@/components/manage/navbar/index.vue'
  import Menus from '@/components/manage/menus/index.vue'
  import Setting from '@/components/manage/setting/index.vue'
  import MenusData from '../../data/menus'
  import {getUser} from "../../utils/sessionStorage"

  export default defineComponent({
    name: 'Manage',
    components: {
      NavBar,
      Menus,
      Setting
    },
    setup() {
      const store = useStore()
      const router = useRouter()
      const isSetting = computed(() => {
        return store.state.isSetting
      }) // 是否展开设置栏
      const isCollapse = computed(() => {
        return store.state.isCollapse
      }) // 是否展开侧边导航栏

      // 获取本地 menus 数据更新 store
      store.dispatch('handlerMenus', MenusData.filter(item => item.name === 'manage')[0].children)
      // 获取 session 数据更新 user
      store.dispatch('handlerUser', getUser().user)

      // 管理端一启动就获取当前组件的组件名更新侧边导航栏和顶部任务栏
      store.dispatch('handlerMenuId', router.currentRoute.value)
      store.dispatch('handlerNavMenus', {data: router.currentRoute.value, type: 1})

      // 监听路由变化，一变化就更新侧边导航栏和顶部任务栏
      onBeforeRouteUpdate(to => {
        store.dispatch('handlerMenuId', to)
        store.dispatch('handlerNavMenus', {data: to, type: 1})
      })

      return {
        isCollapse,
        isSetting
      }
    }
  })
</script>

<style lang="less" scoped>
  @import "../../assets/css/mutations";

  .hc-manage{
    display: flex;
    justify-content: left;
    background-color: @bg-color-empty;

    // 侧边导航栏展开
    .content-small{
      margin-left: @width-menus-open;
      width: calc(100vw - @width-menus-open);
    }
    // 侧边导航栏关闭
    .content-big{
      margin-left: @width-menus-close;
      width: calc(100vw - @width-menus-close);
    }

    // 主体内容区
    .hc-manage-content{
      min-height: calc(100vh - @nav-height - @nav-menu-height);
      margin-top: calc(@nav-height + @nav-menu-height);
      padding: 0 @padding-medium @padding-medium;
      transition: @transition-time;
      box-sizing: border-box;
    }
  }

  @media screen and(max-width: 768px){
    .hc-manage{
      // 移动端中不考虑侧边导航栏占位
      .content-big,.content-small{
        margin-left: 0;
        width: 100vw;
      }

      .hc-manage-content{
        padding: 0 @padding-small @padding-medium;
      }
    }
  }
</style>
