<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from '@/constants/app.ts'
import dayjs from 'dayjs'
import { getUserAnswerRespById } from '@/api/userAnswerController.ts'

interface Props {
    id: string
}

const props = defineProps<Props>()

const data = ref<API.UserAnswerResp>({})
const loadData = async () => {
    if (!props.id) {
        return
    }

    const res = await getUserAnswerRespById({
        id: props.id as string,
    })
    if (!res) {
        return
    }
    data.value = res.data as API.UserAnswerResp
}
watchEffect(() => {
    loadData()
})
</script>

<template>
    <div id="answer-result-page">
        <a-card>
            <a-col
                flex="auto"
                class="content-wrapper"
            >
                <h2>{{ data.resultName }}</h2>
                <p>结果id:{{ data.resultId }}</p>
                <p>结果描述:{{ data.resultDesc }}</p>
                <p>结果得分:{{ data.resultScore }}</p>
                <p>我的答案:{{ data.choices }}</p>
                <p>应用id:{{ data.appId }}</p>
                <p>应用类型:{{ APP_TYPE_MAP[data.appType as number] }}</p>
                <p>评分策略:{{ APP_SCORING_STRATEGY_MAP[data.scoringStrategy as number] }}</p>
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
                <p>答题时间:{{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                <a-space size="middle">
                    <a-button
                        type="primary"
                        :href="`/answer/do/${data.appId}`"
                    >
                        去答题
                    </a-button>
                </a-space>
            </a-col>

        </a-card>
    </div>
</template>

<style scoped>
#answer-result-page .content-wrapper > * {
    margin-bottom: 24px;
}
</style>
