<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getPictureRespById, searchPictureByPicture } from '@/api/pictureController.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const picture = ref<API.PictureResp>({})
const pictureId = computed(() => {
    return route.query.pictureId as string
})
//以图搜图列表
const dataList = ref<API.ImageItem[]>([])
const fetchPictureDetail = async () => {
    const res = await getPictureRespById({
        id: pictureId.value,
    })
    if (!res?.data) {
        return
    }
    picture.value = res.data
}
const fetchPictureList = async () => {
    loading.value = true
    const res = await searchPictureByPicture({
        pictureId: pictureId.value,
    }).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        return
    }
    dataList.value = res.data
}
onMounted(() => {
    fetchPictureDetail()
    fetchPictureList()
})
</script>

<template>
    <div id="search-picture-page">
        <h2 style="margin-bottom: 8px">以图搜图</h2>
        <h3 style="margin-bottom: 8px">原图</h3>
        <a-card hoverable>
            <template #cover>
                <img
                    :alt="picture.name"
                    :src="picture.thumbnailUrl ?? picture.url"
                    style="height: 450px; object-fit: contain"
                />
            </template>
        </a-card>
        <h3 style="margin: 8px 0">以图搜图结果</h3>
        <a-list
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
            :data-source="dataList"
            :loading="loading"
        >
            <template #renderItem="{ item: picture }">
                <a :href="picture.fromUrl">
                    <a-list-item style="padding: 0">
                        <a-card hoverable>
                            <template #cover>
                                <img
                                    alt=""
                                    :src="picture.thumbUrl"
                                    style="height: 180px; object-fit: cover"
                                />
                            </template>
                        </a-card>
                    </a-list-item>
                </a>
            </template>
        </a-list>
    </div>
</template>

<style scoped>
#search-picture-page {
    margin-bottom: 16px;
}
</style>
