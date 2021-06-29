<template>
  <div class="hc-navbar-menus ">
    <div class="left float-clear">
      <div class="menu-item float-left no-select" v-for="item in navMenus" :key="item.name" @click="go(item.fullPath)">
        <!--  是否显示当前组件 -->
        <span :class="{'nav-menus-active': currentMenu.name === item.name}">{{item.meta.title}}</span>
        <!-- 关闭按钮，需要阻止冒泡行为 -->
        <span class="close-item" @click.stop="closeMenu(item, 2)">
          <i class="el-icon-close"></i>
        </span>
      </div>
    </div>
    <div class="right">
      <el-dropdown>
        <span class="menu-control-icon">
          <i class="el-icon-arrow-down"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="closeMenu(currentMenu, 3)">
              <i class="el-icon-arrow-left"></i>
              <span>关闭左侧</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeMenu(currentMenu, 4)">
              <i class="el-icon-arrow-right"></i>
              <span>关闭右侧</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeMenu(currentMenu, 5)">
              <i class="el-icon-close"></i>
              <span>关闭其他</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeMenu(currentMenu, 6)">
              <i class="el-icon-circle-close"></i>
              <span>关闭所有</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed, watch} from 'vue'
  import {useStore} from 'vuex'
  import {useRouter} from 'vue-router'

  export default defineComponent({
    name: 'NavbarMenus',
    setup() {
      const store = useStore()
      const router = useRouter()
      const navMenus = computed(() => {
        return store.state.navMenus
      }) // 任务栏数据
      const currentMenu = computed(() => {
        return store.state.currentMenu
      }) // 当前组件名

      // 监视任务栏数据，若为空则重定向至首页
      watch(
        navMenus,
        newValue => {
          if (!newValue.length) {
            router.push('/manage')
          }
        },
        {
          deep: true
        }
      )

      // 关闭任务的操作方法
      const closeMenu = (data: any, type: number) => {
        store.dispatch('handlerNavMenus', {data, type})
      }
      // 路由跳转方法
      const go = (fullPath: string) => {
        router.push(fullPath)
      }

      return {
        navMenus,
        currentMenu,
        closeMenu,
        go
      }
    }
  })
</script>

<style lang="less" scoped>
  @import "../../../assets/css/mutations";

  // 只有在 pc 端才可以显示 hover 样式
  @media (any-hover: hover) {
    .hc-navbar-menus{
      .left{
        .menu-item{
          &:hover{
            cursor: pointer;
            color: @font-color-hover;
          }
          .close-item:hover{
            background-color: @bg-color-empty;
          }
        }
      }
    }
  }

  .hc-navbar-menus{
    display: flex;
    justify-content: space-between;
    height: @nav-menu-height;
    padding: @padding-small @padding-medium;
    background: @bg-color-empty;
    box-sizing: border-box;

    // 左侧菜单子项样式
    .left{
      overflow: hidden;
      // 菜单样式
      .menu-item{
        display: flex;
        align-items: center;
        margin-right: 10px;
        padding: 0 10px;
        background-color: @bg-color;
        color: @font-color-title;
        line-height: @nav-menu-line-height;
        font-size: 13px;
        border-radius: 2px;

        // 当前激活状态的任务菜单样式
        .nav-menus-active{
          color: @font-color-active;
        }
        // 关闭菜单 icon 样式
        .close-item{
          display: inline-block;
          position: relative;
          height: 18px;
          width: 18px;
          margin-left: 10px;
          border-radius: 50%;

          i{
            position: absolute;
            top: 3px;
            left: 3px;
            color: @font-color-title;
          }
        }
      }
    }

    // 右侧下拉菜单样式
    .right{
      .menu-control-icon{
        display: inline-block;
        position: relative;
        height: @nav-menu-line-height;
        width: @nav-menu-line-height;
        background-color: @bg-color;
        i{
          position: absolute;
          left: 50%;
          top: 50%;
          color: @font-color-title;
          font-size: 18px;
          transform: translate3d(-50%,-50%,0);
          cursor: pointer;
        }
      }
    }
  }

  @media screen and (max-width: 768px){
    .hc-navbar-menus{
      padding: @padding-small;
    }
  }
</style>
