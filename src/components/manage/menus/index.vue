<template>
  <div :class="{'hc-menus': true, 'menu-close': isCollapse,'menu-open': !isCollapse}" :collapse="isCollapse">
    <div class="hc-menus-logo no-select">
      <div class="logo-div">
        <img src="../../../assets/imgs/logo.png" alt="logo" class="logo">
      </div>
      <span class="team-title">海创团队</span>
    </div>
    <el-menu
        :unique-opened="true"
        :default-active="currentMenu.meta.activeName ? currentMenu.meta.activeName : currentMenu.name"
        class="el-menu-vertical-demo" :collapse="isCollapse"
    >
      <template v-for="(menu, index) in menus" :key="index">
        <!-- 有子级菜单的 -->
        <template v-if="menu.children && menu.children.length">
          <el-submenu :index="menu.path">
            <template #title>
              <i :class="menu.meta.icon"></i>
              <span>{{menu.meta.title}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="(children, index1) in menu.children" :key="index1">
                <el-menu-item v-if="!children.meta.hidden" :index="children.name" @click="go(children.name)">{{children.meta.title}}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>

        <!-- 无子级菜单 -->
        <template v-else>
          <el-menu-item :index="menu.path" v-if="!menu.meta.hidden" @click="go(menu.path)">
            <i :class="menu.meta.icon"></i>
            <span>{{menu.meta.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
  <!-- 移动端蒙板 -->
  <div class="hc-menus-mengban" v-show="!isCollapse" @click="handlerCollapse"></div>
</template>

<script lang="ts">
  import {defineComponent, computed, onMounted, onBeforeUnmount} from 'vue'
  import {useStore} from 'vuex'
  import {useRouter} from 'vue-router'

  export default defineComponent({
    name: 'Menus',
    setup() {
      const router = useRouter()
      const store = useStore()
      const isCollapse = computed(() => {
        return store.state.isCollapse
      }) // 是否展开侧边导航栏
      const menus = computed(() => {
        return store.state.menus
      }) // 侧边导航栏数据
      const currentMenu = computed(() => {
        return store.state.currentMenu
      }) // 当前选中侧边导航栏

      // 组件挂载时，全局绑定监听窗口大小变化事件
      onMounted(() => {
        // 因为侧边导航栏默认为收缩 ，初始化时，判断当前窗口大小，如果大于 768px，则展开侧边导航栏
        if (window.innerWidth >= 768) {
          store.dispatch('handlerCollapse', false)
        }
        // 全局绑定监听窗口大小变化事件
        window.addEventListener('resize', handlerCollapse)
      })
      // 组件卸载前，移除全局监听窗口大小变化事件
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handlerCollapse)
      })

      // 是否需要关闭侧边导航栏
      const handlerCollapse = () => {
        // 判断当前窗口大小，如果小于 768px，默认收缩侧边导航栏
        if (window.innerWidth <= 768) {
          store.dispatch('handlerCollapse', true)
        }
      }
      // 路由跳转方法
      const go = (name: string) => {
        handlerCollapse()
        router.push({name})
      }

      return {
        isCollapse,
        currentMenu,
        menus,
        handlerCollapse,
        go
      }
    }
  })
</script>

<style lang="less">
  @import "../../../assets/css/mutations";
  .hc-menus{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    height: 100vh;
    background-color: @bg-color-deep;
    transition: @transition-time;

    // logo 样式
    .hc-menus-logo{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      overflow: hidden;
      height: @nav-height;
      background-color: @bg-color-deep;
      text-align: center;
      border-bottom: 1px solid @font-color-title;
      cursor: pointer;

      // logo
      .logo-div{
        height: @nav-height;
        width: @width-menus-close;
        .logo{
          width: 50%;
          height: 50%;
          margin-top: 50%;
          margin-left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }

      // 海创字样
      .team-title{
        font-size: 17px;
        color: @font-color-active-deep;
      }
    }
    // 修改导航栏样式
    .el-menu-vertical-demo{
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100vh - @nav-height);
      background-color: @bg-color-deep;
      border-right: none;
      transition: @transition-time;
      // 消除父级菜单的 padding
      .el-menu-item-group__title{
        padding-bottom: 0;
        padding-top: 0;
      }
      // .el-submenu__title 父级菜单样式， .el-menu-item 子级菜单样式
      .el-submenu__title,.el-menu-item{
        color: @font-color-title-menu;
        background-color: @bg-color-deep;
        border: 0;
        &:hover{
          color: @font-color-active-deep;
          background-color: @bg-color-deep-hover;
        }
      }
      // 激活样式
      .is-active{
        color: @font-color-active-deep!important;
        background-color: @font-color-active!important;
      }
      // 隐藏滚动条
      &::-webkit-scrollbar{
        width: 0;
      }
    }
  }
  // 侧边导航栏展开时
  .menu-open{
    width: @width-menus-open;
  }
  // 侧边导航栏收缩时
  .menu-close{
    width: @width-menus-close;
  }

  @media screen and(max-width: 768px){
    // 蒙板
    .hc-menus-mengban{
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0,0,0,0.2);
    }
    // 移动端侧边导航栏收缩时隐藏导航栏
    .menu-close{
      width: 0;
      .el-menu-vertical-demo{
        display: none;
      }
    }
    // 移动端侧边导航栏展开正常
    .menu-open{
      .el-menu-vertical-demo{
        display: block;
      }
    }
  }
</style>
