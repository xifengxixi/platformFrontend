import http from '@/utils/requests'

export default {

    // 获取报告列表
    reportList(params) {
        return http.get(`/reports/?page=${params.page}&size=${params.size}&search=${params.search}`, params)
    },

    // 下载报告
    downloadReport(id) {
        return http.get(`/reports/${id}/download/`)
    },

    // 获取报告详情
    reportDetail(id) {
        return http.get(`/reports/${id}/`)
    },

    // 批量删除报告
    batchDeleteReport(params) {
        return http.post('/reports/batch_delete/', params)
    },

    // 删除报告
    deleteReport(id) {
        return http.delete(`/reports/${id}/`)
    },
}