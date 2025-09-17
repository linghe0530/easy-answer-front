<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { deletePicture, getPictureRespById } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { downloadImage, formatSize, toHexColor } from '@/utils'
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    ShareAltOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import ShareModal from '@/components/ShareModal.vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import AccessEnum from '@/access/accessEnum.ts'

interface Props {
    id: string
}

const props = defineProps<Props>()
const router = useRouter()
const picture = ref<API.PictureResp>({})
const shareModalRef = ref<InstanceType<typeof ShareModal>>()
const shareLink = ref<string>()

const loginUserStore = useLoginUserStore()
const hasAuth = computed(() => {
    return (
        loginUserStore.loginUser.id === picture.value.userId ||
        loginUserStore.loginUser.userRole === AccessEnum.ADMIN
    )
})
const fetchPictureDetail = async () => {
    const res = await getPictureRespById({
        id: props.id as string,
    })
    if (!res?.data) {
        return
    }
    picture.value = res.data
}

const doDelete = async () => {
    const id = picture.value.id
    if (!id) {
        return
    }
    const res = await deletePicture({
        id,
    })
    if (!res) {
        return
    }
    await router.push({
        path: '/',
        replace: true,
    })
    message.success('删除成功')
}
const doEdit = () => {
    router.push({
        path: '/picture/add',
        query: {
            id: picture.value.id,
        },
    })
}
const doDownload = () => {
    if (!loginUserStore.loginUser.id) {
        message.error('请先登录')
        router.push('/user/login')
        return
    }
    downloadImage(picture.value.url)
}

const doShare = (e: MouseEvent, picture: API.PictureResp) => {
    e.stopPropagation()
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
    shareModalRef.value?.openModal()
}
onMounted(() => {
    fetchPictureDetail()
})
</script>

<template>
    <div id="picture-detail-page">
        <a-row :gutter="[16, 16]">
            <!--            图片预览         -->
            <a-col
                :sm="24"
                :md="16"
                :xl="18"
            >
                <a-card title="图片预览">
                    <a-image
                        :src="picture.url"
                        style="max-height: 600px; object-fit: contain"
                    />
                </a-card>
            </a-col>
            <a-col
                :sm="24"
                :md="8"
                :xl="6"
            >
                <a-card title="图片信息">
                    <a-descriptions :column="1">
                        <a-descriptions-item label="作者">
                            <a-space>
                                <a-avatar
                                    v-if="picture.user?.userAvatar"
                                    :size="24"
                                    :src="picture.user?.userAvatar"
                                />

                                <div>{{ picture.user?.userName }}</div>
                            </a-space>
                        </a-descriptions-item>
                        <a-descriptions-item label="名称">
                            {{ picture.name ?? '未命名' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="简介">
                            {{ picture.introduction ?? '-' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="分类">
                            {{ picture.category ?? '默认' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="标签">
                            <a-tag
                                v-for="tag in picture.tags"
                                :key="tag"
                            >
                                {{ tag }}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="格式">
                            {{ picture.picFormat ?? '-' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="宽度">
                            {{ picture.picWidth ?? '-' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="高度">
                            {{ picture.picHeight ?? '-' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="宽高比">
                            {{ picture.picScale ?? '-' }}
                        </a-descriptions-item>
                        <a-descriptions-item label="大小">
                            {{ formatSize(picture.picSize) }}
                        </a-descriptions-item>
                        <a-descriptions-item label="主色调">
                            <a-space>
                                {{ picture.picColor ?? '-' }}
                                <div
                                    v-if="picture.picColor"
                                    :style="{
                                        width: '16px',
                                        height: '16px',
                                        background: toHexColor(picture.picColor),
                                    }"
                                />
                            </a-space>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-space wrap>
                        <a-button
                            type="primary"
                            @click="doDownload"
                        >
                            免费下载
                            <template #icon>
                                <DownloadOutlined />
                            </template>
                        </a-button>
                        <a-button
                            :icon="h(EditOutlined)"
                            type="default"
                            @click="doEdit"
                            v-if="hasAuth"
                        >
                            编辑
                        </a-button>
                        <a-button
                            :icon="h(ShareAltOutlined)"
                            @click="(e: MouseEvent) => doShare(e, picture)"
                        >
                            分享
                        </a-button>
                        <a-button
                            :icon="h(DeleteOutlined)"
                            danger
                            @click="doDelete"
                            v-if="hasAuth"
                        >
                            删除
                        </a-button>
                    </a-space>
                </a-card>
            </a-col>
        </a-row>
        <ShareModal
            ref="shareModalRef"
            :link="shareLink"
        />
    </div>
</template>

<style scoped>
#picture-detail-page {
    margin-bottom: 16px;
}
</style>
