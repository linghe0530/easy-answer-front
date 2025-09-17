<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import ScoringResultTale from '@/components/add/ScoringResultTale.vue'
import { addScoringResult, editScoringResult } from '@/api/scoringResultController.ts'

interface Props {
    appId: string
}

const props = defineProps<Props>()

const formData = ref<API.ScoringResultAddRequest>({})

//修改评分id
const updateId = ref<string>()
const doUpdate = (oldScoringResult: API.ScoringResultResp) => {
    formData.value = oldScoringResult
    updateId.value = oldScoringResult.id
}
const tableRef = ref<InstanceType<typeof ScoringResultTale>>()
//提交
const handleSubmit = async () => {
    if (!props.appId) {
        return
    }
    let res
    if (updateId.value) {
        res = await editScoringResult({
            id: updateId.value,
            ...formData.value,
        })
    } else {
        res = await addScoringResult({
            appId: props.appId,
            ...formData.value,
        })
    }

    if (!res) {
        return
    }
    updateId.value = undefined
    formData.value = {}
    tableRef.value?.loadData()
    message.success('操作成功')
}
</script>

<template>
    <div id="add-scoringResult-page">
        <h2 style="margin-bottom: 32px">设置评分</h2>
        <a-form
            :style="{ width: '480px' }"
            :model="formData"
            name="appForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @submit="handleSubmit"
        >
            <a-form-item
                label="应用id"
                name="appId"
            >
                {{ appId }}
            </a-form-item>
            <a-form-item
                label="评分id"
                name="scoringResultId"
                v-if="updateId"
            >
                {{ updateId }}
            </a-form-item>

            <a-form-item
                label="结果名称"
                name="appName"
            >
                <a-input
                    v-model:value="formData.resultName"
                    placeholder="请输入结果名称"
                />
            </a-form-item>

            <a-form-item
                label="结果描述"
                name="appDesc"
            >
                <a-input
                    v-model:value="formData.resultDesc"
                    placeholder="请输入结果描述"
                />
            </a-form-item>
            <a-form-item
                label="结果图标"
                name="resultPicture"
            >
                <a-input
                    v-model:value="formData.resultPicture"
                    placeholder="请输入应用图标"
                />
            </a-form-item>

            <a-form-item
                label="结果集"
                name="resultProp"
            >
                <a-select
                    v-model:value="formData.resultProp"
                    mode="tags"
                    style="width: 100%"
                    :open="false"
                    placeholder="请输出结果集,按回车确认"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                label="结果得分范围"
                name="resultScoreRange"
            >
                <a-input-number
                    :min="1"
                    v-model:value="formData.resultScoreRange"
                    placeholder="请输入结果得分范围"
                    style="width: 320px"
                />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
                <a-button
                    type="primary"
                    html-type="submit"
                    style="width: 120px"
                >
                    提交
                </a-button>
            </a-form-item>
        </a-form>
        <ScoringResultTale
            ref="tableRef"
            :app-id="appId"
            :do-update="doUpdate"
        />
    </div>
</template>

<style scoped>
#add-scoringResult-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
