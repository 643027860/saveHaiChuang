<template>
  <div class="manage-item hc-user-direction">
    <div class="manage-item-header">
      <el-form :inline="true" :model="selectForm" class="demo-form-inline">
        <el-form-item label="组别">
          <el-select size="small" clearable v-model="selectForm.groupId" placeholder="所属组别">
            <el-option :label="item.groupName" :value="item.groupId" v-for="item in groups" :key="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" clearable v-model="selectForm.directionStatus" placeholder="显示状态">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button icon="el-icon-search" size="small" type="primary" class="pc" @click="getDirections">查询</el-button>
          <el-button size="mini" type="primary" class="mobile-inline" @click="getDirections">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-item-component">
      <div class="manage-item-component-title">
        拥有方向
        <el-button icon="el-icon-plus" type="primary" size="mini" class="pc" @click="handlerUpload">新增</el-button>
        <el-button type="primary" size="mini" class="mobile-inline" @click="handlerUpload">新增</el-button>
      </div>
      <div class="manage-item-component-content">
        <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="directions"
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
              <el-button type="text" size="small" style="color: red;" @click="deleteGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  方向编辑弹窗  -->
    <el-dialog title="编辑方向" v-model="edit" width="500px">
      <el-form :rules="editFormRules" ref="editForm" :model="editFormData" label-width="80px">
        <el-form-item label="方向名" prop="directionName">
          <el-input v-model="editFormData.directiorName" placeholder="请输入方向名"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="directionBrief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入方向简介"
              v-model="editFormData.directiorBrief">
          </el-input>
        </el-form-item>
        <el-form-item label="组别" prop="groupId">
          <el-select v-model="editFormData.groupId" placeholder="所属组别">
            <el-option :label="item.groupName" :value="item.groupId" v-for="item in groups" :key="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="directionStatus">
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
      <el-form :rules="uploadFormRules" ref="uploadForm" :model="uploadFormData" label-width="80px">
        <el-form-item label="方向ID" prop="directionId">
          <el-input v-model="uploadFormData.directiorId" placeholder="请输入方向ID"></el-input>
        </el-form-item>
        <el-form-item label="方向名" prop="directionName">
          <el-input v-model="uploadFormData.directiorName" placeholder="请输入方向名"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="directionBrief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入方向简介"
              v-model="uploadFormData.directiorBrief">
          </el-input>
        </el-form-item>
        <el-form-item label="组别" prop="groupId">
          <el-select v-model="uploadFormData.groupId" placeholder="所属组别">
            <el-option :label="item.groupName" :value="item.groupId" v-for="item in groups" :key="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="directionStatus">
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
  import {useRouter} from 'vue-router'
  import {ElMessageBox} from 'element-plus'
  import {GetAllGroup, GetAllDir, GetAllDirById, UpdateDir, InsertDir, DeleteDir} from '../../../api/types'
  import {myMessage} from '../../../utils/message'

  export default defineComponent({
    name: 'UserDirection',
    setup() {
      const router = useRouter() // 声明路由
      const groups = ref([]) // 组别信息
      const directions = ref() // 方向信息
      const selectForm = ref({groupId: '', directionStatus: 1}) // 筛选条件表单
      const edit = ref(false) // 是否编辑
      const editForm = ref() // 编辑方向表单
      const editFormData = ref({}) // 编辑方向表单的信息
      const editFormRules = ref({
        groupId: [
          { required: true, message: '请选择组别ID', trigger: 'blur' }
        ],
        directionName: [
          { required: true, message: '请输入方向名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        directionBrief: [
          { required: true, message: '请输入方向简介', trigger: 'blur' }
        ]
      }) // 编辑方向表单规则
      const upload = ref(false) // 是否新增方向
      const uploadObj = {groupId: '', directionId: '', directionName : '', directionBrief: '', directionStatus: 1} // 新增方向表单包含的参数
      const uploadForm = ref() // 新增方向表单
      const uploadFormData = ref({...uploadObj}) // 新增方向表单的信息
      const uploadFormRules = ref({
        groupId: [
          { required: true, message: '请选择组别ID', trigger: 'blur' }
        ],
        directionId: [
          { required: true, message: '请输入方向ID', trigger: 'blur' }
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
        getDirections() // 获取对应方向列表
      }
      // 获取组别列表信息
      const getGroups = async () => {
        const result = await GetAllGroup()
        if (result.status === 0) {
          groups.value = result.data
        } else {
          myMessage('error', result.msg || '获取组别信息失败', 1200)
        }
      }
      // 获取方向列表信息
      const getDirections = async() => {
        const {groupId} = selectForm.value
        // 有选择组别ID则根据组别ID获取方向列表，反之获取全部方向列表
        const result = groupId ? await GetAllDirById({groupId}) : await GetAllDir()
        if (result.status === 0) {
          directions.value = result.data
        } else {
          myMessage('error', result.msg || '获取方向信息失败', 1200)
        }
      }
      // 更新方向信息
      const updateDir = () => {
        editForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await UpdateDir(editFormData.value)
            if (result.status === 0) {
              edit.value = false
              myMessage('success', result.msg, 1200)
              getDirections() // 重新获取方向信息
            } else {
              myMessage('error', result.msg || '修改失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 新增方向信息
      const insertDir = () => {
        uploadForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await InsertDir(uploadFormData.value)
            if (result.status === 0) {
              upload.value = false
              myMessage('success', result.msg, 1200)
              getDirections() // 重新获取方向信息
            } else {
              myMessage('error', result.msg || '新增失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 删除组别
      const deleteGroup = async (direction: any) => {
        ElMessageBox.confirm('确定删除该方向吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {directonId} = direction
          const result = await DeleteDir({directonId})
          if (result.status === 0) {
            myMessage('success', result.msg, 1200)
            getDirections() // 重新获取方向信息
          } else {
            myMessage('error', result.msg || '删除失败', 1200)
          }
        }).catch(() => {return})
      }
      // 查看方向详情
      const goDetail = (direction: any) => {
        const {directionId} = direction
        router.push({name: 'user-direction-detail', query: {directionId}})
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
        selectForm,
        directions,
        groups,
        edit,
        editForm,
        editFormData,
        editFormRules,
        upload,
        uploadForm,
        uploadFormData,
        uploadFormRules,
        getDirections,
        updateDir,
        insertDir,
        deleteGroup,
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
