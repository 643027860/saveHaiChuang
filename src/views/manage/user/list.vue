<template>
  <div class="manage-item hc-user-list">
    <div class="manage-item-header">
      <el-form :inline="true" :model="selectForm" class="demo-form-inline">
        <el-form-item label="组别" prop="groupId">
          <el-select size="small" clearable v-model="selectForm.groupId" placeholder="请选择组别">
            <el-option
              v-for="item in groups"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向" prop="directionId">
          <el-select size="small" clearable v-model="selectForm.directionId" placeholder="请选择方向">
            <el-option
              v-for="item in directions"
              :key="item.directionId"
              :label="item.directiorName"
              :value="item.directionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="year">
          <el-input size="small" clearable v-model="selectForm.year" placeholder="请输入第几届，例如2018"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" clearable v-model="selectForm.state" placeholder="状态">
            <el-option
                v-for="item in States"
                :key="item.state"
                :label="item.name"
                :value="item.state">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button icon="el-icon-search" size="small" type="primary" class="pc" @click="getUsers">查询</el-button>
          <el-button size="mini" type="primary" class="mobile-inline" @click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-item-component">
      <div class="manage-item-component-title">
        成员列表
        <el-button icon="el-icon-plus" type="primary" size="mini" class="pc" @click="handlerUpload">新增</el-button>
        <el-button type="primary" size="mini" class="mobile-inline" @click="handlerUpload">新增</el-button>
      </div>
      <div class="manage-item-component-content">
        <el-table
            :data="users"
            style="width: 100%">
          <el-table-column
              width="80"
              label="头像">
            <template #default="scope">
              <el-avatar
                  size="medium"
                  :src="scope.avator ? scope.avator : 'https://i02piccdn.sogoucdn.com/05eec5d546a41b7c'">
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column
              prop="name"
              min-width="100"
              label="姓名">
          </el-table-column>
          <el-table-column
              prop="number"
              min-width="100"
              label="学号">
          </el-table-column>
          <el-table-column
              prop="classmate"
              min-width="100"
              label="班级">
          </el-table-column>
          <el-table-column
              min-width="100"
              label="组别">
            <template #default="scope">
              {{getGroupName(scope.row.groupId)}}
            </template>
          </el-table-column>
          <el-table-column
              min-width="100"
              label="方向">
            <template #default="scope">
              {{getDirectionName(scope.row.directionId)}}
            </template>
          </el-table-column>
          <el-table-column
              min-width="100"
              label="角色">
            <template #default="scope">
              {{getRoleName(scope.row.role)}}
            </template>
          </el-table-column>
          <el-table-column
              min-width="100"
              label="状态">
            <template #default="scope">
              <el-tag size="small" type="success" v-if="scope.row.state">在任</el-tag>
              <el-tag size="small" type="info" v-else>退任</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="120">
            <template #default="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row)">查看</el-button>
              <el-button type="text" size="small" class="pc" @click="handlerEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" style="color: red;" @click="deleteUser(scope.row)">注销</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  成员编辑弹窗  -->
    <el-dialog title="编辑成员" v-model="edit" width="500px">
      <el-form :rules="editFormRules" ref="editForm" :model="editFormData" label-width="80px">
        <el-form-item label="年级" prop="year">
          <el-input v-model="editFormData.year" placeholder="请输入第几届,例如2018"></el-input>
        </el-form-item>
        <el-form-item label="所属组别" prop="groupId">
          <el-select v-model="editFormData.groupId" placeholder="请选择组别">
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
              v-for="item in editFormData.directions"
              :key="item.directionId"
              :label="item.directiorName"
              :value="item.directionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editFormData.role" placeholder="请选择角色">
            <el-option
                v-for="item in Roles"
                :key="item.role"
                :label="item.name"
                :value="item.role">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editFormData.state" placeholder="请选择成员状态">
            <el-option
                v-for="item in States"
                :key="item.state"
                :label="item.name"
                :value="item.state">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="edit = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="updateUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  成员新增弹窗  -->
    <el-dialog title="新增成员" v-model="upload" width="500px">
      <el-form :rules="uploadFormRules" ref="uploadForm" :model="uploadFormData" label-width="80px">
        <el-form-item label="名字" prop="name">
          <el-input v-model="uploadFormData.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="number">
          <el-input v-model="uploadFormData.number" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="year">
          <el-input v-model="uploadFormData.year" placeholder="请输入第几届,例如2018"></el-input>
        </el-form-item>
        <el-form-item label="所属组别" prop="groupId">
          <el-select v-model="uploadFormData.groupId" placeholder="请选择组别">
            <el-option
                v-for="item in groups"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属方向" prop="directionId">
          <el-select v-model="uploadFormData.directionId" placeholder="请选择方向">
            <el-option
              v-for="item in uploadFormData.directions"
              :key="item.directionId"
              :label="item.directiorName"
              :value="item.directionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="uploadFormData.role" placeholder="请选择角色">
            <el-option
                v-for="item in Roles"
                :key="item.role"
                :label="item.name"
                :value="item.role">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="upload = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="insertUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, watch, watchEffect} from 'vue'
  import {useRouter} from 'vue-router'
  import {ElMessageBox} from 'element-plus'
  import {GetAllGroup, GetAllDir, GetAllDirById, Register} from '../../../api/types'
  import {GetAllUsers, GetUsersByGroupId, GetUsersByDirectionId, UpdateUserMessage, DeleteUser} from '../../../api/types'
  import {myMessage} from '../../../utils/message'
  import {States, Roles} from "../../../data/status"

  export default defineComponent({
    name: 'UserList',
    setup() {
      const router = useRouter() // 声明路由
      const groups = ref([]) // 组别的所有信息
      const directions = ref([]) // 方向的所有信息
      const users = ref([]) // 成员列表信息
      const selectForm = ref({groupId: '', directionId: '', year: '', state: ''}) // 筛选条件表单
      const Obj = {directions: [], directionId: '', groupId: '', name: '', number: '', role: '', year: ''} // 弹窗表单包含的参数
      const edit = ref(false) // 是否编辑
      const editForm = ref() // 编辑成员表单
      const editFormData = ref({...Obj}) // 编辑成员表单的信息
      const editFormRules = ref({
        groupId: [
          { required: true, message: '请选择组别', trigger: 'blur' }
        ],
        directionId: [
          { required: true, message: '请选择方向', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '请输入年份', trigger: 'blur' }
        ]
      }) // 编辑成员表单规则
      const upload = ref(false) // 是否新增成员
      const uploadForm = ref() // 新增成员表单
      const uploadFormData = ref({...Obj}) // 新增成员的信息
      const uploadFormRules = ref({
        groupId: [
          { required: true, message: '请选择组别', trigger: 'blur' }
        ],
        directionId: [
          { required: true, message: '请选择方向', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '请输入年份', trigger: 'blur' }
        ]
      }) // 新增成员表单规则

      // 初始化操作
      const init = () => {
        getGroups() // 获取组别信息
        getDirections() // 获取方向信息
        getUsers() // 获取成员列表信息
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
      // 获取全部方向信息
      const getDirections = async () => {
        const result = await GetAllDir()
        if (result.status === 0) {
          directions.value = result.data
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
      // 获取成员列表信息
      const getUsers = async () => {
        const {groupId, directionId, year, state} = selectForm.value
        let result: any
        if (directionId) {
          result = await GetUsersByDirectionId({directionId})
        } else if (groupId) {
          result = await GetUsersByGroupId({groupId})
        } else {
          result = await GetAllUsers()
        }
        if (result.status === 0) {
          users.value = result.data
        } else {
          myMessage('error', result.msg, 1200)
        }
      }
      // 更新成员信息
      const updateUser = () => {
        editForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await UpdateUserMessage(editFormData.value)
            if (result.status === 0) {
              edit.value = false
              myMessage('success', result.msg, 1200)
              getUsers() // 重新获取成员列表
            } else {
              myMessage('error', result.msg || '修改失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 新增成员信息
      const insertUser = () => {
        uploadForm.value.validate(async(valid: any) => {
          if (valid) {
            const result = await Register(uploadFormData.value)
            if (result.status === 0) {
              upload.value = false
              myMessage('success', result.msg, 1200)
              getUsers() // 重新获取成员列表
            } else {
              myMessage('error', result.msg || '新增失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 删除成员
      const deleteUser = (user: any) => {
        ElMessageBox.confirm('确定注销该账户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const {number} = user
          const result = await DeleteUser({number})
          if (result.status === 0) {
            myMessage('success', result.msg, 1200)
            getUsers() // 重新获取成员列表
          } else {
            myMessage('error', result.msg, 1200)
          }
        }).catch(() => {return})
      }
      // 查看成员详情
      const goDetail = (user: any) => {
        const {number} = user
        router.push({name: 'user-detail', query: {number}})
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
      // 开始编辑成员
      const handlerEdit = (user: any) => {
        edit.value = true
        user.directions = []
        editFormData.value = {...user}
      }
      // 开始新增成员
      const handlerUpload = () => {
        upload.value = true
        uploadFormData.value = {...Obj}
      }

      // 获取组名
      const getGroupName = (groupId: string) => {
        let name = ''
        groups.value.map((item: any) => {
          if (item.groupId === groupId) {
            return name =  item.groupName
          }
        })
        return name
      }
      // 获取方向名
      const getDirectionName = (directionId: string) => {
        let name = ''
        directions.value.map((item: any) => {
          if (item.directionId === directionId) {
            return name = item.directionName
          }
        })
        return name
      }
      // 获取角色名
      const getRoleName = (role: string) => {
        let name = ''
        Roles.map((item: any) => {
          if (item.role === role) {
            return name = item.name
          }
        })
        return name
      }

      // 监听筛选表单的联动信息
      // 组别的ID一变化则更新方向数据以及选中方向id
      watchEffect(async () => {
        const {groupId} = selectForm.value
        if (groupId) {
          directions.value = await getDirectionById(groupId)
          selectForm.value.directionId = ''
        }
      })
      watchEffect(async () => {
        const {groupId} = uploadFormData.value
        if (groupId) {
          uploadFormData.value.directions = await getDirectionById(groupId)
          uploadFormData.value.directionId = ''
        }
      })
      watchEffect(async () => {
        const {groupId} = editFormData.value
        if (groupId) {
          editFormData.value.directions = await getDirectionById(groupId)
        }
      })
      // 监听是否关闭弹窗，一关闭就清空两个表单的验证规则
      watch(edit, newValue => {
        if (!newValue) {
          resetForm('editForm')
        }
      })
      watch(upload, newValue => {
        if (!newValue) {
          resetForm('uploadForm')
        }
      })

      init() // 初始化

      return {
        States,
        Roles,
        groups,
        directions,
        users,
        selectForm,
        edit,
        editForm,
        editFormData,
        editFormRules,
        upload,
        uploadForm,
        uploadFormData,
        uploadFormRules,
        getGroups,
        getDirections,
        getUsers,
        updateUser,
        insertUser,
        deleteUser,
        goDetail,
        handlerEdit,
        handlerUpload,
        getGroupName,
        getDirectionName,
        getRoleName
      }
    }
  })
</script>

<style lang="less">
  @import "../../../assets/css/mutations";
  @import "../../../assets/css/manage_item";

  .hc-user-list{
  }
</style>
