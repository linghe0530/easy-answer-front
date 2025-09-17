<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { doAppReview, listAppPage } from '@/api/adminAppController.ts'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP, REVIEW_STATUS_ENUM } from '@/constants/app.ts'
import { deleteApp } from '@/api/appController.ts'

// 表格列配置

const dataList = ref<API.App[]>([])
const searchParams = ref<API.AppQueryRequest>({
    current: 1,
    pageSize: 10,
})

const total = ref(0)
// 表格列配置
const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        width: 150,
    },
    {
        title: '名称',
        dataIndex: 'appName',
        width: 150,
    },

    {
        title: '图标',
        dataIndex: 'appIcon',
        width: 100,
    },
    {
        title: '应用类型',
        dataIndex: 'appType',
        width: 80,
    },
    {
        title: '评分策略',
        dataIndex: 'scoringStrategy',
        width: 80,
    },

    {
        title: '用户 id',
        dataIndex: 'userId',
        width: 150,
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
    },
]
const loadData = async () => {
    const res = await listAppPage({ ...searchParams.value })
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
    const res = await deleteApp({
        id: id,
    })
    if (!res) {
        return
    }
    message.success('删除成功')
    await loadData()
}
const doReview = async (record: API.App, reviewStatus: number, reviewMessage?: string) => {
    if (!record.id) {
        return
    }

    const res = await doAppReview({
        id: record.id,
        reviewStatus,
        reviewMessage,
    })
    if (!res) {
        return
    }
    message.success('操作成功')
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
    <div id="scoring-result-tale">
        <a-form
            :model="searchParams"
            :style="{ marginBottom: '20px' }"
            @submit="doSearch"
            layout="inline"
        >
            <a-form-item
                name="appName"
                label="应用名称"
            >
                <a-input
                    v-model:value="searchParams.appName"
                    placeholder="请输入应用名称"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                name="appDesc"
                label="应用描述"
            >
                <a-input
                    v-model:value="searchParams.appDesc"
                    placeholder="请输入应用描述"
                    allow-clear
                />
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button
                        type="primary"
                        style="width: 100px"
                        html-type="submit"
                    >
                        搜索
                    </a-button>

                    <a-button
                        type="primary"
                        style="width: 100px"
                        @click="resetSearchParams"
                    >
                        重置
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
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
            <template #expandedRowRender="{ record }: { record: API.App }">
                <div class="expanded-content">
                    <div class="expanded-section">
                        <h4>应用描述</h4>
                        <p>{{ record.appDesc || '无描述信息' }}</p>
                    </div>
                    <div class="expanded-section">
                        <h4>审核信息</h4>
                        <p>{{ record.reviewMessage || '无审核信息' }}</p>
                    </div>
                    <div class="expanded-details">
                        <div class="detail-item">
                            <span class="detail-label">审核时间：</span>
                            <span>
                                {{
                                    record.reviewTime
                                        ? dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss')
                                        : '未审核'
                                }}
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">审核人ID：</span>
                            <span>{{ record.reviewerId || '未指定' }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <template #bodyCell="{ column, record }: { column: any; record: API.App }">
                <template v-if="column.dataIndex === 'appIcon'">
                    <a-image
                        :width="64"
                        :src="record.appIcon"
                    />
                </template>
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
                            v-if="record.reviewStatus !== REVIEW_STATUS_ENUM.PASS"
                            @click="doReview(record, REVIEW_STATUS_ENUM.PASS, '')"
                        >
                            通过
                        </a-button>
                        <a-button
                            v-if="record.reviewStatus !== REVIEW_STATUS_ENUM.REJECT"
                            @click="doReview(record, REVIEW_STATUS_ENUM.REJECT, '不符合上架要求')"
                        >
                            拒绝
                        </a-button>
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
#scoring-result-tale {
    width: 100%;
}

.expanded-content {
    padding: 16px;
    background-color: #fafafa;
    border-radius: 4px;
}

.expanded-section {
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #e8e8e8;
}

.expanded-section:last-of-type {
    border-bottom: none;
}

.expanded-section h4 {
    margin-bottom: 8px;
    color: #1890ff;
    font-size: 14px;
    font-weight: 500;
}

.expanded-section p {
    margin: 0;
    line-height: 1.6;
}

.expanded-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.detail-item {
    display: flex;
    align-items: center;
}

.detail-label {
    font-weight: 500;
    color: #595959;
    min-width: 90px;
}
</style>
