<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { editPicture, getPictureRespById, listPictureTagCategory } from '@/api/pictureController.ts'
import { useRoute, useRouter } from 'vue-router'
import { EditOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import PictureUpload from '@/components/picture/PictureUpload.vue'
import UrlPictureUpload from '@/components/picture/UrlPictureUpload.vue'
import ImageCropper from '@/components/picture/ImageCropper.vue'
import ImageOutPainting from '@/components/picture/ImageOutPainting.vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

const loginUserStore = useLoginUserStore()
const router = useRouter()
const route = useRoute()
const picture = ref<API.PictureResp>()
const pictureForm = reactive<API.PictureEditRequest>({})
//文件上传方式
const uploadType = ref('file')

interface Option {
    label: string
    value: string
}

const categoryOptions = ref<Option[]>([])
const tagsOptions = ref<Option[]>([])
/**
 * 编辑图片
 * @param values
 */
const handleSubmit = async (values: any) => {
    const pictureId = picture.value?.id
    if (!pictureId) {
        return
    }
    const res = await editPicture({
        id: pictureId,
        ...values,
    })
    if (!res) {
        return
    }
    message.success('操作成功')
    await router.push(`/picture/${pictureId}`)
}
/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureResp) => {
    picture.value = newPicture
    pictureForm.name = newPicture.name
}

const getTagCategoryOptions = async () => {
    const res = await listPictureTagCategory()
    if (!res?.data) {
        return
    }
    tagsOptions.value = (res.data.tagList ?? []).map((data) => {
        return {
            label: data,
            value: data,
        }
    })
    categoryOptions.value = (res.data.categoryList ?? []).map((data) => {
        return {
            label: data,
            value: data,
        }
    })
}
const getOldPicture = async () => {
    const id = route.query?.id
    if (!id) {
        return
    }
    const res = await getPictureRespById({
        id: id as string,
    })
    if (!res?.data) {
        return
    }
    const loginUser = loginUserStore.loginUser
    if (!loginUser || (loginUser?.id !== res.data.userId )) {
        await router.push('/picture')
        message.warn('暂无权限访问')
        return
    }
    picture.value = res.data
    pictureForm.name = res.data.name
    pictureForm.introduction = res.data.introduction
    pictureForm.category = res.data.category
    pictureForm.tags = res.data.tags || []
}
onMounted(() => {
    getTagCategoryOptions()
    getOldPicture()
})
// 裁剪图片
const imageCropperRef = ref<InstanceType<typeof ImageCropper>>()
const doEditPicture = () => {
    console.log(picture.value)
    imageCropperRef.value?.openModal()
}
const onCropSuccess = (newPicture: API.PictureResp) => {
    picture.value = newPicture
}
// ai扩图
const imageOutPaintingRef = ref<InstanceType<typeof ImageOutPainting>>()
const doImagePainting = () => {
    imageOutPaintingRef.value?.openModal()
}
const onImagePaintingSuccess = (newPicture: API.PictureResp) => {
    picture.value = newPicture
}
</script>

<template>
    <div id="add-picture-page">
        <h2 style="margin-bottom: 16px">
            {{ route.query.id ? '编辑图片' : '创建图片' }}
        </h2>
        <a-tabs v-model:active-key="uploadType">
            <a-tab-pane
                key="file"
                tab="文件上传"
            >
                <PictureUpload
                    :picture="picture"
                    :onSuccess="onSuccess"
                />
            </a-tab-pane>
            <a-tab-pane
                key="url"
                tab="URL上传"
            >
                <UrlPictureUpload
                    :picture="picture"
                    :onSuccess="onSuccess"
                />
            </a-tab-pane>
        </a-tabs>
        <div
            v-if="picture"
            class="edit-bar"
        >
            <a-space>
                <a-button
                    :icon="h(EditOutlined)"
                    @click="doEditPicture"
                >
                    编辑图片
                </a-button>
                <a-button
                    type="primary"
                    :icon="h(FullscreenOutlined)"
                    @click="doImagePainting"
                >
                    AI 扩图
                </a-button>
            </a-space>
        </div>
        <a-form
            v-if="picture"
            name="pictureForm"
            :model="pictureForm"
            layout="vertical"
            @finish="handleSubmit"
        >
            <a-form-item
                name="name"
                label="名称"
            >
                <a-input
                    v-model:value="pictureForm.name"
                    placeholder="请输入名称"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                name="introduction"
                label="简介"
            >
                <a-textarea
                    v-model:value="pictureForm.introduction"
                    placeholder="请输入简介"
                    :autoSize="{ minRows: 2, maxRows: 5 }"
                />
            </a-form-item>
            <a-form-item
                name="category"
                label="分类"
            >
                <a-auto-complete
                    v-model:value="pictureForm.category"
                    placeholder="请输入分类"
                    :options="categoryOptions"
                />
            </a-form-item>
            <a-form-item
                name="tags"
                label="标签"
            >
                <a-select
                    v-model:value="pictureForm.tags"
                    mode="tags"
                    placeholder="请输入标签"
                    :options="tagsOptions"
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    style="width: 100%"
                >
                    {{ route.query.id ? '编辑图片' : '创建图片' }}
                </a-button>
            </a-form-item>
        </a-form>
        <ImageCropper
            ref="imageCropperRef"
            :image-url="picture?.url"
            :picture="picture"
            :onSuccess="onCropSuccess"
        />
        <ImageOutPainting
            ref="imageOutPaintingRef"
            :picture="picture"
            :onSuccess="onImagePaintingSuccess"
        />
    </div>
</template>

<style scoped>
#add-picture-page {
    max-width: 720px;
    margin: 0 auto;
}

#add-picture-page .edit-bar {
    text-align: center;
    margin: 16px 0;
}
</style>
