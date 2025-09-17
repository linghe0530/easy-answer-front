<template>
    <div>
        <a-modal
            class="image-cropper"
            v-model:open="open"
            title="编辑图片"
            :footer="false"
            @cancel="closeModal"
        >
            <!-- 图片裁切组件 -->
            <VueCropper
                ref="cropperRef"
                :img="imageUrl"
                output-type="png"
                :info="true"
                :can-move-box="true"
                :fixed-box="false"
                :auto-crop="true"
                :center-box="true"
            />
            <div
                class="image-cropper-actions"
                style="padding-top: 16px"
            >
                <a-space>
                    <a-button @click="rotateLeft">向左旋转</a-button>
                    <a-button @click="rotateRight">向右旋转</a-button>
                    <a-button @click="changeScale(1)">放大</a-button>
                    <a-button @click="changeScale(-1)">缩小</a-button>
                    <a-button
                        type="primary"
                        :loading="loading"
                        @click="handleConfirm"
                    >
                        确认
                    </a-button>
                </a-space>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { VueCropper } from 'vue-cropper'
import { ref } from 'vue'
import { uploadPicture } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
    imageUrl?: string
    picture?: API.PictureResp
    onSuccess?: (newPicture: API.PictureResp) => void
}

const props = defineProps<Props>()
const loading = ref(false)

// const cropperRef = ref<InstanceType<typeof VueCropper>>()
const cropperRef = ref<any>()

// 向左旋转
const rotateLeft = () => {
    cropperRef.value?.rotateLeft()
}

// 向右旋转
const rotateRight = () => {
    cropperRef.value?.rotateRight()
}
// 放大缩小
const changeScale = (size: number) => {
    cropperRef.value?.changeScale(size)
}
/**
 * 确认裁剪
 */
const handleConfirm = () => {
    cropperRef.value?.getCropBlob((blob: Blob) => {
        const fileName = (props.picture?.name || 'image') + '.png'
        const file = new File([blob], fileName, { type: blob.type })
        handleUpload({ file })
    })
}
const handleUpload = async ({ file }: any) => {
    loading.value = true
    const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
    const res = await uploadPicture(params, file).finally(() => {
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
.image-cropper {
    text-align: center;
}

.image-cropper .vue-cropper {
    height: 400px !important;
}
</style>
