<template>
  <div class="hc-navbar-nav no-select">

    <div class="left">
      <!-- 展开/收缩侧边导航栏按钮 -->
      <div class="navbar-item" @click="handlerMenus(!isCollapse)">
        <i class="el-icon-s-fold" v-show="!isCollapse"></i>
        <i class="el-icon-s-unfold" v-show="isCollapse"></i>
      </div>
    </div>

    <div class="right">
      <!-- 全屏按钮 -->
      <div class="navbar-item pc" @click="handlerScreen">
        <i class="el-icon-full-screen"></i>
      </div>
      <!-- 通知按钮 -->
      <div class="navbar-item">
        <i class="el-icon-bell"></i>
      </div>
      <!-- 用户信息 -->
      <div class="navbar-item">
        <el-dropdown class="user-info">
          <span class="el-dropdown-link">
            <el-avatar class="user-avatar" size="small" src="https://i02piccdn.sogoucdn.com/05eec5d546a41b7c"></el-avatar>
            <span class="user-name pc">{{user.name}}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="go">
                <i class="el-icon-user"></i>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="out">
                <i class="el-icon-more-outline"></i>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 切换语言按钮 -->
      <div class="navbar-item" @click="handlerLanguage">
        <span style="display: inline-block;min-width: 20px;">{{language}}</span>
      </div>
      <!-- 展开设置按钮 -->
      <div class="navbar-item" @click="handlerSetting(true)">
        <i class="el-icon-setting"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed} from 'vue'
  import {useStore} from 'vuex'
  import {useRouter} from 'vue-router'
  import screenfull, {Screenfull} from 'screenfull'
  import {ElMessageBox} from 'element-plus'

  export default defineComponent({
    name: 'Nav',
    setup() {
      const store = useStore()
      const router = useRouter()
      const user = computed(() => {
        return store.state.user
      }) // 用户信息
      const language = computed(() => {
        return store.state.language
      }) // 是否切换语言
      const isCollapse = computed(() => {
        return store.state.isCollapse
      }) // 是否展开侧边导航栏

      // 跳转组件
      const go = () => {
        router.push({name: 'center'})
      }
      // 退出登录
      const out = () => {
        ElMessageBox.confirm('您确定退出登录当前账户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.setItem('hc-manage-user', '{}') // 清空用户数据
          store.dispatch('handlerNavMenus', {data: null, type: 6}) // 清空任务栏
          router.push({name: 'login'}) // 返回登录界面
        }).catch(() => {return})
      }
      // 展开 / 收缩侧边导航栏
      const handlerMenus = (isCollapse: boolean) => {
        store.dispatch('handlerCollapse', isCollapse)
      }
      // 展开设置栏
      const handlerSetting = (isSetting: boolean) => {
        store.dispatch('handlerSetting', isSetting)
      }
      // 切换语言
      const handlerLanguage = () => {
        if (language.value === 'En') {
          store.dispatch('handlerLanguage', '中')
        } else {
          store.dispatch('handlerLanguage', 'En')
        }
      }
      // 切换全屏
      const handlerScreen = () => {
        (screenfull as Screenfull).toggle()
      }

      return {
        user,
        language,
        isCollapse,
        go,
        out,
        handlerSetting,
        handlerScreen,
        handlerLanguage,
        handlerMenus
      }
    }
  })
</script>

<style lang="less" scoped>
  @import "../../../assets/css/mutations";

  // 只有在 pc 端才可以显示 hover 样式
  @media (any-hover: hover) {
    .hc-navbar-nav{
      .navbar-item{
        &:hover{
          cursor: pointer;
          background-color: @bg-color-hover;
        }
      }
    }
  }

  .hc-navbar-nav{
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    height: @nav-height;
    background-color: @bg-color;
    color: @font-color-base;
    .navbar-item{
      display: inline-block;
      overflow: hidden;
      padding: @nav-item-padding;
      height: @nav-line-height;
      line-height: @nav-line-height;
      font-size: 20px;

      // 用户信息下拉菜单
      .user-info{
        span{
          display: inline-block;
          line-height: @nav-line-height;
        }
        // 用户头像样式
        .user-avatar{
          transform: translateY(25%);
        }
        // 用户名样式
        .user-name{
          padding-left: 10px;
          color: @font-color-base;
          vertical-align: middle;
        }
      }
    }
  }
</style>
