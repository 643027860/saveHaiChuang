import axios from 'axios'
import qs from 'qs'

// 允许携带 cookie，解决 IE8 / 9 跨域,
axios.defaults.withCredentials = true

export default function ajax(url: string, data: any, type: string, isQs = false) {
    return new Promise((resolve) => {
        let promise: unknown

        // 参数是否需要序列化
        if (isQs) {
            data = qs.stringify(data)
        }
        if (type === 'GET') {
            url += '?' + data
            promise = axios.get(url)
        } else if (type === 'POST') {
            promise = axios.post(url, data)
        } else if (type === 'PUT') {
            promise = axios.put(url, data)
        } else if (type === 'DELETE') {
            promise = axios.delete(url, {params: data})
        }
        (promise as Promise<any>).then(response => {
            resolve(response.data)
        }).catch(error => {
            resolve(error.response)
            // 失败了调用reject(error)
        })
    })
}

