/** axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import QS from 'qs'
// import store from '../store/index'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'http://api.123dailu.com/'
}

// 请求超时时间
axios.defaults.timeout = 10000

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
    config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = token && (config.headers.Authorization = token)
        return config
    }, error => Promise.error(error)
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        }
        return Promise.reject(response)
    },
    // 服务器状态码不是200的情况
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const get = (url, params) => new Promise((resolve, reject) => {
    axios.get(url, {
        params,
    }).then(res => {
        const ds = res.data
        if (ds.resultCode === '1') {
            resolve(ds.resultData)
        } else {
            resolve(ds.resultMsg)
        }
    }).catch(err => {
        reject(err.data)
    })
})

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const post = (url, params) => new Promise((resolve, reject) => {
    debugger
    axios.post(url, QS.stringify(params)).then(res => {
        const ds = res.data
        if (ds.resultCode === '1') {
            resolve(ds.resultData)
        } else {
            resolve(ds.resultMsg)
        }
    }).catch(err => {
        reject(err)
    })
})

/**
 * POST方法封装（文件上传）
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {String} headers [设置请求headers]
 */
export const uploadFile = (url, params, headers) => new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params), headers).then(res => {
        const ds = res.data
        if (ds.resultCode === '1') {
            resolve(ds.resultData)
        } else {
            resolve(ds.resultMsg)
        }
    }).catch(err => {
        reject(err.data)
    })
})