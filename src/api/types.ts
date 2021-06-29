import ajax from './ajax'

const baseUrl = 'http://124.70.40.181:8081' // 基本请求地址

// 登录表单数据接口
interface intLogin {
  number: string,
  password: string
}
// 注册表单数据接口
interface intRegister {
  number: string,
  groupId: string,
  directionId: string,
  name: string,
  year: string
}

/* 用户接口 */
// 登录
export const Login = (data: intLogin): Promise<any> => ajax(baseUrl + '/user/login.do', data, 'POST', true)
// 注册
export const Register = (data: any): Promise<any> => ajax(baseUrl + '/user/register.do', data, 'POST', true)
// 修改密码
export const UpdatePassword = (data: unknown): Promise<any> => ajax(baseUrl + '/member/updatePassword.do', data, 'POST', true)

/* 成员信息接口 */
// 查看个人信息
export const GetUserInfo = (data: unknown): Promise<any> => ajax(baseUrl + '/member/selectMember.do', data, 'POST', true)
// 修改个人信息
export const UpdateInfo = (data: unknown): Promise<any> => ajax(baseUrl + '/member/updateMember.do', data, 'POST', true)
// 删除某一个成员
export const DeleteUser = (data: unknown): Promise<any> => ajax(baseUrl + '/member/deleteMember.do', data, 'POST', true)
// 获取全体成员
export const GetAllUsers = (): Promise<any> => ajax(baseUrl + '/member/allMember.do', {}, 'POST', true)
// 根据组别查找该组别的全体成员
export const GetUsersByGroupId = (data: unknown): Promise<any> => ajax(baseUrl + '/member/selectByGroup.do', data, 'POST', true)
// 根据方向查找该方向的全体成员
export const GetUsersByDirectionId = (data: unknown): Promise<any> => ajax(baseUrl + '/member/selectByDirection.do', data, 'POST', true)
// 更新成员的组别方向以及第几届
export const UpdateUserMessage = (data: unknown): Promise<any> => ajax(baseUrl + '/member/updateMessage.do', data, 'POST', true)
// 更新成员的权限以及实验室的状态
export const UpdateUserState = (data: unknown): Promise<any> => ajax(baseUrl + '/member/updateState.do', data, 'POST', true)

/* 组别、方向接口 */
// 获取所有组别
export const GetAllGroup = (): Promise<any> => ajax(baseUrl + '/message/Get_AllGroup.do', {}, 'GET', true)
// 获取所有方向
export const GetAllDir = (): Promise<any> => ajax(baseUrl + '/message/Get_AllDir.do', {}, 'GET', true)
// 创建新的组别
export const InsertGroup = (data: unknown): Promise<any> => ajax(baseUrl + '/message/insertGroup.do', data, 'POST', true)
// 创建新的方向
export const InsertDir = (data: unknown): Promise<any> => ajax(baseUrl + '/message/insertDirection.do', data, 'POST', true)
// 修改组别的名字
export const UpdateGroup = (data: unknown): Promise<any> => ajax(baseUrl + '/message/updateGroup.do', data, 'POST', true)
// 修改方向的名字
export const UpdateDir = (data: unknown): Promise<any> => ajax(baseUrl + '/message/updateDirection.do', data, 'POST', true)
// 删除组别
export const DeleteGroup = (data: unknown): Promise<any> => ajax(baseUrl + '/message/deleteGroup.do', data, 'POST', true)
// 删除方向
export const DeleteDir = (data: unknown): Promise<any> => ajax(baseUrl + '/message/deleteDirection.do', data, 'POST', true)
// 根据组别的 id 获取其下所有方向信息
export const GetAllDirById = (data: unknown): Promise<any> => ajax(baseUrl + '/message/DirByGoupId.do', data, 'POST', true)
