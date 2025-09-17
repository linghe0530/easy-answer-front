<template>
    <div id="picture-manage-page">
        <a-flex
            justify="space-between"
            style="margin-bottom: 16px"
        >
            <h2>图片管理</h2>
            <a-space>
                <a-button
                    type="primary"
                    href="/picture/add"
                    target="_blank"
                >
                    + 创建图片
                </a-button>
                <a-button
                    type="primary"
                    href="/picture/add/batch"
                    target="_blank"
                    ghost
                >
                    + 批量创建图片
                </a-button>
            </a-space>
        </a-flex>
        <a-form
            :model="searchParams"
            name="search"
            layout="inline"
            @finish="doSearch"
        >
            <a-form-item label="关键词">
                <a-input
                    v-model:value="searchParams.searchText"
                    placeholder="从名称和简介搜索"
                    allow-clear
                />
            </a-form-item>
            <a-form-item label="类型">
                <a-input
                    v-model:value="searchParams.category"
                    placeholder="请输入类型"
                    allow-clear
                />
            </a-form-item>
            <a-form-item label="标签">
                <a-select
                    v-model:value="searchParams.tags"
                    mode="tags"
                    placeholder="请输入标签"
                    style="min-width: 180px"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                name="reviewStatus"
                label="审核状态"
            >
                <a-select
                    v-model:value="searchParams.reviewStatus"
                    placeholder="请选择审核状态"
                    :options="PIC_REVIEW_STATUS_OPTIONS"
                    allow-clear
                    style="min-width: 180px"
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                >
                    搜索
                </a-button>
            </a-form-item>
        </a-form>

        <div style="margin-bottom: 16px" />
        <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="pagination"
            @change="doTableChange"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'url'">
                    <a-image
                        :src="record.url"
                        :width="80"
                    />
                </template>
                <template v-if="column.dataIndex === 'tags'">
                    <a-space wrap>
                        <a-tag
                            v-for="tag in JSON.parse(record.tags || '[]')"
                            :key="tag"
                        >
                            {{ tag }}
                        </a-tag>
                    </a-space>
                </template>
                <template v-if="column.dataIndex === 'picInfo'">
                    <div>格式：{{ record.picFormat }}</div>
                    <div>宽度：{{ record.picWidth }}</div>
                    <div>高度：{{ record.picHeight }}</div>
                    <div>宽高比：{{ record.picScale }}</div>
                    <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
                </template>
                <template v-if="column.dataIndex === 'reviewMessage'">
                    <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
                    <div>审核信息：{{ record.reviewMessage }}</div>
                    <div>审核人：{{ record.reviewerId }}</div>
                    <div v-if="record.reviewTime">
                        审核时间：{{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'createTime'">
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-else-if="column.dataIndex === 'updateTime'">
                    {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-else-if="column.key === 'action'">
                    <a-space wrap>
                        <a-button
                            v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
                            type="link"
                            @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
                        >
                            通过
                        </a-button>
                        <a-button
                            v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
                            type="link"
                            danger
                            @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
                        >
                            拒绝
                        </a-button>
                        <a-button
                            danger
                            @click="doDelete(record.id)"
                        >
                            删除
                        </a-button>
                        <a-button
                            type="link"
                            :href="`/picture/add?id=${record.id}`"
                            target="_blank"
                        >
                            编辑
                        </a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
    PIC_REVIEW_STATUS_ENUM,
    PIC_REVIEW_STATUS_MAP,
    PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture.ts'
import { deletePicture } from '@/api/pictureController.ts'
import { listPictureByPage, reviewPicture } from '@/api/adminPictureController.ts'

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        width: 80,
    },
    {
        title: '图片',
        dataIndex: 'url',
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '简介',
        dataIndex: 'introduction',
        ellipsis: true,
    },
    {
        title: '类型',
        dataIndex: 'category',
    },
    {
        title: '标签',
        dataIndex: 'tags',
    },
    {
        title: '图片信息',
        dataIndex: 'picInfo',
    },
    {
        title: '用户 id',
        dataIndex: 'userId',
        width: 80,
    },
    {
        title: '审核信息',
        dataIndex: 'reviewMessage',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
    },
    {
        title: '编辑时间',
        dataIndex: 'updateTime',
    },
    {
        title: '操作',
        key: 'action',
    },
]
const dataList = ref<API.Picture[]>([])

const total = ref<number>(0)

const searchParams = reactive<API.PictureQueryRequest>({
    current: 1,
    pageSize: 10,
})
const pagination = computed(() => {
    return {
        total: total.value,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        showSizeChanger: true,
        showTotal: (total: number) => {
            return `共 ${total} 条`
        },
    }
})
//表格变化之后,重新获取数据
const doTableChange = (pagination: any) => {
    searchParams.current = pagination.current
    searchParams.pageSize = pagination.pageSize
    fetchData()
}

const doSearch = async () => {
    searchParams.current = 1
    await fetchData()
}
const doDelete = async (id: string) => {
    if (!id) {
        return
    }
    const res = await deletePicture({
        id,
    })
    if (!res?.data) {
        return
    }
    message.success('删除成功')
    await fetchData()
}

const handleReview = async (picture: API.Picture, reviewStatus: number) => {
    const reviewMessage =
        reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员审核通过' : '管理员审核拒绝'
    const res = await reviewPicture({
        id: picture.id as string,
        reviewStatus,
        reviewMessage,
    })
    if (!res) {
        return
    }
    message.success('审核成功')
    await fetchData()
}
const fetchData = async () => {
    const res = await listPictureByPage({
        ...searchParams,
        nullSpaceId: true,
    })
    if (!res?.data) {
        return
    }
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
}
onMounted(() => {
    fetchData()
})
</script>

<style scoped></style>
