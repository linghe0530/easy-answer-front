<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePicture } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'

interface Props {
    dataList?: API.PictureResp[]
    loading: boolean
    showActions?: boolean
    onReload?: () => void
    showShare?: boolean
    canDelete?: boolean
    canEdit?: boolean
}

const router = useRouter()
const props = withDefaults(defineProps<Props>(), {
    dataList: () => [],
    loading: false,
    showActions: false,
    canDelete: false,
    canEdit: false,
})
const shareModalRef = ref<InstanceType<typeof ShareModal>>()
const shareLink = ref<string>()

const doClickPicture = (picture: API.PictureResp) => {
    router.push(`/picture/${picture.id}`)
}

const doEdit = (e: MouseEvent, picture: API.PictureResp) => {
    e.stopPropagation()

    router.push({
        path: '/picture/add',
        query: {
            id: picture.id,
        },
    })
}
// 删除数据
const doDelete = async (e: MouseEvent, picture: API.PictureResp) => {
    // 阻止冒泡
    e.stopPropagation()
    const id = picture.id
    if (!id) {
        return
    }
    const res = await deletePicture({ id })
    if (!res) {
        return
    }
    message.success('删除成功')
    props.onReload?.()
}

// 删除数据
const doSearchByPicture = async (e: MouseEvent, picture: API.PictureResp) => {
    // 阻止冒泡
    e.stopPropagation()
    await router.push(`/picture/search?pictureId=${picture.id}`)
}

const doShare = (e: MouseEvent, picture: API.PictureResp) => {
    e.stopPropagation()
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
    shareModalRef.value?.openModal()
}
</script>

<template>
    <div id="home-page">
        <a-list
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
            :data-source="dataList"
            :loading="loading"
        >
            <template #renderItem="{ item: picture }">
                <a-list-item style="padding: 0">
                    <a-card
                        hoverable
                        @click="doClickPicture(picture)"
                    >
                        <template #cover>
                            <img
                                :alt="picture.name"
                                :src="picture.thumbnailUrl ?? picture.url"
                                style="height: 180px; object-fit: cover"
                            />
                        </template>
                        <a-card-meta :title="picture.name">
                            <template #description>
                                <a-flex>
                                    <a-tag color="green">
                                        {{ picture.category }}
                                    </a-tag>
                                    <a-tag
                                        v-for="tag in picture.tags"
                                        :key="tag"
                                    >
                                        {{ tag }}
                                    </a-tag>
                                </a-flex>
                            </template>
                        </a-card-meta>
                        <template
                            #actions
                            v-if="showActions"
                        >
                            <a-space @click="(e: MouseEvent) => doSearchByPicture(e, picture)">
                                <SearchOutlined />
                                搜索
                            </a-space>
                            <a-space
                                @click="(e: MouseEvent) => doEdit(e, picture)"
                                v-if="canEdit"
                            >
                                <EditOutlined />
                                编辑
                            </a-space>
                            <a-space
                                v-if="showShare"
                                @click="(e: MouseEvent) => doShare(e, picture)"
                            >
                                <ShareAltOutlined />
                                分享
                            </a-space>
                            <a-space
                                @click="(e: MouseEvent) => doDelete(e, picture)"
                                v-if="canDelete"
                            >
                                <DeleteOutlined />
                                删除
                            </a-space>
                        </template>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
        <ShareModal
            ref="shareModalRef"
            :link="shareLink"
        />
    </div>
</template>

<style scoped></style>
