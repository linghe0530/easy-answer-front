<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { deleteUser } from '@/api/adminUserController.ts'
import { listQuestionPage } from '@/api/adminQuestionController.ts'
import { deleteQuestion } from '@/api/questionController.ts'

// 表格列配置

const dataList = ref<API.Question[]>([])
const searchParams = ref<API.QuestionQueryRequest>({
    current: 1,
    pageSize: 10,
})
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
        title: '用户 id',
        dataIndex: 'userId',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
    },
    {
        title: '操作',
        dataIndex: 'actions',
    },
]
const total = ref(0)

const loadData = async () => {
    const res = await listQuestionPage({ ...searchParams.value })
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
    const res = await deleteQuestion({
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
    <div id="scoring-result-tale">
        <a-form
            :model="searchParams"
            :style="{ marginBottom: '20px' }"
            @submit="doSearch"
            layout="inline"
        >
            <a-form-item
                name="appId"
                label="应用 id"
            >
                <a-input
                    v-model:value="searchParams.appId"
                    placeholder="请输入应用 id"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                name="userId"
                label="用户 id"
            >
                <a-input
                    v-model:value="searchParams.userId"
                    placeholder="请输入用户 id"
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
            </template>
            <template #expandedRowRender="{ record }: { record: API.Question }">
                <template
                    v-if="record.questionContent "
                >
                    <div class="question-card">
                        <div
                            v-for="(question, questionIndex) in JSON.parse(
                            record.questionContent as string,
                        )"
                            :key="questionIndex"
                            class="question-item"
                        >
                            <!-- 题目标题：加粗+序号，突出层级 -->
                            <div class="question-title">
                                <span class="question-index">{{ questionIndex + 1 }}.</span>
                                <span class="question-text">
                                {{ question.title || '未设置标题' }}
                            </span>
                            </div>

                            <!-- 选项列表：网格布局，选项带标识（A/B/C/D）+ 样式区分 -->
                            <div
                                class="question-options"
                                v-if="question.options && question.options.length > 0"
                            >
                                <div
                                    v-for="(option, optionIndex) in question.options"
                                    :key="option.key || optionIndex"
                                    class="option-item"
                                >
                                    <!-- 选项标识：圆形背景 + 字母（A/B/C/D...） -->
                                    <div class="option-tag">
                                        {{ String.fromCharCode(65 + optionIndex) }}
                                    </div>
                                    <!-- 选项内容区：包含选项文本、得分（若有） -->
                                    <div class="option-content">
                                        <div class="option-value">
                                            {{ option.value || '无选项内容' }}
                                        </div>
                                        <!-- 得分信息：浅灰色小字，仅在score存在时显示 -->
                                        <div
                                            class="option-score"
                                            v-if="option.score !== undefined && option.score !== null"
                                        >
                                            得分：{{ option.score }}
                                        </div>
                                        <!-- 结果信息（若有）：如正确/错误标识 -->
                                        <div
                                            class="option-result"
                                            v-if="option.result"
                                        >
                                            结果：{{ option.result }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 无选项提示 -->
                            <div
                                class="no-options"
                                v-else
                            >
                                <span>暂无选项</span>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 解析失败/无数据提示 -->
                <template v-else>
                    <div class="question-empty">
                        无题目数据
                    </div>
                </template>
            </template>
            <template #bodyCell="{ column, record }: { column: any; record: API.Question }">

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
#scoring-result-tale {
    width: 100%;
}

/* 题目卡片：整体容器样式 */
.question-card {
    padding: 12px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 8px;
}

/* 单个题目容器：与其他题目保持间距 */
.question-item {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #f0f0f0;
}

/* 最后一个题目移除下边框 */
.question-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

/* 题目标题：序号+文本组合 */
.question-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 12px;
    line-height: 1.5;
}

.question-index {
    color: #1890ff; /* 序号用主题色突出 */
    font-weight: 600;
}

.question-text {
    word-break: break-all; /* 长标题自动换行 */
}

/* 选项列表：网格布局（2列，自适应宽度） */
.question-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 8px; /* 选项之间的间距 */
}

/* 单个选项：flex布局，标识+内容横向排列 */
.option-item {
    display: flex;
    align-items: flex-start;
    padding: 10px 12px;
    background: #fafafa;
    border-radius: 6px;
    border: 1px solid #f0f0f0;
    transition: all 0.2s ease;
}

/* 选项 hover 效果：轻微高亮 */
.option-item:hover {
    border-color: #e6f7ff;
    background: #f0f7ff;
}

/* 选项标识（A/B/C/D）：圆形背景 */
.option-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-right: 10px;
    background: #1890ff;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    border-radius: 50%;
    flex-shrink: 0; /* 防止标识被压缩 */
}

/* 选项内容区：文本+附加信息 */
.option-content {
    flex: 1; /* 内容区占满剩余宽度 */
}

.option-value {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.4;
    word-break: break-all; /* 长选项文本换行 */
}

/* 选项得分：浅灰色小字 */
.option-score {
    margin-top: 4px;
    font-size: 12px;
    color: #9ca3af;
}

/* 选项结果：绿色文本（如"正确"） */
.option-result {
    margin-top: 4px;
    font-size: 12px;
    color: #10b981;
}

/* 无选项提示 */
.no-options {
    margin-top: 8px;
    font-size: 13px;
    color: #9ca3af;
    padding: 8px 0;
}

/* 题目为空/解析失败提示 */
.question-empty {
    padding: 16px;
    text-align: center;
    font-size: 13px;
    color: #9ca3af;
    background: #fafafa;
    border-radius: 6px;
}
</style>
