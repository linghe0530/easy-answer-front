<script setup lang="ts">
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    ShareAltOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { deletePicture } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { computed, ref } from 'vue'
import ShareModal from '@/components/ShareModal.vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

interface Props {
    picture: API.PictureResp
    onReload?: () => void
}

const props = defineProps<Props>()
const router = useRouter()
const doClickPicture = () => {
    router.push(`/picture/${props.picture.id}`)
}

const loginUserStore = useLoginUserStore()
const hasAuth = computed(() => {
    return loginUserStore.loginUser.id === props.picture.userId
})
const doEdit = (e: MouseEvent) => {
    e.stopPropagation()

    router.push({
        path: '/picture/add',
        query: {
            id: props.picture.id,
        },
    })
}
// 删除数据
const doDelete = async (e: MouseEvent) => {
    // 阻止冒泡
    e.stopPropagation()
    const id = props.picture.id
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
const doSearchByPicture = async (e: MouseEvent) => {
    // 阻止冒泡
    e.stopPropagation()
    await router.push(`/picture/search?pictureId=${props.picture.id}`)
}
const shareModalRef = ref<InstanceType<typeof ShareModal>>()
const shareLink = ref<string>()
const doShare = (e: MouseEvent) => {
    e.stopPropagation()
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${props.picture.id}`
    shareModalRef.value?.openModal()
}
</script>

<template>
    <a-card
        id="picture-card"
        hoverable
        @click="doClickPicture"
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
        <template #actions>
            <a-space @click="(e: MouseEvent) => doSearchByPicture(e)">
                <SearchOutlined />
                搜索
            </a-space>
            <a-space
                @click="(e: MouseEvent) => doEdit(e)"
                v-if="hasAuth"
            >
                <EditOutlined />
                编辑
            </a-space>
            <a-space @click="(e: MouseEvent) => doShare(e)">
                <ShareAltOutlined />
                分享
            </a-space>
            <a-space
                @click="(e: MouseEvent) => doDelete(e)"
                v-if="hasAuth"
            >
                <DeleteOutlined />
                删除
            </a-space>
        </template>
    </a-card>
    <ShareModal
        ref="shareModalRef"
        :link="shareLink"
    />
</template>

<style scoped>
/* 图片卡片：增强立体感和hover效果 */
#picture-card {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
}

#picture-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);
}
</style>
