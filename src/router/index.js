import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// export const constantRoutes = [
//   {
//     path: '/login',
//     component: () => import('@/views/login/index'),
//     hidden: true
//   },
//
//   {
//     path: '/404',
//     component: () => import('@/views/404'),
//     hidden: true
//   },
//
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/',
//     children: [{
//       path: '/',
//       name: '首页',
//       component: () => import('@/views/dashboard/index'),
//       meta: { title: '首页', icon: 'iconfont el-icon-myshouye' }
//     }]
//   },
//
//   {
//     path: '/article',
//     component: Layout,
//     redirect: '/article/publish',
//     name: '文章管理',
//     meta: {
//       title: '文章管理',
//       icon: 'iconfont el-icon-mywenzhang-copy'
//     },
//     children: [
//       {
//         path: 'publish',
//         component: () => import('@/views/article/index'),
//         name: '发布文章',
//         meta: {title: '发布文章', icon: "iconfont el-icon-myfabiaowenzhang"},
//       },
//
//       {
//         path: 'publish/:id',
//         component: () => import('@/views/article/index'),
//         name: '修改文章',
//         meta: {title: '修改文章', icon: "iconfont el-icon-myfabiaowenzhang"},
//         hidden: true
//       },
//
//       {
//         path: 'articleList',
//         component: () => import('@/views/article/articleList'),
//         name: '文章列表',
//         meta: {title: '文章列表', icon: "iconfont el-icon-mywenzhangliebiao"},
//       },
//
//       {
//         path: 'category',
//         component: () => import('@/views/category/index'),
//         name: '分类管理',
//         meta: {title: '分类管理', icon: "iconfont el-icon-myfenlei"},
//       },
//
//       {
//         path: 'tag',
//         component: () => import('@/views/tag/index'),
//         name: '标签管理',
//         meta: {title: '标签管理', icon: "iconfont el-icon-myicontag"},
//       },
//     ]
//   },
//
//   {
//     path: '/message',
//     component: Layout,
//     redirect: '/message/comment',
//     name: '消息管理',
//     meta: {
//       title: '消息管理',
//       icon: 'iconfont el-icon-myxiaoxi'
//     },
//     children: [
//       {
//         path: 'comment',
//         component: () => import('@/views/nested/menu1/index'),
//         name: '评论管理',
//         meta: {title: '评论管理', icon: "iconfont el-icon-mypinglunzu"},
//       },
//
//       {
//         path: 'offlineMessage',
//         component: () => import('@/views/nested/menu1/index'),
//         name: '留言管理',
//         meta: {title: '留言管理', icon: "iconfont el-icon-myliuyan"},
//       },
//
//       {
//         path: 'chat',
//         component: () => import('@/views/nested/menu1/index'),
//         name: '聊天管理',
//         meta: {title: '聊天管理', icon: "iconfont el-icon-myliuyan"},
//       },
//     ]
//   },
//
//   {
//     path: '/user',
//     component: Layout,
//     redirect: '/user/userList',
//     name: '用户管理',
//     meta: {
//       title: '用户管理',
//       icon: 'iconfont el-icon-myyonghuliebiao'
//     },
//     children: [
//       {
//         path: 'userList',
//         component: () => import('@/views/nested/menu1/index'),
//         name: '用户列表',
//         meta: {title: '用户列表', icon: "iconfont el-icon-myyonghuliebiao"},
//       },
//
//       {
//         path: 'userOnline',
//         component: () => import('@/views/nested/menu1/index'),
//         name: '在线用户',
//         meta: {title: '在线用户', icon: "iconfont el-icon-myyonghuliebiao"},
//       },
//     ]
//   },
//
//   {
//     path: '/authority',
//     component: Layout,
//     redirect: '/authority/role',
//     name: '权限管理',
//     meta: {
//       title: '权限管理',
//       icon: 'iconfont el-icon-mydaohanglantubiao_quanxianguanli'
//     },
//     children: [
//       {
//         path: 'role',
//         component: () => import('@/views/role/index'),
//         name: '角色管理',
//         meta: {title: '角色管理', icon: "iconfont el-icon-myjiaoseliebiao"},
//       },
//
//       {
//         path: 'implement',
//         component: () => import('@/views/nested/menu1/index'),
//         name: '接口管理',
//         meta: {title: '接口管理', icon: "iconfont el-icon-myjiekouguanli"},
//       },
//
//       {
//         path: 'menu',
//         component: () => import('@/views/menu/index'),
//         name: '菜单管理',
//         meta: {title: '菜单管理', icon: "iconfont el-icon-mycaidan"},
//       },
//     ]
//   },
//
//   {
//     path: '/setting',
//     component: Layout,
//     redirect: '/setting/website',
//     name: '系统管理',
//     meta: {
//       title: '系统管理',
//       icon: 'iconfont el-icon-myshezhi'
//     },
//     children: [
//       {
//         path: 'website',
//         component: () => import('@/views/website/index'),
//         name: '网站管理',
//         meta: {title: '网站管理', icon: "iconfont el-icon-myxitong"},
//       },
//
//       {
//         path: 'page',
//         component: () => import('@/views/website/page'),
//         name: '页面管理',
//         meta: {title: '页面管理', icon: "iconfont el-icon-myyemianpeizhi"},
//       },
//
//       {
//         path: 'link',
//         component: () => import('@/views/website/friendLink'),
//         name: '友链管理',
//         meta: {title: '友链管理', icon: "iconfont el-icon-mydashujukeshihuaico-"},
//       },
//
//       {
//         path: 'navigation',
//         component: () => import('@/views/website/siteNavigation'),
//         name: '网站导航管理',
//         meta: {title: '网站导航管理', icon: "iconfont el-icon-myliuyan"},
//       },
//     ]
//   },
//
//   {
//     path: '/album',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '相册列表',
//         component: () => import('@/views/album/index'),
//         meta: { title: '相册管理', icon: 'iconfont el-icon-myimage-fill' }
//       },
//
//       {
//         path: 'albums/:id',
//         name: '照片管理',
//         component: () => import('@/views/album/photo'),
//         meta: { title: '相册管理', icon: 'iconfont el-icon-myimage-fill' },
//         hidden: true
//       }
//     ],
//
//   },
//
//   {
//     path: '/log',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '日志管理',
//         component: () => import('@/views/form/index'),
//         meta: { title: '日志管理', icon: 'iconfont el-icon-myguanyuwo' }
//       }
//     ]
//   },
//
//   {
//     path: '/person',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '个人中心',
//         component: () => import('@/views/person/index'),
//         meta: { title: '个人中心', icon: 'iconfont el-icon-myuser' }
//       }
//     ]
//   },
//
//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]

const routes = [
  {
    path: '/login',
    name: "登录",
    hidden: true,
    component: () => import('@/views/login/index')
  },
];

const createRouter = () => new Router({
    mode: "history",
    routes: routes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;

