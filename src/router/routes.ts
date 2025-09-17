import type { RouteRecordRaw } from 'vue-router'
import ACCESS_ENUM from '@/access/accessEnum.ts'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '主页',
        component: () => import('@/pages/HomePage.vue'),
    },
    {
        path: '/no_auth',
        name: '暂无权限',
        component: () => import('@/pages/NoAuthPage.vue'),
    },
    {
        path: '/app/detail/:id',
        name: '应用详情',
        component: () => import('@/pages/app/AppDetailPage.vue'),
        props: true,
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: '/answer/do/:appId',
        name: '答题',
        component: () => import('@/pages/answer/DoAnswerPage.vue'),
        props: true,
        meta: {
            hideInMenu: true,
            access: ACCESS_ENUM.USER,
        },
    },
    {
        path: '/answer/result/:id',
        name: '答题结果',
        component: () => import('@/pages/answer/AnswerResultPage.vue'),
        props: true,
        meta: {
            hideInMenu: true,
            access: ACCESS_ENUM.USER,
        },
    },
    {
        path: '/answer/my',
        name: '我的答题',
        component: () => import('@/pages/answer/MyAnswerPage.vue'),
        props: true,
        meta: {
            access: ACCESS_ENUM.USER,
        },
    },
    {
        path: '/add/app',
        name: '创建应用',
        component: () => import('@/pages/add/AddAppPage.vue'),
    },
    {
        path: '/add/question/:appId',
        name: '创建题目',
        component: () => import('@/pages/add/AddQuestionPage.vue'),
        props: true,
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: '/add/scoring_result/:appId',
        name: '创建评分',
        component: () => import('@/pages/add/AddScoringResultPage.vue'),
        props: true,
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: '/user/login',
        name: '用户登录',
        component: () => import('@/pages/user/UserLoginPage.vue'),
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: '/user/register',
        name: '用户注册',
        component: () => import('@/pages/user/UserLoginPage.vue'),
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: '/admin/user',
        name: '用户列表',
        component: () => import('@/pages/admin/AdminUserPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/admin/app',
        name: '应用列表',
        component: () => import('@/pages/admin/AdminAppPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/admin/question',
        name: '题目列表',
        component: () => import('@/pages/admin/AdminQuestionPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/admin/userAnswer',
        name: '用户答案',
        component: () => import('@/pages/admin/AdminUserAnswerPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/admin/scoringResult',
        name: '评分结果',
        component: () => import('@/pages/admin/AdminScoringResultPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/app_statistic',
        name: '应用统计',
        component: () => import('@/pages/statistic/AppStatisticPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/add/chart',
        name: '添加图表',
        component: () => import('@/pages/add/AddChart.vue'),
        meta: {
            access: ACCESS_ENUM.USER,
        },
    },
    {
        path: '/add/chart_sync',
        name: '添加图表(异步)',
        component: () => import('@/pages/add/AddChartAsync.vue'),
        meta: {
            access: ACCESS_ENUM.USER,
        },
    },
    {
        path: '/my/chart',
        name: '我的图表',
        component: () => import('@/pages/chart/MyChart.vue'),
        meta: {
            access: ACCESS_ENUM.USER,
        },
    },
    {
        path: '/picture',
        name: '图片展示',
        component: () => import('@/pages/picture/PictureHomePage.vue'),
    },
    {
        path: '/picture/add',
        name: '创建图片',
        component: () => import('@/pages/add/AddPicturePage.vue'),
    },
    {
        path: '/picture/add/batch',
        name: '批量创建图片',
        component: () => import('@/pages/add/AddPictureBatchPage.vue'),
        meta: {
            access: ACCESS_ENUM.ADMIN,
        },
    },
    {
        path: '/picture/:id',
        name: '图片详情',
        component: () => import('@/pages/picture/PictureDetailPage.vue'),
        props: true,
    },
    {
        path: '/picture/search',
        name: '搜索图片',
        component: () => import('@/pages/picture/SearchPicturePage.vue'),
        props: true,
    },
    {
        path: '/admin/picture',
        name: '图片管理',
        component: () => import('@/pages/admin/AdminPicturePage.vue'),
    },
]
export default routes
