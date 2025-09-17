<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { deleteUser, listUserPage } from '@/api/adminUserController.ts'

// 表格列配置

const dataList = ref<API.User[]>([])
const searchParams = ref<API.UserQueryRequest>({
    current: 1,
    pageSize: 10,
})

const total = ref(0)
// 表格列配置
const columns = [
    {
        title: 'id',
        dataIndex: 'id',
    },
    {
        title: '账号',
        dataIndex: 'userAccount',
    },
    {
        title: '用户名',
        dataIndex: 'userName',
    },
    {
        title: '用户头像',
        dataIndex: 'userAvatar',
    },
    {
        title: '用户简介',
        dataIndex: 'userProfile',
    },
    {
        title: '权限',
        dataIndex: 'userRole',
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
const loadData = async () => {
    const res = await listUserPage({ ...searchParams.value })
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
    console.log(searchParams.value)
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
    const res = await deleteUser({
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
    <div id="admin-user-page">
        <a-form
            :model="searchParams"
            :style="{ marginBottom: '20px' }"
            @submit="doSearch"
            layout="inline"
        >
            <a-form-item
                name="userName"
                label="用户名"
            >
                <a-input
                    allow-clear
                    v-model:value="searchParams.userName"
                    placeholder="请输入用户名"
                />
            </a-form-item>
            <a-form-item
                name="userProfile"
                label="用户简介"
            >
                <a-input
                    allow-clear
                    v-model:value="searchParams.userProfile"
                    placeholder="请输入用户简介"
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
            rowKey="id"
        >
            <template #bodyCell="{ column, record }: { column: any; record: API.User }">
                <template v-if="column.dataIndex === 'userAvatar'">
                    <a-image
                        :width="64"
                        :src="record.userAvatar"
                    />
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
#admin-user-page {
    width: 100%;
}
</style>
