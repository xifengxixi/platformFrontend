import http from '@/utils/requests'


export default {

    // 批量删除接口
    batchDelete(params) {
        return http.post(`/interfaces/batch_delete/`, params)
    },

    // 获取接口列表
    getList(params) {
        return http.post(`/interfaces/get_list/?page=${params.page}&size=${params.size}`, params)
    },

    // 通过接口id运行接口用例
    runInterface(id, params) {
        return http.post(`/interfaces/${id}/run/`, params)
    },

    // 编辑接口
    editInterface(id, params) {
        return http.patch(`/interfaces/${id}/`, params)
    },

    // 删除接口
    deleteInterface(id) {
        return http.delete(`/interfaces/${id}/`)
    },

    // 新增接口
    createInterface(params) {
        return http.post(`/interfaces/`, params)
    },
}







