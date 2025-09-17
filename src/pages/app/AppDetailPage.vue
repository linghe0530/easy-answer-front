<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { getAppRespById } from '@/api/appController.ts'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from '@/constants/app.ts'
import dayjs from 'dayjs'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import { useRouter } from 'vue-router'

interface Props {
    id: string
}

const props = defineProps<Props>()
const router = useRouter()
const data = ref<API.AppResp>({})
const loadData = async () => {
    if (!props.id) {
        return
    }

    const res = await getAppRespById({
        id: props.id,
    })
    if (!res) {
        return
    }
    data.value = res.data as API.AppResp
}
watchEffect(() => {
    loadData()
})

const loginUserStore = useLoginUserStore()

//必须用computed
const isMy = computed(() => {
    const loginUser = loginUserStore.loginUser
    if (!loginUser.id) {
        return false
    }
    return loginUser.id === data.value.userId
})
</script>

<template>
    <div id="app-detail-page">
        <a-card>
            <a-row>
                <a-col
                    flex="auto"
                    class="content-wrapper"
                >
                    <h2>{{ data.appName }}</h2>
                    <p>{{ data.appDesc }}</p>
                    <p>应用类型：{{ APP_TYPE_MAP[data.appType as number] }}</p>
                    <p>评分策略：{{ APP_SCORING_STRATEGY_MAP[data.scoringStrategy as number] }}</p>
                    <p>
                        <a-space>
                            答题人:
                            <div :style="{ display: 'flex', alignItems: 'center' }">
                                <a-avatar
                                    :size="24"
                                    :src="data.user?.userAvatar"
                                    :style="{ marginRight: '8px' }"
                                />
                                <a-typography-text>
                                    {{ data.user?.userName ?? '无名' }}
                                </a-typography-text>
                            </div>
                        </a-space>
                    </p>
                    <p>答题时间: {{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                    <a-space
                        wrap
                        style="margin-bottom: 8px"
                    >
                        <a-button
                            type="primary"
                            @click="router.push(`/answer/do/${id}`)"
                        >
                            开始答题
                        </a-button>
                        <a-button>去分享</a-button>
                        <a-button
                            type="primary"
                            @click="router.push(`/add/question/${id}`)"
                            v-if="isMy"
                        >
                            设置题目
                        </a-button>
                        <a-button
                            type="primary"
                            :href="`/add/scoring_result/${id}`"
                            @click="router.push(`/add/scoring_result/${id}`)"
                            v-if="isMy"
                        >
                            设置评分
                        </a-button>
                        <a-button
                            type="primary"
                            :href="`/add/app?appId=${id}`"
                            v-if="isMy"
                        >
                            设置应用
                        </a-button>
                    </a-space>
                </a-col>
                <a-col flex="320px">
                    <a-image
                        style="width: 100%"
                        :src="data.appIcon"
                    />
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<style scoped>
#app-detail-page .content-wrapper > * {
    margin-bottom: 24px;
}
</style>
