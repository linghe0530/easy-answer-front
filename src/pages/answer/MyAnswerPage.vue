<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import dayjs from 'dayjs'
import { deleteUserAnswer, listMyUserAnswerRespByPage } from '@/api/userAnswerController.ts'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_ENUM, APP_TYPE_MAP } from '@/constants/app.ts'
import { message } from 'ant-design-vue'

const dataList = ref<API.UserAnswerResp[]>([])
const searchParams = ref<API.UserAnswerQueryRequest>({
    current: 1,
    pageSize: 10,
})
const total = ref(0)

const loadData = async () => {
    const res = await listMyUserAnswerRespByPage({ ...searchParams.value })
    if (!res || !res.data) return
    dataList.value = res.data.records || []
    total.value = res.data.total || 0
}
watchEffect(() => {
    loadData()
})


const onPageChange = (pagination: any) => {
    searchParams.value.current = pagination.current
    searchParams.value.pageSize = pagination.pageSize
    loadData()
}

const doDelete = async (id: string) => {
    if (!id) {
        return
    }
    const res = await deleteUserAnswer({
        id: id,
    })
    if (!res) {
        return
    }
    message.success('删除成功')
    await loadData()
}
// 表格列配置
const columns = [
    {
        title: 'id',
        dataIndex: 'id',
    },


    {
        title: '应用 id',
        dataIndex: 'appId',
    },
    {
        title: '应用类型',
        dataIndex: 'appType',
    },
    {
        title: '评分策略',
        dataIndex: 'scoringStrategy',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
    },
    {
        title: '操作',
        dataIndex: 'actions',
    },
]
</script>

<template>
    <div id="my-answer-page">
        <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="{
                pageSize: searchParams.pageSize,
                current: searchParams.current,
                total,
            }"
            @change="onPageChange"
            :expand-column-width="20"
            rowKey="id"
        >
            <template #expandColumnTitle>
                <span style="color: #1890ff">详情</span>
                <!-- 改为更明确的文字 -->
            </template>
            <template #expandedRowRender="{ record }: { record: API.UserAnswerResp }">
                <div class="expanded-detail-card">
                    <!-- 详情标题 -->
                    <div class="detail-title">
                        <span style="font-weight: 500; color: #1f2937">答题记录详情</span>
                    </div>

                    <!-- 详情内容：网格布局，清晰展示各字段 -->
                    <div class="detail-content">
                        <div class="detail-item">
                            <span class="detail-label">结果 ID：</span>
                            <span class="detail-value">{{ record.resultId || '无' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">结果名称：</span>
                            <span class="detail-value">{{ record.resultName || '无' }}</span>
                        </div>
                        <div
                            class="detail-item"
                            v-if="record.appType === APP_TYPE_ENUM.SCORE"
                        >
                            <span class="detail-label">得分：</span>
                            <span class="detail-value score-tag">
                                {{ record.resultScore ?? 0 }} 分
                            </span>
                        </div>
                        <div class="detail-item detail-item-full">
                            <span class="detail-label">选择的选项：</span>
                            <div class="detail-value options-container">
                                <!-- 处理选项为JSON数组的情况（若为字符串格式可解析） -->
                                <template v-if="record.choices">
                                    <div
                                        v-for="(option, idx) in record.choices"
                                        :key="idx"
                                        class="option-item"
                                    >

                                        {{ option || '未选择选项' }}
                                    </div>
                                </template>
                                <template v-else>
                                    <span class="empty-tip">无选项记录</span>
                                </template>
                            </div>
                        </div>
                        <div class="detail-item detail-item-full">
                            <span class="detail-label">结果描述：</span>
                            <div class="detail-value desc-container">
                                {{ record.resultDesc || '无结果描述' }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #bodyCell="{ column, record }: { column: any; record: API.UserAnswerResp }">
                <template v-if="column.dataIndex === 'appType'">
                    {{ APP_TYPE_MAP[record.appType as number] }}
                </template>

                <template v-if="column.dataIndex === 'scoringStrategy'">
                    {{ APP_SCORING_STRATEGY_MAP[record.scoringStrategy as number] }}
                </template>
                <template v-if="column.dataIndex === 'createTime'">
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.dataIndex === 'updateTime'">
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.dataIndex === 'actions'">
                    <a-space>
                        <a-button
                            danger
                            @click="doDelete(record.id as string)"
                        >
                            删除
                        </a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>

<style scoped>

.expanded-detail-card {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 16px;
    margin: 8px 0;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.detail-title {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px dashed #e8e8e8;
    font-size: 16px;
}

.detail-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px 24px;
}

.detail-item {
    display: flex;
    align-items: flex-start;
    line-height: 1.6;
}

.detail-item-full {
    grid-column: 1 / -1;
}

.detail-label {
    color: #8c8c8c;
    min-width: 90px;
    flex-shrink: 0;
}

.detail-value {
    color: #333;
    word-break: break-word;
}

.score-tag {
    display: inline-block;
    padding: 2px 8px;
    background-color: #f6ffed;
    color: #52c41a;
    border-radius: 4px;
    font-weight: 500;
    border: 1px solid #b7eb8f;
}

.options-container {
    padding: 8px 0;
}

.option-item {
    padding: 4px 0;
    display: flex;
    align-items: center;
}

.desc-container {
    padding: 8px 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #e4e6eb;
    line-height: 1.8;
}

.empty-tip {
    color: #bfbfbf;
    font-style: italic;
}

/* 响应式调整 */
@media (max-width: 1200px) {
    .detail-content {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .detail-content {
        grid-template-columns: 1fr;
    }

    .detail-item {
        flex-direction: column;
    }

    .detail-label {
        margin-bottom: 4px;
    }
}

</style>
