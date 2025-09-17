<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getAppRespById } from '@/api/appController.ts'
import { listQuestionRespPage } from '@/api/questionController.ts'
import type { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface'
import { addUserAnswer, generateUserAnswerId } from '@/api/userAnswerController.ts'
import { useRouter } from 'vue-router'

interface Props {
    appId: string
}

const router = useRouter()
const props = defineProps<Props>()
const app = ref<API.AppResp>({})
const questionContent = ref<API.QuestionContentDTO[]>([])
const loadData = async () => {
    if (!props.appId) {
        return
    }
    let res: any = await getAppRespById({
        id: props.appId,
    })
    if (!res || !res.data) {
        return
    }
    app.value = res.data
    res = await listQuestionRespPage({
        appId: props.appId,
        current: 1,
        pageSize: 1,
    })
    if (!res || !res.data) {
        return
    }
    if (res.data.records.length > 0) {
        questionContent.value = res.data.records[0].questionContent
    }
}

//当前题目序号
const current = ref(1)
//当前题目
const currentQuestion = ref<API.QuestionContentDTO>({})
const questionOptions = computed(() => {
    return currentQuestion.value.options
        ? currentQuestion.value.options.map((option) => {
              return {
                  label: `${option.key}.${option.value}`,
                  value: option,
              }
          })
        : []
})
const currentAnswer = ref<string>()
// 回答列表
const answerList = ref<string[]>([])

const doOptionChange = (e: ChangeEvent) => {
    answerList.value[current.value - 1] = e.target.value as string
}
// 提交答案
const submitting = ref(false)
const doSubmit = async () => {
    if (!props.appId || !answerList.value || answerList.value.length === 0) {
        return
    }
    submitting.value = true
    const res = await addUserAnswer({
        id: answerId.value as string,
        appId: props.appId,
        choices: answerList.value,
    }).finally(() => {
        submitting.value = false
    })
    if (!res || !res.data) {
        return
    }
    await router.push(`/answer/result/${res.data}`)
}
watch(
    () => props.appId,
    () => {
        loadData()
    },
    {
        immediate: true,
    },
)
watch(
    () => [current.value, questionContent.value, answerList.value],
    () => {
        if (questionContent.value && questionContent.value.length > 0) {
            currentQuestion.value = questionContent.value[current.value - 1]
        }
        if (answerList.value && answerList.value.length > 0) {
            currentAnswer.value = answerList.value[current.value - 1]
        }
    },
)
const answerId = ref<string>()
const generateId = async () => {
    const res = await generateUserAnswerId()
    if (!res || !res.data) {
        return
    }
    answerId.value = res.data
}
onMounted(() => {
    generateId()
})
</script>

<template>
    <div id="do-answer-page">
        <a-card>
            <h1>{{ app.appName }}</h1>
            <p>{{ app.appDesc }}</p>
            <h2 style="margin-bottom: 32px">{{ current }}·{{ currentQuestion.title }}</h2>
            <div>
                <a-radio-group
                    v-model:value="currentAnswer"
                    @change="doOptionChange"
                >
                    <a-radio
                        style="display: flex; height: 32px; line-height: 32px"
                        :value="option.value.key"
                        v-for="option in questionOptions"
                        :key="option.value.key"
                    >
                        {{ option.value.key }}、{{ option.value.value }}
                    </a-radio>
                </a-radio-group>
            </div>
            <div style="margin-top: 16px">
                <a-space>
                    <a-button
                        type="primary"
                        v-if="current > 1"
                        @click="current--"
                    >
                        上一题
                    </a-button>
                    <a-button
                        type="primary"
                        v-if="current < questionContent.length"
                        :disabled="!currentAnswer"
                        @click="current++"
                    >
                        下一题
                    </a-button>
                    <a-button
                        type="primary"
                        v-if="current === questionContent.length"
                        :disabled="!currentAnswer"
                        :loading="submitting"
                        @click="doSubmit"
                    >
                        查看结果
                    </a-button>
                </a-space>
            </div>
        </a-card>
    </div>
</template>

<style scoped></style>
