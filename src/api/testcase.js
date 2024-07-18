import http from '@/utils/requests'

export default {

    // 获取用例列表
    getList(params) {
        return http.post(`/testcases/get_list/`, params)
    },

    // 批量删除用例
    batchDelete(params) {
        return http.post(`/testcases/batch_delete/`, params)
    },

    // 删除用例
    deleteTestcase(id) {
        return http.delete(`/testcases/${id}/`)
    },

    // 通过用例id运行用例
    runTestcase(id, params) {
        return http.post(`/testcases/${id}/run/`, params)
    },

    // 编辑用例
    editTestcase(id, params) {
        return http.patch(`/testcases/${id}/`, params)
    },

    // 新增用例
    createTestcase(params) {
        return http.post(`/testcases/`, params)
    },

    // 通过 interface_id 获取用例列表
    names(params) {
        return http.post(`/testcases/names/`, params)
    },

    // 获取用例详情
    getDetail(id, params) {
        return http.get(`/testcases/${id}/`, params)
    },
}