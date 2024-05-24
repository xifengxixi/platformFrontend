import http from '@/utils/requests'


export default{

    // 获取项目列表
    projectList(params) {
        return http.get(`/projects/?page=`+ params.page + '&size=' + params.size,params)
    },

    // 批量删除项目
    batchDelete(params) {
        return http.post(`/projects/batch_delete/`, params)
    },

    // 通过项目名称获取项目详情
    getList(params) {
        return http.post(`/projects/get_list/`, params)
    },

    // 通过项目id运行项目用例
    runProject(id, params) {
        return http.post(`/projects/${id}/run/`, params)
    },

    // 编辑项目
    editProject(id, params) {
        return http.put(`/projects/${id}/`, params)
    },
}







