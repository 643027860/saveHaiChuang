/*
* 自我封装功能函数之
*   用 Element-plus 中的 message 组件提示消息
* */
import {ElMessage} from 'element-plus'

type myType = 'error' | 'success' | 'warning' // type 的类型限制

export const myMessage = (type: myType, message: string, duration: number) => {
  ElMessage({
    type,
    message,
    duration
  })
}
