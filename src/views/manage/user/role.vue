<template>
  <div class="manage-item hc-user-role">
    <div class="manage-item-component">
      <div class="manage-item-component-title">
        角色列表
        <el-button icon="el-icon-plus" type="primary" size="mini" class="pc" @click="handlerUpload">新增</el-button>
        <el-button type="primary" size="mini" class="mobile-inline" @click="handlerUpload">新增</el-button>
      </div>
      <div class="manage-item-component-content">
        <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="roles"
            style="width: 100%">
          <el-table-column
              prop="name"
              min-width="100"
              label="角色名称">
          </el-table-column>
          <el-table-column
              prop="had"
              min-width="100"
              label="拥有权限">
          </el-table-column>
          <el-table-column
              prop="brief"
              min-width="100"
              label="描述">
          </el-table-column>
          <el-table-column
              prop="date"
              min-width="100"
              label="创建时间">
          </el-table-column>
          <el-table-column
              min-width="50"
              label="状态">
            <template #default="scope">
              <el-tag size="small" type="success" v-if="scope.row.status">启用</el-tag>
              <el-tag size="small" type="danger" v-else>弃用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="120">
            <template #default="scope">
              <el-button type="text" size="small" class="pc" @click="handlerEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" style="color: red;" @click="deleteRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  成员编辑弹窗  -->
    <el-dialog title="编辑角色" v-model="edit" width="500px">
      <el-form :rules="editFormRules" ref="editForm" :model="editFormData" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="editFormData.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="brief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4}"
              placeholder="请输入角色描述"
              v-model="editFormData.brief">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
              v-model="editFormData.status"
              :active-value="1"
              :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="权限" prop="jurisdictions">
          <el-tree
              v-model="editFormData.jurisdictions"
              :data="jurisdictions"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[5]">
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="edit = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="updateRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  成员新增弹窗  -->
    <el-dialog title="新增角色" v-model="upload" width="500px">
      <el-form :rules="uploadFormRules" ref="uploadForm" :model="uploadFormData" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="uploadFormData.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="brief">
          <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4}"
              placeholder="请输入角色描述"
              v-model="uploadFormData.brief">
          </el-input>
        </el-form-item>
        <el-form-item label="权限" prop="jurisdictions">
          <el-tree
              v-model="uploadFormData.jurisdictions"
              :data="jurisdictions"
              show-checkbox
              node-key="id"
              :default-checked-keys="[5]">
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="upload = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="insertRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, watch} from 'vue'
  import {GetAllGroup} from '../../../api/types'
  import {ElMessageBox} from 'element-plus'
  import {myMessage} from '../../../utils/message'

  export default defineComponent({
    name: 'UserList',
    setup() {
      const roleData = [
        {
          name: '超级管理员',
          had: '全部权限',
          brief: '拥有系统全部权限',
          date: '2021-05-28',
          status: 1
        },
        {
          name: '队长',
          had: '部分权限',
          brief: '拥有系统部分权限',
          date: '2021-05-28',
          status: 1
        },
        {
          name: '副队长',
          had: '部分权限',
          brief: '拥有系统部分权限',
          date: '2021-05-28',
          status: 0
        },
        {
          name: '深度学习组长',
          had: '部分权限',
          brief: '拥有系统部分权限',
          date: '2021-05-28',
          status: 0
        },
        {
          name: '软件组长',
          had: '部分权限',
          brief: '拥有系统部分权限',
          date: '2021-05-28',
          status: 1
        },
        {
          name: '硬件组长',
          had: '部分权限',
          brief: '拥有系统部分权限',
          date: '2021-05-28',
          status: 1
        },
        {
          name: '成员',
          had: '部分权限',
          brief: '拥有系统部分权限',
          date: '2021-05-28',
          status: 1
        }
      ]
      const roles = ref(roleData) // 角色的所有信息
      const jurisdictions = ref([
        {
          id: 1,
          label: '风采管理',
          children: [
            {
              id: 2,
              label: '风采列表',
            },
            {
              id: 3,
              label: '风采发布',
            }
          ]
        },
        {
          id: 4,
          label: '资料管理',
          children: [
            {
              id: 5,
              label: '资料列表',
            },
            {
              id: 6,
              label: '资料发布',
            }
          ]
        },
        {
          id: 7,
          label: '用户管理',
          children: [
            {
              id: 8,
              label: '用户列表',
            },
            {
              id: 9,
              label: '用户创建',
            }
          ]
        },
        {
          id: 10,
          label: '组别管理',
          children: [
            {
              id: 11,
              label: '组别列表',
            },
            {
              id: 12,
              label: '组别创建',
            }
          ]
        },
        {
          id: 13,
          label: '方向管理',
          children: [
            {
              id: 14,
              label: '方向列表',
            },
            {
              id: 15,
              label: '方向创建',
            }
          ]
        }
      ]) // 所有权限
      const Obj = {name: [], had: '', brief: '', date: '', status: '1', jurisdictions: []} // 弹窗表单包含的参数
      const edit = ref(false) // 是否编辑
      const editForm = ref() // 编辑表单
      const editFormData = ref({...Obj}) // 编辑表单的信息
      const editFormRules = ref({
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }) // 编辑表单规则
      const upload = ref(false) // 是否新增
      const uploadForm = ref() // 新增表单
      const uploadFormData = ref({...Obj}) // 新增表单的信息
      const uploadFormRules = ref({
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }) // 新增表单规则

      // 初始化操作
      const init = () => {
        getRoles() // 获取角色信息
      }
      // 获取角色信息
      const getRoles = async () => {
        const result = await GetAllGroup()
        if (result.status === 0) {
          console.log('请求成功')
        } else {
          myMessage('error', result.msg, 1200)
        }
      }
      // 更新删除信息
      const updateRole = () => {
        editForm.value.validate(async(valid: any) => {
          if (valid) {
            console.log(editFormData.value.jurisdictions)
            const result = await GetAllGroup()
            if (result.status === 0) {
              edit.value = false
              myMessage('success', result.msg, 1200)
              getRoles() // 重新获取成员列表
            } else {
              myMessage('error', result.msg || '修改失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 新增删除信息
      const insertRole = () => {
        uploadForm.value.validate(async(valid: any) => {
          if (valid) {
            console.log(uploadFormData.value)
            const result = await GetAllGroup()
            if (result.status === 0) {
              upload.value = false
              myMessage('success', result.msg, 1200)
              getRoles() // 重新获取成员列表
            } else {
              myMessage('error', result.msg || '新增失败', 1200)
            }
          } else {
            return false
          }
        })
      }
      // 删除角色
      const deleteRole = (user: any) => {
        ElMessageBox.confirm('确定删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const {number} = user
          console.log(number)
          const result = await GetAllGroup()
          if (result.status === 0) {
            myMessage('success', result.msg, 1200)
            getRoles() // 重新获取成员列表
          } else {
            myMessage('error', result.msg, 1200)
          }
        }).catch(() => {return})
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
        user.jurisdictions = []
        editFormData.value = {...user}
      }
      // 开始新增成员
      const handlerUpload = () => {
        upload.value = true
        uploadFormData.value = {...Obj}
      }

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
        roles,
        jurisdictions,
        edit,
        editForm,
        editFormData,
        editFormRules,
        upload,
        uploadForm,
        uploadFormData,
        uploadFormRules,
        updateRole,
        insertRole,
        deleteRole,
        handlerEdit,
        handlerUpload
      }
    }
  })
</script>

<style lang="less">
  @import "../../../assets/css/mutations";
  @import "../../../assets/css/manage_item";

  .hc-user-role{
  }
</style>
