import http from "@/utils/requests";

export default {

    // 批量删除测试套件
    batchDelete(ids) {
        return http.post(`/testsuits/batch_delete/`, ids)
    },

    // 获取测试套件列表
    getList(params) {
        return http.get(`/testsuits/?page=${params.page}&size=${params.size}&search=${params.search}`, params)
    },

    // 删除测试套件
    deleteTestSuit(id) {
        return http.delete(`/testsuits/${id}/`)
    },

    // 通过测试套件id运行用例
    runTestSuit(id, params) {
        return http.post(`/testsuits/${id}/run/`, params)
    },

    // 新增测试套件
    addTestSuit(params) {
        return http.post(`/testsuits/`, params)
    },

    // 修改测试套件
    updateTestSuit(id, params) {
        return http.put(`/testsuits/${id}/`, params)
    },

    // 获取测试套件详情
    getTestSuitDetail(id) {
        return http.get(`/testsuits/${id}/`)
    },
}