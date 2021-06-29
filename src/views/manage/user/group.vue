<template>
  <div class="manage-item hc-user-group">
    <div class="manage-item-header">
      <el-form :inline="true" :model="selectForm" class="demo-form-inline">
        <el-form-item label="状态">
          <el-select size="small" clearable v-model="selectForm.groupStatus" placeholder="显示状态">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button icon="el-icon-search" size="small" type="primary" class="pc" @click="getGroups">查询</el-button>
          <el-button size="mini" type="primary" class="mobile-inline" @click="getGroups">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-item-component">
      <div class="manage-item-component-title">
        组别列表
        <el-button icon="el-icon-plus" type="primary" size="mini" class="pc" @click="handlerUpload">新增</el-button>
        <el-button type="primary" size="mini" class="mobile-inline" @click="handlerUpload">新增</el-button>
      </div>
      <div class="manage-item-component-content">
        <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="groups"
            style="width: 100%">
          <el-table-column
              prop="groupName"
              min-width="100"
              label="组别名">
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
              label="拥有方向数"
              min-width="100">
            <template #default="scope">
              <span>{{scope.row.groupName.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="address"
              align="center"
              label="人数"
              min-width="60">
            <template #default="scope">
              <span>{{scope.row.groupName.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="address"
              align="center"
              label="风采"
              min-width="60">
            <template #default="scope">
              <span>{{scope.row.groupName.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="address"
              align="center"
              label="资料"
              min-width="60">
            <template #default="scope">
              <span>{{scope.row.groupName.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="状态"
              min-width="80">
            <template #default="scope">
              <span>{{scope.row.status || '显示'}}</span>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="120">
            <template #default="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row)">查看</el-button>
              <el-button type="text" size="small" class="pc" @click="handlerEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" class="pc" style="color: red;" @click="deleteGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  组别编辑弹窗  -->
    <el-dialog title="编辑组别" v-model="edit" width="500px">
      <el-form :rules="editFormRules" ref="editForm" :model="editFormData" label-width="80px">
        <el-form-item label="组别名" prop="groupName">
          <el-input v-model="editFormData.groupName" placeholder="请输入组别名"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="groupBrief">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入组别简介"
            v-model="editFormData.groupBrief">
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="groupStatus">
          <el-switch v-model="editFormData.groupStatus" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="edit = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="updateGroup">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  组别新增弹窗  -->
    <el-dialog title="新增组别" v-model="upload" width="500px">
      <el-form :rules="uploadFormRules" ref="uploadForm" :model="uploadFormData" label-width="80px">
        <el-form-item label="组别ID" prop="groupId">
          <el-input v-model="uploadFormData.groupId" placeholder="请输入组别ID"></el-input>
        </el-form-item>
        <el-form-item label="组别名" prop="groupName">
          <el-input v-model="uploadFormData.groupName" placeholder="请输入组别名"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="groupBrief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入组别简介"
              v-model="uploadFormData.groupBrief">
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="groupStatus">
          <el-switch v-model="uploadFormData.groupStatus" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="upload = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="insertGroup">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, watch} from 'vue'
  import {useRouter} from 'vue-router'
  import {ElMessageBox} from 'element-plus'
  import {GetAllGroup, UpdateGroup, InsertGroup, DeleteGroup} from '../../../api/types'
  import {myMessage} from '../../../utils/message'

  export default defineComponent({
    name: 'UserGroup',
    setup() {
      const router = useRouter() // 声明路由
      const groups = ref([]) // 组别的所有信息
      const selectForm = ref({groupStatus: 1}) // 筛选条件表单
      const edit = ref(false) // 是否编辑
      const editForm = ref() // 编辑组别表单
      const editFormData = ref({}) // 编辑组别表单的信息
      const editFormRules = ref({
        groupName: [
          { required: true, message: '请输入组别名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        groupBrief: [
          { required: true, message: '请输入组别简介', trigger: 'blur' }
        ]
      }) // 编辑组别表单规则
      const upload = ref(false) // 是否新增组别
      const uploadObj = {groupId: '', groupName: '', groupBrief: '', groupStatus: 1} // 新增组别表单包含的参数
      const uploadForm = ref() // 新增组别表单
      const uploadFormData = ref({...uploadObj}) // 新增组别表单的信息
      const uploadFormRules = ref({
        groupId: [
          { required: true, message: '请输入组别ID', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '请输入组别名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        groupBrief: [
          { required: true, message: '请输入组别简介', trigger: 'blur' }
        ]
      }) // 新增组别表单规则

      // 组件初始化操作
      const init = () => {
        getGroups() // 获取组别列表
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
      // 更新组别信息
      const updateGroup = () => {
        editForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await UpdateGroup(editFormData.value)
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
      const insertGroup = () => {
        uploadForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await InsertGroup(uploadFormData.value)
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
      // 删除组别
      const deleteGroup = (group: any) => {
        ElMessageBox.confirm('确定删除该组别吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {groupId} = group
          const result = await DeleteGroup({groupId})
          if (result.status === 0) {
            myMessage('success', result.msg, 1200)
            getGroups() // 重新获取组别信息
          } else {
            myMessage('error', result.msg || '删除失败', 1200)
          }
        }).catch(() => {return})
      }
      // 查看组别详情
      const goDetail = (group: any) => {
        const {groupId} = group
        router.push({name: 'user-group-detail', query: {groupId}})
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
      const handlerEdit = (group: any) => {
        edit.value = true
        editFormData.value = {...group}
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
        selectForm,
        groups,
        edit,
        editForm,
        editFormData,
        editFormRules,
        upload,
        uploadForm,
        uploadFormData,
        uploadFormRules,
        getGroups,
        updateGroup,
        insertGroup,
        deleteGroup,
        goDetail,
        handlerEdit,
        handlerUpload
      }
    }
  })
</script>

<style lang="less">
  @import "../../../assets/css/mutations";
  @import "../../../assets/css/manage_item";

  .hc-user-group{

  }
</style>
