import http from '@/utils/requests'


export default{

    // 获取项目列表
    projectList(params) {
        return http.get(`/projects/`, params)
    },

}







