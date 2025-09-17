import { h } from 'vue'
import {
    AppstoreOutlined,
    BarChartOutlined,
    FileAddOutlined,
    FormOutlined,
    HistoryOutlined,
    HomeOutlined,
    LineChartOutlined,
    PictureOutlined,
    PieChartOutlined,
    PlusOutlined,
    QuestionOutlined,
    SyncOutlined,
    UserOutlined,
} from '@ant-design/icons-vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'

const menus = [
    {
        key: '/',
        icon: () => h(HomeOutlined),
        label: '主页',
        title: '主页',
    },
    {
        key: '/picture',
        icon: () => h(PictureOutlined),
        label: '图片展示',
        title: '图片展示',
    },
    {
        key: 'appManage',
        icon: () => h(AppstoreOutlined),
        label: '应用管理',
        title: '应用管理',
        access: ACCESS_ENUM.USER,
        children: [
            {
                key: '/add/app',
                label: '创建应用',
                title: '创建应用',
                icon: () => h(PlusOutlined),
            },
            {
                key: '/answer/my',
                label: '我的答题',
                title: '我的答题',
                icon: () => h(HistoryOutlined),
            },
        ],
    },
    {
        key: '/picture/add',
        label: '创建图片',
        title: '创建图片',
        icon: () => h(FileAddOutlined),
        access: ACCESS_ENUM.USER,
    },
    {
        key: 'chartGroup',
        icon: () => h(LineChartOutlined),
        label: '图表功能',
        title: '图表功能',
        access: ACCESS_ENUM.USER,
        children: [
            {
                key: '/add/chart',
                label: '添加图表',
                title: '添加图表',
                icon: () => h(LineChartOutlined),
            },
            {
                key: '/add/chart_sync',
                label: '添加图表(异步)',
                title: '添加图表(异步)',
                icon: () => h(SyncOutlined),
            },
            {
                key: '/my/chart',
                label: '我的图表',
                title: '我的图表',
                icon: () => h(PieChartOutlined),
            },
        ],
    },
    {
        key: 'adminGroup',
        icon: () => h(UserOutlined),
        label: '管理员功能',
        title: '管理员功能',
        access: ACCESS_ENUM.ADMIN,
        children: [
            {
                key: '/admin/user',
                label: '用户列表',
                title: '用户列表',
                icon: () => h(UserOutlined),
            },
            {
                key: '/admin/app',
                label: '应用列表',
                title: '应用列表',
                icon: () => h(AppstoreOutlined),
            },
            {
                key: '/admin/question',
                label: '题目列表',
                title: '题目列表',
                icon: () => h(QuestionOutlined),
            },
            {
                key: '/admin/userAnswer',
                label: '用户答案',
                title: '用户答案',
                icon: () => h(FormOutlined),
            },
            {
                key: '/admin/scoringResult',
                label: '评分结果',
                title: '评分结果',
            },
            {
                key: '/app_statistic',
                label: '应用统计',
                title: '应用统计',
                icon: () => h(BarChartOutlined),
            },
            {
                key: '/admin/picture',
                label: '图片管理',
                title: '图片管理',
                icon: () => h(BarChartOutlined),
            },
        ],
    },
]

export default menus
