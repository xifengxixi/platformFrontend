import http from '@/utils/requests'


export default{

    // 获取项目列表
    projectList(params) {
        return http.get(`/projects/`, params)
    },

    // 批量删除项目
    batchDelete(params) {
        return http.post(`/projects/batch_delete/`, params)
    },

    // 通过项目名称获取项目详情
    getList(params) {
        return http.post(`/projects/get_list/`, params)
    }
}







