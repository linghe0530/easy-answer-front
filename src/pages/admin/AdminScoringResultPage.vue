<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { listScoringResultPage } from '@/api/adminScoringResultController.ts'
import { deleteScoringResult } from '@/api/scoringResultController.ts'

// 表格列配置

const dataList = ref<API.ScoringResult[]>([])
const searchParams = ref<API.ScoringResultQueryRequest>({
    current: 1,
    pageSize: 10,
})

const total = ref(0)
// 表格列配置：精简主表格显示的列，将详细信息移至扩展面板
const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        width: 80,
    },
    {
        title: '图片',
        dataIndex: 'resultPicture',
        width: 100,
    },
    {
        title: '应用 id',
        dataIndex: 'appId',
    },
    {
        title: '用户 id',
        dataIndex: 'userId',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 180,
    },
    {
        title: '操作',
        dataIndex: 'actions',
        width: 100,
    },
]
const loadData = async () => {
    const res = await listScoringResultPage({ ...searchParams.value })
    if (!res || !res.data) return
    dataList.value = res.data.records || []
    total.value = res.data.total || 0
}

onMounted(() => {
    loadData()
})
// 搜索
const doSearch = () => {
    searchParams.value = {
        current: 1,
        ...searchParams.value,
    }
    loadData()
}
const onPageChange = (pagination: any) => {
    searchParams.value.current = pagination.current
    searchParams.value.pageSize = pagination.pageSize
    loadData()
}

const doDelete = async (id: string) => {
    if (!id) {
        return
    }
    const res = await deleteScoringResult({
        id: id,
    })
    if (!res) {
        return
    }
    message.success('删除成功')
    await loadData()
}

const resetSearchParams = () => {
    searchParams.value = {
        current: 1,
        pageSize: 10,
    }
    loadData()
}
</script>

<template>
    <div
        id="admin-scoring-result-page"
        class="container"
    >
        <div class="page-header">
            <h2>评分结果管理</h2>
            <p>查看和管理系统中的评分结果记录</p>
        </div>

        <a-card
            class="search-card"
            :bordered="false"
        >
            <a-form
                :model="searchParams"
                layout="inline"
                @submit="doSearch"
                class="search-form"
            >
                <a-form-item
                    name="resultName"
                    label="结果名称"
                >
                    <a-input
                        v-model:value="searchParams.resultName"
                        placeholder="请输入结果名称"
                        allow-clear
                        class="search-input"
                    />
                </a-form-item>
                <a-form-item
                    name="resultDesc"
                    label="结果描述"
                >
                    <a-input
                        v-model:value="searchParams.resultDesc"
                        placeholder="请输入结果描述"
                        allow-clear
                        class="search-input"
                    />
                </a-form-item>
                <a-form-item>
                    <a-space>
                        <a-button
                            type="primary"
                            html-type="submit"
                            class="search-btn"
                        >

                            搜索
                        </a-button>

                        <a-button
                            @click="resetSearchParams"
                            class="reset-btn"
                        >

                            重置
                        </a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>

        <a-card
            class="table-card"
            :bordered="false"
        >
            <a-table
                :columns="columns"
                :data-source="dataList"
                :pagination="{
                    pageSize: searchParams.pageSize,
                    current: searchParams.current,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: () => `共 ${total} 条记录`,
                }"
                @change="onPageChange"
                :expand-column-width="60"
                rowKey="id"
                class="result-table"
            >
                <template #expandColumnTitle>
                    <span class="expand-title">详情</span>
                </template>
                <template #expandedRowRender="{ record }: { record: API.ScoringResult }">
                    <div class="expanded-panel">
                        <div class="expanded-header">
                            <h3 class="expanded-title">{{ record.resultName || '无名称' }}</h3>
                            <div class="score-badge">
                                评分范围: {{ record.resultScoreRange || '未设置' }}
                            </div>
                        </div>

                        <div class="expanded-content">
                            <div class="detail-section">
                                <h4 class="section-title">基本信息</h4>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <span class="info-label">ID:</span>
                                        <span class="info-value">{{ record.id }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">应用ID:</span>
                                        <span class="info-value">{{ record.appId }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">用户ID:</span>
                                        <span class="info-value">{{ record.userId }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">创建时间:</span>
                                        <span class="info-value">
                                            {{
                                                dayjs(record.createTime).format(
                                                    'YYYY-MM-DD HH:mm:ss',
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">更新时间:</span>
                                        <span class="info-value">
                                            {{
                                                dayjs(record.updateTime).format(
                                                    'YYYY-MM-DD HH:mm:ss',
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section">
                                <h4 class="section-title">结果描述</h4>
                                <div class="description-content">
                                    {{ record.resultDesc || '无描述信息' }}
                                </div>
                            </div>

                            <div class="detail-section">
                                <h4 class="section-title">结果属性</h4>
                                <div class="properties-content">
                                    <!-- 直接处理字符串数组，无需JSON.parse解析 -->
                                    <template v-if="record.resultProp">
                                        <div class="array-container">
                                            <div class="array-items">
                                                <div
                                                    v-for="(item, index) in JSON.parse(
                                                        record.resultProp,
                                                    )"
                                                    :key="index"
                                                    class="array-item"
                                                >
                                                    <span class="item-index">{{ index + 1 }}.</span>
                                                    <span class="item-value">
                                                        {{ item || '无' }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template
                    #bodyCell="{ column, record }: { column: any; record: API.ScoringResult }"
                >
                    <template v-if="column.dataIndex === 'resultPicture'">
                        <div class="table-image-container">
                            <a-image
                                :width="50"
                                :height="50"
                                :src="record.resultPicture || 'https://picsum.photos/50/50'"
                                alt="结果缩略图"
                                class="table-image"
                            />
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'createTime'">
                        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-if="column.dataIndex === 'updateTime'">
                        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-if="column.dataIndex === 'actions'">
                        <a-space size="small">
                            <a-button
                                danger
                                size="small"
                                @click="doDelete(record.id as string)"
                                class="delete-btn"
                            >
                                删除
                            </a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<style scoped>
.container {
    padding: 20px;
    background-color: #f5f7fa;
}

.page-header {
    margin-bottom: 24px;
}

.page-header h2 {
    margin: 0 0 8px 0;
    color: #1f2329;
    font-size: 20px;
    font-weight: 600;
}

.page-header p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
}

.search-card {
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-form {
    padding: 16px 0;
}

.search-input {
    width: 240px;
}

.search-btn,
.reset-btn {
    min-width: 100px;
}

.table-card {
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.result-table {
    width: 100%;
}

.expand-title {
    color: #1890ff;
    font-weight: 500;
}

.table-image-container {
    display: flex;
    justify-content: center;
}

.table-image {
    border-radius: 4px;
    object-fit: cover;
}

.expanded-panel {
    padding: 16px;
    border-radius: 6px;
    background-color: #fafafa;
    margin: 8px 0;
}

.expanded-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.expanded-header .expanded-title {
    margin: 0;
    color: #1f2329;
    font-size: 16px;
    font-weight: 600;
}

.score-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    background-color: #e6f7ff;
    color: #1890ff;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
}

.expanded-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.detail-section {
    background-color: #fff;
    border-radius: 6px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.section-title {
    margin: 0 0 12px 0;
    color: #4b5563;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.section-title::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 14px;
    background-color: #1890ff;
    border-radius: 2px;
    margin-right: 8px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
}

.info-item {
    display: flex;
    flex-direction: column;
}

.info-label {
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 4px;
}

.info-value {
    color: #1f2329;
    font-size: 14px;
    word-break: break-all;
}

.description-content {
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 4px;
    border: 1px solid #f3f4f6;
    color: #374151;
    line-height: 1.6;
    min-height: 60px;
}

.properties-content {
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 4px;
    border: 1px solid #f3f4f6;
    overflow-x: auto;
}

.properties-content pre {
    margin: 0;
    color: #374151;
    font-size: 13px;
    line-height: 1.5;
}

.empty-state {
    color: #9ca3af;
    text-align: center;
    padding: 24px;
    background-color: #f9fafb;
    border-radius: 4px;
}

.delete-btn {
    transition: all 0.2s;
}

.delete-btn:hover {
    transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }

    .search-input {
        width: 100%;
        margin-bottom: 8px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .expanded-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}

/* 字符串数组专用样式 */
.array-container {
    width: 100%;
    font-size: 14px;
    color: #374151;
}

.array-items {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.array-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
}

.item-index {
    color: #6b7280;
    min-width: 24px;
    text-align: right;
}

.item-value {
    flex: 1;
    word-break: break-all;
    padding: 2px 4px;
    border-radius: 2px;
    background-color: #f3f4f6;
}

/* 优化空状态样式 */
.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-color: #f9fafb;
    border-radius: 4px;
    color: #6b7280;
    gap: 8px;
}

.empty-icon {
    color: #9ca3af;
    font-size: 16px;
}
</style>
