import http from '@/utils/requests'

export default {
    
    // 搜索获取内置函数列表
    getList(params) {
        return http.post(`/debugtalks/get_list/?page=${params.page}&size=${params.size}`, params);
    },

    // 通过id获取内置函数详情
    funcDetail(id) {
        return http.get(`/debugtalks/${id}/`);
    },

    // 编辑内置函数
    funcEdit(id, params) {
        return http.patch(`/debugtalks/${id}/`, params);
    },
}