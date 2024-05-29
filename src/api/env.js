import http from "@/utils/requests";

export default {

    // 获取环境名称
    envNames(params) {
        return http.get(`/envs/names/`, params);
    },

    // 新增环境
    createEnv(params) {
        return http.post(`/envs/`, params);
    },

    // 获取环境列表
    envList(params) {
        return http.get(`/envs/?page=` + params.page + '&size=' + params.size, params);
    },

    // 搜索获取环境列表
    getList(params) {
        return http.post(`/envs/get_list/?page=` + params.page + '&size=' + params.size, params);
    },

    // 批量删除环境
    batchDelete(params) {
        return http.post(`/envs/batch_delete/`, params);
    },
}