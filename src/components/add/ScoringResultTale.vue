<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { deleteScoringResult, listScoringResultRespPage } from '@/api/scoringResultController.ts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

interface Props {
    appId: string
    doUpdate: (scoringResult: API.ScoringResultResp) => void
}

const props = defineProps<Props>()
// 表格列配置
const columns = [
    {
        title: 'id',
        dataIndex: 'id',
    },
    {
        title: '名称',
        dataIndex: 'resultName',
    },
    {
        title: '描述',
        dataIndex: 'resultDesc',
    },
    {
        title: '图片',
        dataIndex: 'resultPicture',
    },
    {
        title: '结果集',
        dataIndex: 'resultProp',
    },
    {
        title: '评分范围',
        dataIndex: 'resultScoreRange',
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
const dataList = ref<API.ScoringResultResp[]>([])
const searchParams = ref<API.ScoringResultQueryRequest>({
    current: 1,
    pageSize: 10,
})
const total = ref(0)

const loadData = async () => {
    const params = {
        appId: props.appId,
    }
    const res = await listScoringResultRespPage({ ...searchParams.value, ...params })
    if (!res || !res.data) return
    dataList.value = res.data.records || []
    total.value = res.data.total || 0
}

watchEffect(() => {
    loadData()
})
defineExpose({
    loadData,
})
// 搜索
const formData = ref<API.ScoringResultQueryRequest>({})
const doSearch = () => {}
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
</script>

<template>
    <div id="scoring-result-tale">
        <a-form
            :model="formData"
            :style="{ marginBottom: '20px' }"
            layout="inline"
            @submit="doSearch"
        >
            <a-form-item
                field="resultName"
                label="结果名称"
            >
                <a-input
                    v-model="formData.resultName"
                    placeholder="请输入结果名称"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                field="resultDesc"
                label="结果描述"
            >
                <a-input
                    v-model="formData.resultDesc"
                    placeholder="请输入结果描述"
                    allow-clear
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    style="width: 100px"
                >
                    搜索
                </a-button>
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
        >
            <template
                #bodyCell="{ column, record }: { column: any; record: API.ScoringResultResp }"
            >
                <template v-if="column.dataIndex === 'resultPicture'">
                    <a-image
                        :width="64"
                        :src="record.resultPicture"
                    />
                </template>
                <template v-if="column.dataIndex === 'resultProp'">
                    <a-tag
                        color="pink"
                        v-for="item in record.resultProp"
                        :key="item"
                        :bordered="false"
                    >
                        {{ item }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'createTime'">
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.dataIndex === 'updateTime'">
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.dataIndex === 'actions'">
                    <a-space>
                        <a-button @click="doUpdate?.(record)">修改</a-button>
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
</style>
