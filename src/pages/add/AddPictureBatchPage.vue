<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { uploadPictureBatch } from '@/api/adminPictureController.ts'

const router = useRouter()

const formData = reactive<API.PictureUploadBatchRequest>({
    count: 10,
})
const loading = ref(false)

const handleSubmit = async () => {
    loading.value = true
    const res = await uploadPictureBatch({
        ...formData,
    }).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        return
    }
    message.success(`创建成功,共${res.data}条`)
    //跳转图片详情
    await router.push('/')
}
</script>

<template>
    <div id="add-picture-page">
        <h2 style="margin-bottom: 16px">批量创建图片</h2>

        <a-form
            name="formData"
            :model="formData"
            layout="vertical"
            @finish="handleSubmit"
        >
            <a-form-item
                name="searchText"
                label="关键词"
            >
                <a-input
                    v-model:value="formData.searchText"
                    placeholder="请输入关键词"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                name="count"
                label="抓取数量"
            >
                <a-input-number
                    v-model:value="formData.count"
                    placeholder="请输入抓取数量"
                    :autoSize="{ minRows: 2, maxRows: 5 }"
                    :min="1"
                    :max="30"
                    style="min-width: 180px"
                    allow-clear
                />
            </a-form-item>

            <a-form-item
                name="namePrefix"
                label="名称前缀"
            >
                <a-input
                    v-model:value="formData.namePrefix"
                    placeholder="请输入名称前缀,会自动补充序号"
                    allow-clear
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    size="large"
                    type="primary"
                    html-type="submit"
                    style="width: 100%"
                    :loading="loading"
                >
                    执行任务
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<style scoped>
#add-picture-page {
    max-width: 720px;
    margin: 0 auto;
}
</style>
