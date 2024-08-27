import http from '@/utils/requests'


export default{

    // 汇总
    summary(params) {
        return http.get(`/summary/`, params)
    },

}







