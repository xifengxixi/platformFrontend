import axios from 'axios'
import config from '@/config/config'

//创建拦截器
const http = axios.create({
    baseURL: config.baseURL,
    validateStatus: function (status) {
        return true
    }
})

//添加请求拦截器
http.interceptors.request.use(function (config) {
    //在发送请求前需要做什么处理
    if (config.url === '/login/'){
        return
    }
    else {
        const token = window.sessionStorage.getItem('token')
        if (token){
            config.headers['Authorization'] = token
        }
    }
    return config
},function (error) {
    //对请求错误做些什么
    return Promise.reject(error)
})


//添加响应拦截器
http.interceptors.response.use(function (response){
    //对相应数据做什么
    return response
},function (error){
    //对相应错误做什么
    return Promise.reject(error)
})

export default http