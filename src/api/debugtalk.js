import http from '@/utils/requests'

export default {
    
    // 搜索获取内置函数列表
    getList(params) {
        return http.post(`/debugtalks/get_list/?page=${params.page}&size=${params.size}`, params);
    },
}