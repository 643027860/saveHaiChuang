/* 专门用于在 session 中存取数据 */

// 更新用户登录信息
export const setUser = (user: any) => {
  const expire = new Date().getTime() + 1000 * 60 * 60 * 6 // 设置过期时间为 6h
  sessionStorage.setItem('hc-manage-user', JSON.stringify({user, expire}))
}
// 获取用户登录信息
export const getUser = () => {
  return JSON.parse(sessionStorage.getItem('hc-manage-user') || '{}')
}



// 更新顶部任务栏
export const setNavMenus = (newNavMenus: any) => {
  sessionStorage.setItem('hc-manage-navMenus', JSON.stringify(newNavMenus))
}
// 获取顶部任务栏数据
export const getNavMenus = () => {
  return JSON.parse(sessionStorage.getItem('hc-manage-navMenus') || '[]')
}
