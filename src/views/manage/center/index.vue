<template>
  <div class="manage-item hc-center">
    <div class="manage-item-header user-header">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="8">
          <div class="left">
            <el-upload
                class="avatar-uploader user-avator-upload"
                :show-file-list="false"
                action="#"
                :on-change="handleUpload"
                :auto-upload="false"
                accept="image/*">
              <img v-if="avatarUrl" :src="avatarUrl" alt="" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-col>
        <el-col :xs="24" :sm="16">
          <div class="right">
            <h2 class="user-name">你好，{{user.name}}</h2>
            <ul class="user-menus no-select">
              <li class="user-menus-item">
                <i class="el-icon-ship" style="color: rgb(36,235,94);" />
                <span class="user-menus-item-name">风采管理(10)</span>
              </li>
              <li class="user-menus-item">
                <i class="el-icon-document" style="color: rgb(67,125,255);" />
                <span class="user-menus-item-name">资料管理(10)</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="manage-item-component user-body">
      <div class="manage-item-component-title">
        基本信息
        <el-button icon="el-icon-edit" type="primary" size="mini" @click="edit = true">
          <span class="pc">修改</span>
        </el-button>
      </div>
      <div class="manage-item-component-content user-info-content" v-loading="loading">
        <ul class="content-ul">
          <li class="content-li">
            <div class="content-item-title">
              <span>组</span>
              <span>别:</span>
            </div>
            <div class="content-item">{{user.group}}</div>
          </li>
          <li class="content-li">
            <div class="content-item-title">
              <span>方</span>
              <span>向:</span>
            </div>
            <div class="content-item">{{user.direction}}</div>
          </li>
          <li class="content-li">
            <div class="content-item-title">
              <span>班</span>
              <span>级:</span>
            </div>
            <div class="content-item" v-if="!edit">{{user.classmate}}</div>
            <div class="content-item" v-if="edit">
              <el-input v-model="saveUser.classmate" placeholder="请输入班级"></el-input>
            </div>
          </li>
          <li class="content-li">
            <div class="content-item-title">
              <span>手</span>
              <span>机:</span>
            </div>
            <div class="content-item" v-if="!edit">{{user.telephone}}</div>
            <div class="content-item" v-if="edit">
              <el-input v-model="saveUser.telephone" placeholder="请输入手机"></el-input>
            </div>
          </li>
          <li class="content-li">
            <div class="content-item-title">
              <span>座</span>
              <span>右</span>
              <span>铭:</span>
            </div>
            <div class="content-item" v-if="!edit">{{user.motto}}</div>
            <div class="content-item" v-if="edit">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入座右铭"
                v-model="saveUser.motto">
              </el-input>
            </div>
          </li>
          <li class="content-li">
            <div class="content-item-title">
              <span>个</span>
              <span>人</span>
              <span>介</span>
              <span>绍:</span>
            </div>
            <div class="content-item" v-if="!edit">{{user.classmate}}</div>
            <div class="content-item" v-if="edit">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入个人介绍"
                v-model="saveUser.classmate">
              </el-input>
            </div>
          </li>
        </ul>
        <div class="option-button" v-if="edit">
          <el-button round size="small" @click="edit = false">取消</el-button>
          <el-button type="primary" round size="small" @click="updateUserInfo">提交</el-button>
        </div>
      </div>
    </div>
    <div class="manage-item-component user-body">
      <div class="manage-item-component-title">
        修改密码
      </div>
      <div class="manage-item-component-content user-info-content" v-loading="loading">
        <ul class="content-ul">
          <li class="content-li">
            <div class="content-item-title">
              <span>旧</span>
              <span>密</span>
              <span>码:</span>
            </div>
            <div class="content-item">
              <el-input
                autosize
                show-password
                placeholder="请输入旧密码"
                v-model="userAdmin.OldPassword">
              </el-input>
            </div>
          </li>
          <li class="content-li">
            <div class="content-item-title">
              <span>新</span>
              <span>密</span>
              <span>码:</span>
            </div>
            <div class="content-item">
              <el-input
                autosize
                show-password
                placeholder="请输入新密码"
                v-model="userAdmin.NewPassword">
              </el-input>
            </div>
          </li>
        </ul>
        <div class="manage-item-option-button">
          <el-button type="primary" round size="small" @click="updateUserPassword">确认修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
  import {defineComponent, computed, ref, watch, watchEffect} from 'vue'
  import {useStore} from 'vuex'
  import {GetUserInfo, UpdateInfo, UpdatePassword} from '../../../api/types'
  import {myMessage} from "../../../utils/message"

  export default defineComponent({
    name: 'Center',
    setup() {
      const store = useStore()
      const user = computed(() => {
        return store.state.user
      }) // 在 vuex 中获取用户信息
      const edit = ref(false) // 是否修改个人信息
      const avatarUrl = ref('') // 个人头像信息
      const loading = ref(false) // 是否显示 loading
      const saveUser = ref({...user.value}) // 个人信息备份，用于修改时输入框显示
      const userAdmin = ref({NewPassword: '', OldPassword: '', number: user.value.number}) // 个人密码表单

      // 修改个人信息
      const updateUserInfo = async() => {
        loading.value = true // 开启 loading
        const result = await UpdateInfo(saveUser.value)
        // 修改成功则退出修改状态，并提示成功信息，否则提示错误信息
        if (result.status === 0) {
          edit.value = false // 退出编辑状态
          loading.value = false // 关闭 loading
          store.dispatch('handlerUser', result.data) // 更新 vuex 里面的用户信息
          myMessage('success', result.msg, 1200)
        } else {
          myMessage('error', result.msg || '修改失败', 1200)
        }
      }
      // 修改密码
      const updateUserPassword = async() => {
        loading.value = true // 开启 loading
        const result = await UpdatePassword(userAdmin.value)
        // 修改成功提示成功信息，否则提示错误信息
        if (result.status === 0) {
          loading.value = false // 关闭 loading
          userAdmin.value.NewPassword = ''
          userAdmin.value.OldPassword = ''
          myMessage('success', result.msg, 1200)
        } else {
          myMessage('error', result.msg || '修改失败', 1200)
        }
      }
      // 通过用户 number 获取用户信息
      const getUser = async (number: string) => {
        const result = await GetUserInfo({number})
        // 获取到数据则更新 vuex 的用户数据，否则提示错误信息
        if (result.status === 0) {
          store.dispatch('handlerUser', result.data)
        } else {
          myMessage('error', result.msg, 1200)
        }
      }
      // 头像上传前的处理
      const handleUpload = (file: any) => {
        avatarUrl.value = URL.createObjectURL(file.raw)
        saveUser.value.avatar = file.raw
      }

      watchEffect(async () => {
        const {avatar} = user.value
        avatarUrl.value = avatar
      })
      // 监视是否进行修改信息，若修改则更新数据 saveUser 用于保存修改信息
      watch(
        edit,
        newValue => {
          if (newValue) {
            saveUser.value = {...user.value}
          }
        }
      )

      getUser(user.value.number) // 获取用户信息

      return {
        user,
        avatarUrl,
        edit,
        saveUser,
        userAdmin,
        updateUserInfo,
        updateUserPassword,
        handleUpload
      }
    }
  })
</script>

<style lang="less">
  @import "../../../assets/css/mutations";
  @import "../../../assets/css/manage_item";

  // 只有在 pc 端才可以显示 hover 样式
  @media (any-hover: hover) {
    .hc-center{
      .user-header{
        .right{
          // 栏目列表
          .user-menus{
            .user-menus-item{
              &:hover{
                cursor: pointer;
                .user-menus-item-name{
                  color: @font-color-active;
                }
              }
            }
          }
        }
      }
    }
  }

  .hc-center{
    // 顶部样式
    .user-header{
      display: flex;
      justify-content: left;

      .left{
        // 头像上传样式
        .avatar-uploader .el-upload {
          margin: @margin-big;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 100%;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }
        .avatar {
          width: 120px;
          height: 120px;
          display: block;
        }
      }
      .right{
        // 用户名
        .user-name{
          font-size: 26px;
          margin-top: calc(2 * @margin-big);
          margin-bottom: @margin-big;
          font-weight: 500;
        }
        // 栏目列表
        .user-menus{
          display: flex;
          flex-wrap: wrap;
          .user-menus-item{
            display: flex;
            align-items: center;
            margin-top: @margin-medium;
            margin-right: @margin-medium;
            i{
              font-size: 24px;
              margin-right: @margin-small;
            }
            .user-menus-item-name{
              display: inline-block;
              width: 100px;
              color: @font-color-title;
            }
          }
        }
      }
    }
    // 中部基本信息
    .user-body{
      // 板块内容样式
      .user-info-content{
        // 内容展示
        .content-ul{
          @title-width: 90px;
          @font-size: 15px;
          .content-li{
            display: flex;
            margin-bottom: calc(@margin-big + @margin-small);
            font-size: @font-size;
            .content-item-title{
              display: flex;
              justify-content: space-between;
              width: @title-width;
              padding-right: @padding-big;
              color: @font-color-title;
              line-height: 25px;
              box-sizing: border-box;
            }
            .content-item{
              width: calc(100% - @title-width);
              max-width: 800px;
              color: @font-color-base;
              line-height: 25px;
              .el-input{
                width: 220px;
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 768px){
    .hc-center{
      // 顶部样式
      .user-header{
        .left{
          // 头像上传样式
          .user-avator-upload{
            margin: 0;
            .user-avator{
              height: 90px;
              width: 90px;
            }
          }
        }
        .right{
          // 用户名
          .user-name{
            font-size: 20px;
            margin-top: @margin-medium;
            margin-bottom: 0;
          }
          // 栏目列表
          .user-menus{
            .user-menus-item{
              i{
                font-size: 20px;
              }
              .user-menus-item-name{
               font-size: 16px;
              }
            }
          }
        }
      }
      // 中部基本信息
      .user-body{
        // 板块内容样式
        .user-info-content{
          .content-ul{
            @title-width: 70px;
            @font-size: 14px;
            .content-li{
              display: flex;
              margin-bottom: @margin-big;
              font-size: @font-size;
              .content-item-title{
                width: @title-width;
                line-height: 22px;
              }
              .content-item{
                width: calc(100% - @title-width);
                line-height: 22px;
              }
            }
          }
        }
      }
    }
  }
</style>
