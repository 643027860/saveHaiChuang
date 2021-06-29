<template>
  <div class="manage-item hc-user-direction">
    <div class="manage-item-component">
      <div class="manage-item-component-content">
        《背影》是现代作家朱自清（1898-1948）于1925年所写的一篇回忆性散文。这篇散文叙述的是作者离开南京到北京大学，父亲送他到浦口火车站，照料他上车，并替他买橘子的情形。在作者脑海里印象最深刻的，是他父亲替他买橘子时在月台爬上攀下时的背影。作者用朴素的文字，把父亲对儿女的爱，表达得深刻细腻，真挚感动，从平凡的事件中，呈现出父亲的关怀和爱护。（概述图来源于 [1]  ）
      </div>
    </div>
    <div class="manage-item-component">
      <div class="manage-item-component-title">
        拥有方向
        <el-button icon="el-icon-plus" type="primary" size="mini" class="pc" @click="handlerUpload">新增</el-button>
        <el-button type="primary" size="mini" class="mobile-inline" @click="handlerUpload">新增</el-button>
      </div>
      <div class="manage-item-component-content">
        <el-table
            :data="detail"
            style="width: 100%">
          <el-table-column
              prop="directiorName"
              min-width="100"
              label="方向">
          </el-table-column>
          <el-table-column
              label="日期"
              min-width="120">
            <template #default>
              <span>2021-05-23</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="人数"
              min-width="100">
            <template #default="scope">
              <span>{{scope.row.directiorName.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="120">
            <template #default="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row)">查看</el-button>
              <el-button type="text" size="small" class="pc" @click="handlerEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  方向编辑弹窗  -->
    <el-dialog title="编辑方向" v-model="edit" width="500px">
      <el-form :rules="editFormRules" ref="editForm" :model="editFormData" label-width="70px">
        <el-form-item label="方向名" prop="directiorName">
          <el-input v-model="editFormData.directiorName" placeholder="请输入方向名"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="directiorBrief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入方向简介"
              v-model="editFormData.directiorBrief">
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="directiorStatus">
          <el-switch v-model="editFormData.directiorStatus" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="edit = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="updateDir">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  方向新增弹窗  -->
    <el-dialog title="新增方向" v-model="upload" width="500px">
      <el-form :rules="uploadFormRules" ref="uploadForm" :model="uploadFormData" label-width="70px">
        <el-form-item label="方向ID" prop="directiorId">
          <el-input v-model="uploadFormData.directiorId" placeholder="请输入方向ID"></el-input>
        </el-form-item>
        <el-form-item label="方向名" prop="directiorName">
          <el-input v-model="uploadFormData.directiorName" placeholder="请输入方向名"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="directiorBrief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入方向简介"
              v-model="uploadFormData.directiorBrief">
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="directiorStatus">
          <el-switch v-model="uploadFormData.directiorStatus" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="upload = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="insertDir">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, watch} from 'vue'
  import {useRoute, useRouter} from 'vue-router'
  import {GetAllDirById, UpdateDir, InsertDir, GetAllGroup} from '../../../api/types'
  import {myMessage} from '../../../utils/message'

  export default defineComponent({
    name: 'UserGroupDetail',
    // 路由导航，如果没传入组别 id 则重定向组别列表
    beforeRouteEnter(to, from, next) {
      if (to.query.groupId) {
        next()
      } else {
        next({name: 'user-group'})
      }
    },
    setup() {
      const router = useRouter() // 声明路由
      const route = useRoute() // 声明路由
      const groupId = route.query.groupId // 组别 id
      const groups = ref([]) // 组别列表
      const detail = ref() // 详细信息
      const edit = ref(false) // 是否编辑
      const editForm = ref() // 编辑方向表单
      const editFormData = ref({}) // 编辑方向表单的信息
      const editFormRules = ref({
        directionName: [
          { required: true, message: '请输入方向名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        directionBrief: [
          { required: true, message: '请输入方向简介', trigger: 'blur' }
        ]
      }) // 编辑方向表单规则
      const upload = ref(false) // 是否新增方向
      const uploadObj = {groupId, directionId: '', directionName : '', directionBrief: '', directionStatus: 1} // 新增方向表单包含的参数
      const uploadForm = ref() // 新增方向表单
      const uploadFormData = ref({...uploadObj}) // 新增方向表单的信息
      const uploadFormRules = ref({
        directionId: [
          { required: true, message: '请输入组别ID', trigger: 'blur' }
        ],
        directionName: [
          { required: true, message: '请输入方向名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        directionBrief: [
          { required: true, message: '请输入方向简介', trigger: 'blur' }
        ]
      }) // 新增方向表单规则

      // 组件初始化操作
      const init = () => {
        getGroups() // 获取组别列表
        getDetail() // 获取组别详细信息
      }
      // 获取组别列表
      const getGroups = async() => {
        const result = await GetAllGroup()
        if (result.status === 0) {
          groups.value = result.data
        } else {
          myMessage('error', result.msg || '获取失败', 1200)
        }
      }
      // 获取组别详细信息
      const getDetail = async() => {
        const result = await GetAllDirById({groupId})
        if (result.status === 0) {
          detail.value = result.data
        } else {
          myMessage('error', result.msg || '获取失败', 1200)
        }
      }
      // 更新组别信息
      const updateDir = () => {
        editForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await UpdateDir(editFormData.value)
            if (result.status === 0) {
              edit.value = false
              myMessage('success', result.msg, 1200)
              getGroups() // 重新获取组别信息
            } else {
              myMessage('error', result.msg || '修改失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 新增组别信息
      const insertDir = () => {
        uploadForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await InsertDir(uploadFormData.value)
            if (result.status === 0) {
              upload.value = false
              myMessage('success', result.msg, 1200)
              getGroups() // 重新获取组别信息
            } else {
              myMessage('error', result.msg || '新增失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 查看方向详情
      const goDetail = (directon: any) => {
        const {directonId} = directon
        router.push({name: 'user-direction-detail', query: {directonId}})
      }
      // 重置表单
      const resetForm = (formName: string) => {
        if (formName === 'uploadForm') {
          upload.value = false
          uploadForm.value.resetFields()
        } else if (formName === 'editForm') {
          edit.value = false
          editForm.value.resetFields()
        }
      }
      // 开始编辑组别
      const handlerEdit = (direction: any) => {
        edit.value = true
        editFormData.value = {...direction}
      }
      // 开始新增组别
      const handlerUpload = () => {
        upload.value = true
        uploadFormData.value = {...uploadObj}
      }

      // 监听是否关闭弹窗，一关闭就清空两个表单的验证规则
      watch(
          edit,
          newValue => {
            if (!newValue) {
              resetForm('editForm')
            }
          }
      )
      watch(
          upload,
          newValue => {
            if (!newValue) {
              resetForm('uploadForm')
            }
          }
      )

      init() // 初始化

      return {
        detail,
        groups,
        edit,
        editForm,
        editFormData,
        editFormRules,
        upload,
        uploadForm,
        uploadFormData,
        uploadFormRules,
        updateDir,
        insertDir,
        goDetail,
        handlerEdit,
        handlerUpload
      }
    }
  })
</script>

<style lang="less" scoped>
  @import "../../../assets/css/mutations";
  @import "../../../assets/css/manage_item";
  .hc-user-direction{
    .hc-user-direction-content{

    }
  }
</style>
