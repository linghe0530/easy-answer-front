<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureByUrl } from '@/api/pictureController.ts'

interface Props {
    picture?: API.PictureResp
    onSuccess?: (newPicture: API.PictureResp) => void
}

const props = defineProps<Props>()
const fileUrl = ref<string>()
const loading = ref<boolean>(false)
const handleUpload = async () => {
    loading.value = true
    const params: API.PictureUploadRequest = {
        fileUrl: fileUrl.value,
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

}
</script>

<template>
    <div id="url-picture-upload">
        <a-input-group
            compact
            size="large"
        >
            <a-input
                v-model:value="fileUrl"
                style="width: calc(100% - 120px)"
            />
            <a-button
                type="primary"
                style="width: 120px"
                @click="handleUpload"
                :loading="loading"
            >
                上传
            </a-button>
        </a-input-group>
        <div class="image-wrapper">
            <img
                v-if="picture?.url"
                :src="picture?.url"
                alt="picture"
            />
        </div>
    </div>
</template>

<style scoped>
#url-picture-upload {
    width: 100%;
    height: 100%;
    min-width: 152px;
    min-height: 152px;
    margin-bottom: 16px;
}

#url-picture-upload img {
    max-width: 100%;
    max-height: 480px;
}

#url-picture-upload .image-wrapper {
    text-align: center;
    margin-top: 16px;
}
</style>
