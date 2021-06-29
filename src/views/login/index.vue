<template>
  <div class="hc-login">
    <div class="hc-title">海创团队</div>
    <div class="login-container">
      <div class="left">
        <img src="../../assets/imgs/login.jpg" alt="">
      </div>
      <div class="right">
        <div class="loginForm">
          <h2 class="login-title">欢迎登录</h2>
          <el-form>
            <el-input
                class="hc-login-input"
                placeholder="请输入账号"
                prefix-icon="el-icon-user"
                v-model="loginForm.number">
            </el-input>
            <el-input
                class="hc-login-input"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                type="password"
                v-model="loginForm.password">
            </el-input>
          </el-form>
          <el-button class="loginButton" type="primary" round @click="login()">登录</el-button>
        </div>
      </div>
    </div>
    <div class="hc-footer">
      <span>Copyright © 2021 <router-link class="my-link" :to="{name: 'manage'}">海创团队</router-link></span>
      <span class="line">|</span>
      <span><a target="_blank" href="https://beian.miit.gov.cn/" class="my-link">粤ICP备2020087871号</a></span>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, onMounted, onBeforeUnmount} from 'vue'
  import {ElMessage} from 'element-plus'
  import {useRouter} from "vue-router";
  import {Login} from '../../api/types'
  import {setUser} from "../../utils/sessionStorage"

  export default defineComponent({
    name: 'Login',
    setup() {
      // 登录表单
      const loginForm = ref({
        number: '', // 账号
        password: '' // 密码
      })
      const router = useRouter()

      // 组件挂载时，全局绑定监听窗口大小变化事件
      onMounted(() => {
        window.addEventListener('keyup', listenerEnter)
      })
      // 组件卸载前，移除全局监听窗口大小变化事件
      onBeforeUnmount(() => {
        window.removeEventListener('keyup', listenerEnter)
      })

      // 监听回车时间
      const listenerEnter = (e: any) => {
        if (e.keyCode === 13) {
          login()
        }
      }
      // 登录
      const login = async () => {
        const result = await Login(loginForm.value)
        // status = 0 时表示登录成功
        if (result.status === 0) {
          setUser(result.data) // 将用户信息存入 session
          ElMessage({
            message: result.msg,
            type: 'success',
            duration: 1500
          })
          setTimeout(() => {
            router.replace({name: 'manage'})
          }, 800)
        } else {
          // 登录失败情况输入框并提示
          loginForm.value.number = ''
          loginForm.value.password = ''
          ElMessage({
            message: result.msg,
            type: 'error',
            duration: 1500
          })
        }
      }

      return {
        loginForm,
        login
      }
    }
  })
</script>

<style lang="less">
  @import "../../assets/css/mutations";
  @login-height: 470px; // 总体高度
  @login-weight-left: 500px; // 左侧图片宽度
  @login-weight-right: 400px; // 右边表单宽度
  @login-height-item: 50px; // 输入框等 item 高度
  @border-radius: 10px; // 圆角
  @color-border-gery: #e6e6e6; // 灰色的 border

  .hc-login{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url("../../assets/imgs/bg.png") no-repeat center;
    background-size: cover;

    // 标题
    .hc-title{
      position: fixed;
      top: 10px;
      left: 20px;
      font-size: 28px;
      font-weight: 600;
      color: @font-color-active;
      letter-spacing: 10px;
    }
    // 底部
    .hc-footer{
      position: fixed;
      bottom: 10px;
      span{
        display: inline-block;
        padding: 5px;
      }
    }

    .login-container{
      display: flex;
      border-radius: @border-radius;
      box-shadow: 0px 0px 13px 5px rgb(14 25 80 / 20%);
      .left{
        height: @login-height;
        width: @login-weight-left;
        border-radius: @border-radius 0 0 @border-radius;
        img{
          height: 100%;
          width: 100%;
          border-radius: @border-radius 0 0 @border-radius;
        }
      }
      .right{
        width: @login-weight-right;
        height: @login-height;
        background-color: white;
        border-radius: 0 @border-radius @border-radius 0;
        // 登录表单样式
        .loginForm{
          margin: calc(2 * @margin-big);
          // 标题样式
          .login-title{
            margin-bottom: calc(3 * @margin-big);
            color: @font-color-active;
            font-family: "微软雅黑","宋体",Arial,Helvetica,sans-serif;
            font-size: 30px;
            text-align: center;
            letter-spacing: 3px;
          }
          // 输入框样式
          .hc-login-input{
            margin-bottom: 28px;
            .el-input__inner{
              padding: 0 0 0 @login-height-item;
              height: @login-height-item;
              background: @bg-color!important;
              border-width: 0;
              border-radius: 0;
              border-bottom: 1px solid @color-border-gery;
              // 去掉输入框因为记录账号时显示的背景色
              &:-webkit-autofill{
                background-color: transparent;
                transition: background-color 50000s ease-in-out 0s;
              }
            }
            // 输入框图标 icon 样式
            .el-input__prefix{
              margin-left: -5px;
              width: @login-height-item;
              color: @font-color-active;
              line-height: @login-height-item;
              font-size: 20px;
              text-align: center;
            }
          }
          // 登录按钮样式
          .loginButton{
            width: 80%;
            margin: 30px 10%;
            font-size: 18px;
            letter-spacing: 5px;
          }
        }
      }
    }
  }

  // 隐藏左侧图片
  @media screen and (max-width: 1000px){
    .hc-login{
      //background: url("../../assets/imgs/bg-m.jpg") no-repeat center;
      // 标题
      .hc-title{
        font-size: 25px;
      }
      // 底部
      .hc-footer{
        span{
          font-size: 14px;
        }
      }
      .login-container{
        .left{
          display: none;
        }

        .right{
          border-radius: @border-radius;
        }
      }
    }
  }
  // 适配手机
  @media screen and (max-width: 499px){
    @login-height: 350px; // 总体高度
    @login-weight-left: 0; // 左侧图片宽度
    @login-weight-right: 70%; // 右边表单宽度
    @login-height-item: 40px; // 输入框等 item 高度
    .hc-login{
      // 标题
      .hc-title{
        left: 10px;
        font-size: 20px;
        letter-spacing: 4px;
      }
      // 底部
      .hc-footer{
        display: none;
      }
      .login-container{
        width: @login-weight-right;
        .right{
          height: @login-height;
          // 登录表单样式
          .loginForm{
            margin: calc(2 * @margin-big) @margin-big;
            // 标题样式
            .login-title{
              margin-bottom: calc(2 * @margin-big);
              color: @font-color-active;
              font-size: 20px;
            }
            // 输入框样式
            .hc-login-input{
              .el-input__inner{
                padding: 0 0 0 @login-height-item;
                height: @login-height-item;
              }
              // 输入框图标 icon 样式
              .el-input__prefix{
                width: @login-height-item;
                color: @font-color-active;
                line-height: @login-height-item;
              }
            }
            // 登录按钮样式
            .loginButton{
              height: @login-height-item;
              margin: 10px 10%;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
