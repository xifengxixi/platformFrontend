import http from '@/utils/requests'


export default{

    // 登录
    login(params) {
        return http.post(`/user/login/`, params)
    },

    // 注册
    register(params) {
        return http.post(`/user/register/`, params)
    },

    // 注册-检查邮箱是否存在
    check_email(params) {
        return http.post(`/user/check_email/`, params)
    },
}







