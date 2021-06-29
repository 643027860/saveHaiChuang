<template>
  <div class="manage-item hc-mien-publish">
    <div class="manage-item-component">
      <div class="manage-item-component-title">
        风采发布
        <el-button icon="el-icon-edit" type="primary" size="mini" v-if="show" @click="show = false">编辑</el-button>
        <el-button icon="el-icon-view" size="mini" v-else @click="show = true">预览</el-button>
      </div>
      <div class="manage-item-component-content" v-if="!show">
        <el-form :rules="editFormRules" ref="editForm" :model="editFormData" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="editFormData.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="组别" prop="groupId">
            <el-select v-model="editFormData.groupId" placeholder="请选择组别" :disabled="user.role === 0">
              <el-option
                  v-for="item in groups"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item.groupId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属方向" prop="directionId">
            <el-select v-model="editFormData.directionId" placeholder="请选择方向">
              <el-option
                  v-for="item in directions"
                  :key="item.directionId"
                  :label="item.directiorName"
                  :value="item.directionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简介" prop="brief">
            <el-input
                type="textarea"
                :rows="3"
                maxlength="120"
                show-word-limit
                placeholder="请输入简介"
                v-model="editFormData.brief">
            </el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action="#"
                :on-change="handleUpload"
                :auto-upload="false"
                accept="image/*">
              <img v-if="coverUrl" :src="coverUrl" alt="" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容" prop="content">
          </el-form-item>
        </el-form>
        <div class="manage-item-option-button">
          <el-button type="primary" round size="small" @click="submitForm">发布</el-button>
          <el-button round size="small" @click="resetForm">重置</el-button>
        </div>
      </div>
      <div class="manage-item-component-content" v-else>
        hhh
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed, ref, watchEffect} from 'vue'
  import {useStore} from 'vuex'
  import {useRouter, onBeforeRouteLeave} from 'vue-router'
  import {ElMessageBox} from 'element-plus'
  import {GetAllGroup, GetAllDirById} from '../../../api/types'
  import {myMessage} from '../../../utils/message'

  export default defineComponent({
    name: 'MienPublish',
    setup() {
      const store = useStore()
      const router = useRouter() // 声明路由
      const groups = ref([]) // 组别的所有信息
      const directions = ref([]) // 方向的所有信息
      const user = computed(() => {
        return store.state.user
      }) // 用户信息
      const coverUrl = ref('') // 封面的预览地址
      const Obj = {groupId: '', directionId: '', brief: '', title: '', content: '', cover: ''} // 表单包含的参数
      const show = ref(false) // 是否预览状态
      const edit = ref(false) // 是否编辑状态
      const editForm = ref() // 编辑表单
      const editFormData = ref({...Obj}) // 编辑表单的信息
      const editFormRules = ref({
        groupId: [
          { required: true, message: '请选择组别', trigger: 'blur' }
        ],
        directionId: [
          { required: true, message: '请选择方向', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入简介', trigger: 'blur' },
          { max: 120, message: '长度在 120 个字符以内', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请上传封面', trigger: 'blur' }
        ]
      }) // 编辑表单规则

      // 初始化操作
      const init = () => {
        getGroups() // 获取组别信息
      }
      // 获取组别信息
      const getGroups = async () => {
        const result = await GetAllGroup()
        if (result.status === 0) {
          groups.value = result.data
        } else {
          myMessage('error', result.msg, 1200)
        }
      }
      // 根据组别ID获取方向信息
      const getDirectionById = async (groupId: string) => {
        const result = await GetAllDirById({groupId})
        if (result.status === 0) {
          return result.data
        } else {
          myMessage('error', result.msg, 1200)
          return []
        }
      }
      // 上传图片前的处理
      const handleUpload = (file: any) => {
        coverUrl.value = URL.createObjectURL(file.raw)
        editFormData.value.cover = file.raw
      }
      // 提交表单
      const submitForm = () => {
        const {title, brief, cover, content, groupId, directionId} = editFormData.value
        console.log(title)
        console.log(brief)
        console.log(cover)
        console.log(content)
        console.log(groupId)
        console.log(directionId)
      }
      // 重置表单
      const resetForm = () => {
        const {groupId} = user.value
        editFormData.value = {...Obj}
        editFormData.value.groupId = groupId
        editForm.value.resetFields()
      }

      // 监听筛选表单的联动信息
      // 组别的ID一变化则更新方向数据以及选中方向id
      watchEffect(async () => {
        const {groupId} = user.value
        if (groupId) {
          editFormData.value.groupId = groupId
        }
      })
      watchEffect(async () => {
        const {groupId} = editFormData.value
        if (groupId) {
          directions.value = await getDirectionById(groupId)
          editFormData.value.directionId = ''
        }
      })

      // 离开前提示用户内容不会保存
      onBeforeRouteLeave((to, form, next) => {
        ElMessageBox.confirm('内容将不会保存，确定离开吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next()
        }).catch(() => {return})
      })

      init() // 初始化

      return {
        user,
        groups,
        directions,
        coverUrl,
        edit,
        editForm,
        editFormData,
        editFormRules,
        show,
        submitForm,
        handleUpload,
        resetForm
      }
    }
  })
</script>

<style lang="less">
  @import "../../../assets/css/mutations";
  @import "../../../assets/css/manage_item";

  .hc-mien-publish{
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }
    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }
</style>
