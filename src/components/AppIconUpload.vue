<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { uploadPicture } from '@/api/fileController.ts'

interface Props {
    appId?: string
    url?: string
    onSuccess?: (url: string) => void
}

const props = defineProps<Props>()
const loading = ref<boolean>(false)
const handleUpload = async ({ file }: any) => {
    loading.value = true
    const res = await uploadPicture({ id: props.appId }, file).finally(() => {
        loading.value = false
    })
    if (!res || !res.data) {
        return
    }
    message.success('图片上传成功')
    props.onSuccess?.(res.data)
}
/**
 * 上传前的校验
 * @param file
 */
const beforeUpload = (file: File) => {
    // 校验图片格式
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('不支持上传该格式的图片，推荐 jpg 或 png')
    }
    // 校验图片大小
    const isGt2M = file.size > 2 * 1024 * 1024
    if (isGt2M) {
        message.error('不能上传超过 2M 的图片')
    }
    return isJpgOrPng && !isGt2M
}
</script>

<template>
    <div id="picture-upload">
        <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
        >
            <img
                v-if="url"
                :src="url"
                alt="picture"
            />
            <div v-else>
                <loading-outlined v-if="loading" />
                <plus-outlined v-else />
                <div class="ant-upload-text">Upload</div>
            </div>
        </a-upload>
    </div>
</template>

<style scoped>
#picture-upload :deep(.ant-upload) {
    width: 100%;
    height: 100%;
    min-width: 152px;
    min-height: 152px;
}

#picture-upload img {
    max-width: 100%;
    max-height: 480px;
}

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
