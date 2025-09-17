<template>
    <div id="picture-search-form">
        <a-form
            :model="searchParams"
            name="search"
            layout="inline"
        >
            <a-form-item
                label="日期"
                name="dateRange"
            >
                <a-range-picker
                    v-model:value="dateRange"
                    style="width: 350px"
                    show-time
                    :placeholder="['编辑开始时间', '编辑结束时间']"
                    format="YYYY/MM/DD HH:mm:ss"
                    :presets="rangePresets"
                    @change="onRangeChange"
                />
            </a-form-item>
            <a-form-item
                name="picWidth"
                label="宽度"
            >
                <a-input-number v-model:value="searchParams.picWidth" />
            </a-form-item>
            <a-form-item
                name="picHeight"
                label="高度"
            >
                <a-input-number v-model:value="searchParams.picHeight" />
            </a-form-item>
            <a-form-item
                name="reviewStatus"
                label="审核状态"
            >
                <a-select
                    v-model:value="searchParams.reviewStatus"
                    placeholder="请选择审核状态"
                    :options="PIC_REVIEW_STATUS_OPTIONS"
                    style="min-width: 180px"
                />
            </a-form-item>

            <a-form-item>
                <a-space>
                    <a-button
                        type="primary"
                        html-type="submit"
                        @click="doSearch"
                    >
                        搜索
                    </a-button>
                    <a-button
                        html-type="reset"
                        @click="doClear"
                    >
                        重置搜索条件
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import { PIC_REVIEW_STATUS_OPTIONS } from '@/constants/picture.ts'

interface Props {
    onSearch?: (searchParams: API.PictureQueryRequest) => void
}

type RangeValue = [Dayjs, Dayjs]
const props = defineProps<Props>()
//颜色搜图
const searchParams = reactive<API.PictureQueryRequest>({})
const dateRange = ref<[]>([])


const onRangeChange = (dates: RangeValue) => {
    if (dates?.length >= 2) {
        searchParams.startEditTime = dates[0].toDate()
        searchParams.endEditTime = dates[1].toDate()
    } else {
        searchParams.startEditTime = undefined
        searchParams.endEditTime = undefined
    }
}

// 时间范围预设
const rangePresets = ref([
    { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])
const doSearch = () => {
    props.onSearch?.(searchParams)
}
//清除搜索条件
const doClear = () => {
    Object.keys(searchParams).forEach(
        (key) => (searchParams[key as keyof API.PictureQueryRequest] = undefined),
    )
    dateRange.value = []
    props.onSearch?.(searchParams)
}
</script>

<style scoped>
#picture-search-form .ant-form-item {
    margin-top: 16px;
}

#picture-search-form {
    margin-bottom: 16px;
}
</style>
