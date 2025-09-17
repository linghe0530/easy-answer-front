<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { MinusOutlined, PlusOutlined, SaveFilled } from '@ant-design/icons-vue'
import AiGenerateQuestionDrawer from '@/components/question/AiGenerateQuestionDrawer.vue'
import {
    addQuestion as addQuestionApi,
    editQuestion,
    listQuestionRespPage,
} from '@/api/questionController.ts'
import { message } from 'ant-design-vue'

interface Props {
    appId: string
}

const props = defineProps<Props>()
const router = useRouter()

// 题目内容结构
const questionContent = ref<API.QuestionContentDTO[]>([])
const addQuestion = (index: number) => {
    if (questionContent.value && questionContent.value.length >= 50) {
        message.warning('题目数量不能超过50')
        return
    }
    questionContent.value.splice(index, 0, {
        title: '',
        options: [],
    })
}
const removeQuestion = (index: number) => {
    questionContent.value.splice(index, 1)
}

const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
    if (!question.options) {
        question.options = []
    }
    if (question.options.length >= 5) {

    }
    question.options.splice(index, 0, {
        key: '',
        value: '',
    })
}
const removeQuestionOption = (question: API.QuestionContentDTO, index: number) => {
    if (!question.options) {
        question.options = []
    }
    question.options.splice(index, 1)
}
const oldQuestion = ref<API.QuestionResp>()
const handleSubmit = async () => {
    if (!props.appId || !questionContent.value) {
        return
    }
    let res: any
    // 如果是修改
    if (oldQuestion.value?.id) {
        res = await editQuestion({
            id: oldQuestion.value.id,
            questionContent: questionContent.value,
        })
    } else {
        // 创建
        res = await addQuestionApi({
            appId: props.appId ,
            questionContent: questionContent.value,
        })
    }
    if (!res) {
        return
    }
    await router.push(`/app/detail/${props.appId}`)
    message.success('操作成功，即将跳转到应用详情页')
}

/**
 * 加载数据
 */
const loadData = async () => {
    if (!props.appId) {
        return
    }
    const res = await listQuestionRespPage({
        appId: props.appId,
        current: 1,
        pageSize: 1,
    })
    if (!res || !res.data) {
        return
    }
    oldQuestion.value = res.data.records?.[0]
    if (oldQuestion.value) {
        questionContent.value = oldQuestion.value.questionContent ?? []
    }
}

// 获取旧数据
watchEffect(() => {
    loadData()
})
const onGenerateSuccess = (result: API.QuestionContentDTO[]) => {
    questionContent.value = [...questionContent.value, ...result]
}

const onGenerateSuccessSse = (result: API.QuestionContentDTO) => {
    questionContent.value.push(result)
    console.log(questionContent.value)
}

const onSseStart = () => {
    console.log('开始生成题目')
}
const onSseClose = () => {
    console.log('开始生成题目')
}
</script>

<template>
    <div
        id="add-question-page"
        class="container"
    >
        <div class="card">
            <div class="card-header">
                <h2>设置题目</h2>
                <p class="subtitle">配置应用的题目和选项内容</p>
            </div>

            <a-form
                class="question-form"
                :model="questionContent"
                name="appForm"
                autocomplete="off"
                @submit.prevent="handleSubmit"
            >
                <a-form-item
                    label="应用ID"
                    name="appId"
                    class="form-item"
                >
                    <div>{{ appId }}</div>
                </a-form-item>

                <a-form-item
                    label="题目列表"
                    name="questions"
                    class="form-item"
                >
                    <div class="question-actions">
                        <a-space>
                            <a-button
                                type="dashed"
                                @click="addQuestion(questionContent.length)"
                                class="action-btn add-question-btn"
                            >
                                <PlusOutlined />
                                添加题目
                            </a-button>
                            <AiGenerateQuestionDrawer
                                :app-id="appId"
                                :on-success="onGenerateSuccess"
                                :on-sse-success="onGenerateSuccessSse"
                                :on-sse-start="onSseStart"
                                :on-sse-close="onSseClose"
                            />
                        </a-space>
                    </div>

                    <div
                        v-for="(question, index) in questionContent"
                        :key="index"
                        class="question-card"
                    >
                        <div class="question-header">
                            <div class="question-number">题目 {{ index + 1 }}</div>
                            <div class="question-actions">
                                <a-button
                                    type="text"
                                    @click="addQuestion(index + 1)"
                                    class="icon-btn"
                                >
                                    <PlusOutlined />
                                </a-button>
                                <a-button
                                    type="text"
                                    danger
                                    @click="removeQuestion(index)"
                                    class="icon-btn"
                                    tooltip="删除题目"
                                >
                                    <MinusOutlined />
                                </a-button>
                            </div>
                        </div>

                        <a-form-item
                            class="form-item"
                            :label="`题目 ${index + 1} 标题`"
                        >
                            <a-input
                                v-model:value="question.title"
                                placeholder="请输入题目标题"
                                class="question-input"
                            />
                        </a-form-item>

                        <div class="options-section">
                            <div class="options-header">
                                <div class="options-label">选项列表</div>
                                <a-button
                                    type="dashed"
                                    @click="
                                        addQuestionOption(
                                            question,
                                            question.options ? question.options.length : 0,
                                        )
                                    "
                                    class="action-btn add-option-btn"
                                >
                                    <PlusOutlined />
                                    添加选项
                                </a-button>
                            </div>

                            <div
                                v-for="(option, optionIndex) in question.options"
                                :key="optionIndex"
                                class="option-item"
                            >
                                <a-form-item
                                    class="form-item option-form-item"
                                    :label="`选项 ${String.fromCharCode(65 + optionIndex)}`"
                                >
                                    <a-flex>
                                        <a-input
                                            v-model:value="option.value"
                                            placeholder="请输入选项内容"
                                            class="option-input"
                                        />
                                        <a-button
                                            type="text"
                                            danger
                                            @click="removeQuestionOption(question, optionIndex)"
                                            class="remove-option-btn"
                                            v-if="question.options && question.options.length > 1"
                                        >
                                            <MinusOutlined />
                                        </a-button>
                                    </a-flex>
                                </a-form-item>
                            </div>
                        </div>
                    </div>
                </a-form-item>

                <div class="form-actions">
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="submit-btn"
                    >
                        <SaveFilled />
                        保存题目
                    </a-button>
                </div>
            </a-form>
        </div>
    </div>
</template>

<style scoped>
#add-question-page {
    padding: 2rem;
    background-color: #f5f7fa;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.card {
    width: 100%;
    max-width: 800px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}

/*.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}*/

.card-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f0f2f5;
}

.card-header h2 {
    margin: 0 0 0.5rem 0;
    color: #1d2129;
    font-size: 1.5rem;
    font-weight: 600;
}

.subtitle {
    margin: 0;
    color: #86909c;
    font-size: 0.9rem;
}

.question-form {
    padding: 2rem;
}

.form-item {
    margin-bottom: 1.5rem !important;
}

.question-actions {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.75rem;
}

.action-btn {
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.add-question-btn {
    background-color: #e8f4fd;
    border-color: #b3d7f2;
    color: #1890ff;
}

.question-card {
    background-color: #fafafa;
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
}

.question-card:hover {
    border-color: #e0e0e0;
    background-color: #f5f5f5;
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px dashed #e0e0e0;
}

.question-number {
    font-weight: 500;
    color: #4e5969;
    font-size: 1rem;
}

.question-actions {
    display: flex;
    gap: 0.5rem;
}

.icon-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.icon-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.question-input {
    width: 100%;
}

.options-section {
    margin-top: 1rem;
}

.options-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.options-label {
    font-weight: 500;
    color: #4e5969;
    font-size: 0.9rem;
}

.add-option-btn {
    background-color: #f0f7ff;
    border-color: #c6e2ff;
    color: #0050b3;
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
}

.option-item {
    position: relative;
    transition: all 0.2s ease;
}

.option-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 6px;
}

.option-form-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.option-input {
    flex: 1;
}

.remove-option-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    opacity: 0.7;
    transition: all 0.2s ease;
}

.remove-option-btn:hover {
    opacity: 1;
    background-color: rgba(245, 34, 45, 0.1);
}

.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.submit-btn {
    font-size: 1rem;
    background-color: #1890ff;
    border-color: #1890ff;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .card {
        max-width: 100%;
    }

    .question-form {
        padding: 1.25rem;
    }

    .question-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .options-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
}
</style>
