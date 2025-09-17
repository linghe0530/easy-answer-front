<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title?: string
    link?: string
}

 withDefaults(defineProps<Props>(), {
    title: '分享图片',
    link: 'https://www.codefather.cn',
})

const open = ref<boolean>(false)

// 打开弹窗
const openModal = () => {
    open.value = true
}

// 暴露函数给父组件
defineExpose({
    openModal,
})

const handleCancel = () => {
    open.value = false
}
</script>

<template>
    <div id="share-modal">
        <a-modal
            v-model:open="open"
            title="分享图片"
            :footer="false"
            centered
            @cancel="handleCancel"
        >
            <h4>复制分享链接</h4>
            <a-typography-link
                copyable
                style="margin-bottom: 16px"
            >
                {{ link }}
            </a-typography-link>
            <h4>手机扫码查看</h4>
            <a-qrcode :value="link" />
        </a-modal>
    </div>
</template>

<style scoped></style>
