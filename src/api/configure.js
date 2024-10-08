import http from '@/utils/requests'

export default {

    // 获取配置列表
    getList(params) {
        return http.get(`/configures/?page=${params.page}&size=${params.size}&search=${params.search}`, params)
    },

    // 批量删除配置
    batchDelete(ids) {
        return http.post('/configures/batch_delete/', ids)
    },

    // 删除配置
    delete(id) {
        return http.delete(`/configures/${id}/`)
    },

    // 获取配置详情
    getDetail(id) {
        return http.get(`/configures/${id}/`)
    },

    // 新增配置
    createConfig(params) {
        return http.post('/configures/', params)
    },
}