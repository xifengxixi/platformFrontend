import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

let router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/dashboard',
			name: 'index'
		},
		{
			path: '/',
			component: resolve => require(['@/components/common/Home.vue'], resolve),
			meta: { title: '系统首页' },
			children:[
				{
					path: '/dashboard',
					component: resolve => require(['@/components/page/Dashboard.vue'], resolve),
					meta: { title: '系统首页' }
				},
				{
					path: '/projects_list',
					component: resolve => require(['@/components/page/ProjectList.vue'], resolve),
					meta: { title: '项目列表' },
					name: 'projects_list'
				},
				{
					path: '/403',
					component: resolve => require(['@/components/page/403.vue'], resolve),
					meta: { title: '403' },
					name: '403'
				},
				{
					path: '/404',
					component: resolve => require(['@/components/page/404.vue'], resolve),
					meta: { title: '404' },
					name: '404'
				},
			]
		},
		{
			path: '/login',
			component: resolve => require(['@/components/page/Login.vue'], resolve),
			name: 'login'
		},
		{
			path: '/register',
			component: resolve => require(['@/components/page/Register.vue'], resolve),
			name: 'register'
		},
		{
			path: '*',
			redirect: '/404',
			name: 'other'
		}
	]
});

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const token = sessionStorage.getItem('token') || localStorage.getItem('token');
//
//     if(!token && to.path !== '/login' && to.path !== '/register'){   // 如果没有token值, 那么重定向到登录页面
//         next({
//           path: '/login',
//         });
//       }
//     else {
//         let routerName = ['builtin_edit', 'configures_edit', 'testcases_edit', 'reports_view', 'testsuites_edit'];
//         // console.log('routerName', routerName);
//         if (routerName.includes(from.name)) {
//             let path_name = to.path.split("/")[2];
//             // console.log('path_name', path_name);
//             if (/\D/.test(path_name)) {
//                 next({name: path_name});
//             }
//         }
//         next();
//       }
// });


//抛出路由
export default router;