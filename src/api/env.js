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
}