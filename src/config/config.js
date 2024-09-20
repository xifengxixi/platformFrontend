export default {
    baseURL: 'http://127.0.0.1:8000/',
}

// export default {
//     baseURL: 'http://127.0.0.1:8000/',
//     // 添加代理配置
//     proxy: {
//         '/api': {
//             target: 'http://127.0.0.1:8000/', // 目标服务器的地址
//             changeOrigin: true, // 是否改变请求的源头
//             pathRewrite: { '^/api': '' }, // 路径重写，将 /api 前缀去掉
//         },
//         '/auth': {
//             target: 'http://127.0.0.1:8001/', // 另一个目标服务器的地址
//             changeOrigin: true, // 是否改变请求的源头
//             pathRewrite: { '^/auth': '' }, // 路径重写，将 /auth 前缀去掉
//         },
//     },
//     // 其他配置项
//     timeout: 5000, // 请求超时时间
//     headers: {
//         'Content-Type': 'application/json', // 默认的请求头
//     },
// }
