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

    // 注册-检查用户名是否存在
    check_username(username) {
        return http.get(`/user/` + username + '/count/', )
    },

    // 注册-检查邮箱是否存在
    check_email(email) {
        return http.get(`/user/` + email + '/count/', )
    }
}







