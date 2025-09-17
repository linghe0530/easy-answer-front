<script setup lang="ts">
import { ref } from 'vue'
import { aiGenerateQuestion } from '@/api/questionController.ts'
import { message } from 'ant-design-vue'

interface Props {
    appId: string
    onSuccess: (result: API.QuestionContentDTO[]) => void
    onSseStart?: (event: Event) => void
    onSseClose?: (event: Event) => void
    onSseSuccess?: (result: API.QuestionContentDTO) => void
}

const props = defineProps<Props>()
//是否展示抽屉
const open = ref<boolean>(false)

const showDrawer = () => {
    open.value = true
}

const formData = ref<API.AiGenerateQuestionRequest>({
    questionNum: 5,
    optionNum: 4,
})
// 是否正在生成中
const submitting = ref<boolean>(false)
const handleSubmit = async () => {
    if (!props.appId) {
        message.error('应用不存在')
        return
    }
    submitting.value = true
    const res = await aiGenerateQuestion({
        appId: props.appId,
        ...formData.value,
    }).finally(() => {
        submitting.value = false
    })
    if (!res || !res.data) {
        return
    }
    props.onSuccess(res.data)
    message.success('生成题目成功')
    open.value = false
}
//实时生成
const handleSse = async () => {
    if (!props.appId) {
        message.error('应用不存在')
        return
    }
    submitting.value = true
    const eventSource = new EventSource(
        `http://127.0.0.1:8081/question/ai_generate/sse?appId=${props.appId}&questionNum=${formData.value.questionNum}&optionNum=${formData.value.optionNum}`,
        {
            withCredentials:true
        }
    )
    open.value = false

    eventSource.onmessage = function (event) {
        const result = JSON.parse(event.data)
        console.log(result)
        props.onSseSuccess?.(result)
    }
    eventSource.onerror = function (event) {
        if (event.eventPhase === EventSource.CLOSED) {
            console.log('连接关闭')
            eventSource.close()
            props.onSseClose?.(event)
            message.success('生成题目完毕')
        } else {
            message.success('生成题目失败')
        }
        submitting.value = false
    }
    eventSource.onopen = function (event) {
        console.log('连接打开')
        props.onSseStart?.(event)
    }
}
</script>

<template>
    <div id="ai-generate-question-drawer">
        <a-button
            type="primary"
            @click="showDrawer"
        >
            AI生成题目
        </a-button>
        <a-drawer
            v-model:open="open"
            :root-style="{ color: 'blue' }"
            style="color: red"
            title="AI生成题目"
            placement="right"
            destroyOnClose
        >
            <a-form
                :model="formData"
                label-align="left"
                @submit="handleSubmit"
            >
                <a-form-item label="应用 id">
                    {{ appId }}
                </a-form-item>
                <a-form-item
                    field="questionNum"
                    label="题目数量"
                >
                    <a-input-number
                        style="width: 100%"
                        min="1"
                        max="20"
                        v-model:value="formData.questionNum"
                        placeholder="请输入题目数量"
                    />
                </a-form-item>
                <a-form-item
                    field="optionNum"
                    label="选项数量"
                >
                    <a-input-number
                        style="width: 100%"
                        min="2"
                        max="5"
                        v-model:value="formData.optionNum"
                        placeholder="请输入选项数量"
                    />
                </a-form-item>
                <a-form-item style="text-align: center">
                    <a-space>
                        <a-button
                            :loading="submitting"
                            type="primary"
                            html-type="submit"
                            style="width: 120px"
                        >
                            {{ submitting ? '生成中' : '一键生成' }}
                        </a-button>

                        <a-button
                            @click="handleSse"
                            :loading="submitting"
                            style="width: 120px"
                        >
                            {{ submitting ? '生成中' : '实时生成' }}
                        </a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>

<style scoped></style>
