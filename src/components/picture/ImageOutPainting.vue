<template>
    <div>
        <a-modal
            class="image-out-painting"
            v-model:open="open"
            title="AI扩图"
            :footer="false"
            @cancel="closeModal"
        >
            <a-row :gutter="16">
                <a-col :span="12">
                    <h4>原始图片</h4>
                    <img
                        :src="picture?.url"
                        :alt="picture?.name"
                        style="max-width: 100%"
                    />
                </a-col>
                <a-col :span="12">
                    <h4>扩图结果</h4>
                    <img
                        v-if="resultImageUrl"
                        :src="resultImageUrl"
                        :alt="picture?.name"
                        style="max-width: 100%"
                    />
                </a-col>
            </a-row>
            <a-flex
                justify="center"
                style="margin-top: 16px"
            >
                <a-space>
                    <a-button
                        type="primary"
                        ghost
                        @click="createTask"
                        :loading="!!taskId"
                    >
                        生成图片
                    </a-button>
                    <a-button
                        v-if="resultImageUrl"
                        :loading="loading"
                        type="primary"
                        @click="handleUpload"
                    >
                        应用结果
                    </a-button>
                </a-space>
            </a-flex>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import {
    createPictureOutPaintingTask,
    getPictureOutPaintingTask,
    uploadPictureByUrl,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
    picture?: API.PictureResp
    onSuccess?: (newPicture: API.PictureResp) => void
}

const props = defineProps<Props>()
const loading = ref(false)
const resultImageUrl = ref<string>()
//任务id
const taskId = ref<string>()

const createTask = async () => {
    if (!props.picture?.id) {
        return
    }
    loading.value = true
    const res = await createPictureOutPaintingTask({
        pictureId: props.picture?.id,
        parameters: {
            xScale: 1.5,
            yScale: 1.5,
        },
    }).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        return
    }
    message.success('创建任务成功，请耐心等待，不要退出界面')
    taskId.value = res.data.output?.taskId
    //开始轮询
    startPolling()
}

let pollingTimer: any = null
const startPolling = () => {
    if (!taskId.value) {
        return
    }
    pollingTimer = setInterval(async () => {
        try {
            const res = await getPictureOutPaintingTask(
                {
                    taskId: taskId.value as string,
                },
                {
                    showError: false,
                    onError: () => {
                        message.error('扩图任务失败:' + res.msg)
                        // 清理轮询
                        clearPolling()
                    },
                },
            )
            if (!res?.data) {
                return
            }
            const taskResult = res.data.output
            if (taskResult?.taskStatus === 'SUCCEEDED') {
                message.success('扩图任务执行成功')
                //todo
                // resultImageUrl.value = taskResult['outputImageUrl']
                // 清理轮询
                clearPolling()
            } else if (taskResult?.taskStatus === 'FAILED') {
                message.error('扩图任务执行失败')
                // 清理轮询
                clearPolling()
            }
        } catch (e: any) {
            console.error('扩图任务轮询失败', e)
            message.error('扩图任务轮询失败，' + e.message)
            // 清理轮询
            clearPolling()
        }
    }, 3000)
}
const clearPolling = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer)
        pollingTimer = null
        taskId.value = undefined
    }
}
const handleUpload = async () => {
    loading.value = true
    const params: API.PictureUploadRequest = {
        fileUrl: resultImageUrl.value,
    }
    if (props.picture) {
        params.id = props.picture.id
    }
    const res = await uploadPictureByUrl(params).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        return
    }
    message.success('图片上传成功')
    props.onSuccess?.(res.data)
    closeModal()
}
const open = ref<boolean>(false)
// 打开弹窗
const openModal = () => {
    open.value = true
}
// 暴露函数给父组件
defineExpose({
    openModal,
})
const closeModal = () => {
    open.value = false
}
</script>

<style>
.image-out-painting {
    text-align: center;
}
</style>
