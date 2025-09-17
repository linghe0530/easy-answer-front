<script setup lang="ts">
import { listMyChartByPage } from '@/api/chartController.ts'
import { onMounted, ref } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import { CHART_STATUS_ENUM } from '@/constants/chart.ts'
import dayjs from 'dayjs'

const loginUserStore = useLoginUserStore()
const searchParams = ref<API.ChartQueryRequest>({
    current: 1,
    pageSize: 20,
})
const dataList = ref<API.Chart[]>([])
const total = ref<number>(0)
const loading = ref(false)
const loadData = async () => {
    loading.value = true
    const res = await listMyChartByPage({
        ...searchParams.value,
    }).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        return
    }
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
    try {
        dataList.value.forEach((data) => {
            if (data.status !== CHART_STATUS_ENUM.SUCCEED) {
                return
            }
            const chartOptions = JSON.parse(data.genChart ?? '{}')
            chartOptions.title = undefined
            data.genChart = JSON.stringify(chartOptions)
        })
        console.log(1231)
    } catch (e: any) {
        message.error(e.message || '分析失败，请重试')
    }
}
onMounted(() => {
    loadData()
})

const pagination = ref({
    pageSize: searchParams.value.pageSize,
    current: searchParams.value.current,
    total,
    onChange: (page: number, pageSize: number) => {
        searchParams.value.current = page
        searchParams.value.pageSize = pageSize
        loadData()
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },
    showTotal: () => `共 ${total.value} 条记录`,
})

const onSearch = () => {
    searchParams.value = {
        ...searchParams.value,
        current: 1,
    }
    loadData()
}

const doReGenChart = async (id: string) => {}
</script>

<template>
    <div id="my-chart-page">
        <h1 class="page-title">我的图表分析</h1>
        <p class="page-subtitle">共 {{ total }} 个图表记录</p>
        <!-- 搜索框 -->
        <div class="searchBar">
            <a-input-search
                v-model:value="searchParams.name"
                placeholder="搜索我的图表"
                enter-button="搜索"
                size="large"
                @search="onSearch"
                class="search-input"
            />
        </div>
        <a-list
            item-layout="vertical"
            :data-source="dataList"
            :pagination="pagination"
            :loading="loading"
        >
            <template #renderItem="{ item }: { item: API.Chart }">
                <a-list-item
                    class="chart-card"
                    :key="item.id"
                >
                    <a-list-item-meta
                        :description="item.chartType ? '图表类型:' + item.chartType : ''"
                    >
                        <template #title>
                            <div class="chart-title">名称：{{ item.name }}</div>
                            <div class="chart-goal">目标：{{ item.goal }}</div>
                            <div class="chart-goal">
                                创建时间：{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                            </div>
                        </template>
                        <template #avatar>
                            <a-avatar
                                class="user-avatar"
                                :src="loginUserStore.loginUser.userAvatar"
                            />
                        </template>
                    </a-list-item-meta>
                    <div class="chart-container">
                        <template v-if="item.status === CHART_STATUS_ENUM.SUCCEED">
                            <VChart
                                :option="JSON.parse(item.genChart ?? '{}')"
                                class="chart"
                            />
                        </template>
                        <template v-else-if="item.status === CHART_STATUS_ENUM.WAIT">
                            <a-result
                                title="排队中,请稍后"
                                :sub-title="item.execMessage"
                            />
                        </template>
                        <template v-else-if="item.status === CHART_STATUS_ENUM.RUNNING">
                            <a-result
                                status="success"
                                title="正在分析中,请稍后"
                                :sub-title="item.execMessage"
                            />
                        </template>
                        <template v-else-if="item.status === CHART_STATUS_ENUM.FAILED">
                            <a-result
                                status="error"
                                title="分析失败"
                                :sub-title="item.execMessage"
                            >
                                <template #extra>
                                    <a-button
                                        type="primary"
                                        @click="doReGenChart(item.id as string)"
                                    >
                                        重新分析
                                    </a-button>
                                </template>
                            </a-result>
                        </template>
                    </div>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<style scoped>
#my-chart-page {
    max-width: 1200px;
    margin: 0 auto 32px;
    padding: 0 16px;
    /* 搜索框样式 */

    .searchBar {
        text-align: center;
        margin-bottom: 1rem;
    }

    .search-input {
        width: 100%;
        max-width: 400px;
        border-radius: 30px !important;
    }
}

.page-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2f3d;
    margin: 24px 0 8px;
    text-align: center;
}

.page-subtitle {
    text-align: center;
    color: #6e7783;
    margin-bottom: 32px;
    font-size: 16px;
}

.chart-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    padding: 20px;
    transition: all 0.3s ease;
    border: 1px solid #eaeef2;
}

.chart-card:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.user-avatar {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2f3d;
    margin-bottom: 6px;
}

.chart-goal {
    color: #4e5969;
    font-size: 14px;
    line-height: 1.5;
}

.chart-container {
    margin-top: 16px;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
    border: 1px solid #eaeef2;
}

.chart {
    height: 300px;
    width: 100%;
}

:deep(.ant-list-pagination) {
    margin-top: 32px;
    text-align: center;
}

:deep(.ant-pagination-item) {
    border-radius: 6px;
}

:deep(.ant-pagination-item-active) {
    border-color: #1890ff;
    background: #e6f7ff;
}

:deep(.ant-list-item-meta-description) {
    color: #6e7783 !important;
    font-size: 14px;
    margin-top: 8px;
}
</style>
