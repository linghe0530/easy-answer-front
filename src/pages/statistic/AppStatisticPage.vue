<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppAnswerCount, getAppAnswerResultCount } from '@/api/appStatisticController.ts'
import VChart from 'vue-echarts'
import 'echarts'

const appAnswerCountList = ref<API.AppAnswerCountDTO[]>([])
const appAnswerResultCountList = ref<API.AppAnswerResultCountDTO[]>([])
const appId = ref<string>()
// 统计选项
const appAnswerCountOptions = computed(() => {
    return {
        xAxis: {
            type: 'category',
            data: appAnswerCountList.value.map((item) => item.appId),
            name: '应用 id',
        },
        yAxis: {
            type: 'value',
            name: '用户答案数',
        },
        series: [
            {
                data: appAnswerCountList.value.map((item) => item.answerCount),
                type: 'bar',
            },
        ],
    }
})
const getAppAnswerCountData = async () => {
    const res = await getAppAnswerCount()
    if (!res || !res.data) return
    appAnswerCountList.value = res.data || []
}

// 统计选项
const appAnswerResultCountOptions = computed(() => {
    return {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '应用答案结果分布',
                type: 'pie',
                radius: '50%',
                data: appAnswerResultCountList.value.map((item) => {
                    return { value: item.resultCount, name: item.resultName }
                }),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
})
const getAppAnswerResultCountData = async () => {
    if (!appId.value) {
        return
    }
    const res = await getAppAnswerResultCount({
        appId: appId.value as string,
    })
    if (!res) return
    appAnswerResultCountList.value = res.data || []
}
onMounted(() => {
    getAppAnswerCountData()
})
</script>

<template>
    <div id="app-statistic-page">
        <h2>热门应用统计</h2>
        <v-chart
            :option="appAnswerCountOptions"
            style="height: 300px"
        />
        <h2>应用结果统计</h2>
        <div class="search-bar">
            <a-input-search
                :style="{ width: '320px' }"
                placeholder="输入 appId"
                button-text="搜索"
                size="large"
                search-button
                v-model:value="appId"
                @search="getAppAnswerResultCountData"
            />
        </div>
        <div style="margin-bottom: 16px" />
        <v-chart
            :option="appAnswerResultCountOptions"
            style="height: 300px"
        />
    </div>
</template>

<style scoped>
#app-statistic-page {
    width: 100%;
}
</style>
