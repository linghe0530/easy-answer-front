<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from '@/constants/app.ts'
import { addApp, editApp, getAppRespById } from '@/api/appController.ts'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import AppIconUpload from '@/components/AppIconUpload.vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

const route = useRoute()
const router = useRouter()
const appId = computed(() => route.query.appId as string)
const isEditing = computed(() => !!appId.value)
const formRef = ref<FormInstance | null>(null)

// 表单数据
const formData = ref<API.AppAddRequest>({
    appType: 0,
    scoringStrategy: 0,
})
const loginUserStore = useLoginUserStore()
// 加载编辑数据
const loadData = async () => {
    if (!appId.value) return

    const res = await getAppRespById({ id: appId.value })
    if (!res?.data) {
        await router.push('/add/app')
        return
    }
    if (res.data.userId !== loginUserStore.loginUser.id) {
        message.warn('暂无权限修改应用')
        await router.push('/no_auth')
        return
    }
    formData.value = { ...res.data }
}

// 表单验证规则
const rules = {
    appName: [
        { required: true, message: '请输入应用名称', trigger: 'blur' },
        { min: 3, max: 80, message: '应用名称长度必须在 3-80 个字符之间', trigger: 'blur' },
    ],
    appDesc: [{ max: 450, message: '应用描述不能超过450个字符', trigger: 'blur' }],
    appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
    scoringStrategy: [{ required: true, message: '请选择评分策略', trigger: 'change' }],
}

// 监听appId变化加载数据
watchEffect(() => {
    if (appId.value) {
        loadData()
    }
})

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    // 表单验证
    await formRef.value.validate()

    let res
    if (isEditing.value) {
        res = await editApp({
            id: appId.value,
            ...formData.value,
        })
    } else {
        res = await addApp(formData.value)
    }

    if (!res) {
        return
    }
    message.success(isEditing.value ? '应用更新成功' : '应用创建成功')
    await router.push(`/app/detail/${appId.value ?? res?.data}`)
}
const onUploadSuccess = (url: string) => {
    formData.value = {
        ...formData.value,
        appIcon: url,
    }
}
</script>

<template>
    <div id="app-add-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <h1>{{ isEditing ? '编辑应用' : '创建应用' }}</h1>
            <p class="page-description">
                {{ isEditing ? '修改应用的基本信息和配置' : '填写应用信息，创建新的应用' }}
            </p>
        </div>

        <!-- 表单卡片 -->
        <div class="form-card">
            <a-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                name="appForm"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                autocomplete="off"
                @finish="handleSubmit"
            >
                <!-- 应用名称 -->
                <a-form-item
                    label="应用名称"
                    name="appName"
                    tooltip="请输入应用的名称，将用于展示和识别"
                >
                    <a-input
                        v-model:value="formData.appName"
                        placeholder="请输入应用名称"
                        max-length="50"
                        class="form-input"
                    />
                </a-form-item>

                <!-- 应用描述 -->
                <a-form-item
                    label="应用描述"
                    name="appDesc"
                    tooltip="简要描述应用的功能和用途"
                >
                    <a-textarea
                        v-model:value="formData.appDesc"
                        placeholder="请输入应用描述"
                        :rows="3"
                        max-length="200"
                        show-count
                        class="form-input"
                    />
                </a-form-item>

                <!-- 应用图标 -->
                <a-form-item
                    label="应用图标"
                    name="appIcon"
                    tooltip="输入图标的URL地址，建议尺寸为128x128像素"
                >
                    <a-input
                        v-model:value="formData.appIcon"
                        placeholder="请输入应用图标URL"
                        class="form-input"
                    />
                    <p class="form-hint">支持PNG、JPG、SVG格式，建议尺寸128x128px</p>
                </a-form-item>
                <AppIconUpload
                    :app-id="appId"
                    :url="formData.appIcon"
                    :on-success="onUploadSuccess"
                />
                <!-- 应用类型 -->
                <a-form-item
                    label="应用类型"
                    name="appType"
                    tooltip="选择应用所属的类型"
                    v-if="!appId"
                >
                    <a-select
                        v-model:value="formData.appType"
                        placeholder="请选择应用类型"
                        class="form-select"
                    >
                        <a-select-option
                            v-for="(value, key) in APP_TYPE_MAP"
                            :key="key"
                            :value="Number(key)"
                        >
                            {{ value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <!-- 评分策略 -->
                <a-form-item
                    label="评分策略"
                    name="scoringStrategy"
                    tooltip="选择应用使用的评分计算方式"
                    v-if="!appId"
                >
                    <a-select
                        v-model:value="formData.scoringStrategy"
                        placeholder="请选择评分策略"
                        class="form-select"
                    >
                        <a-select-option
                            v-for="(value, key) in APP_SCORING_STRATEGY_MAP"
                            :key="key"
                            :value="Number(key)"
                        >
                            {{ value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <!-- 操作按钮 -->
                <a-form-item class="form-actions">
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="submit-btn"
                    >
                        {{ isEditing ? '保存修改' : '创建应用' }}
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<style scoped>
#app-add-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px;
    background-color: #fafafa;
}

.page-header {
    margin-bottom: 32px;
    text-align: center;
}

.page-header h1 {
    font-size: 28px;
    color: #1f2329;
    margin-bottom: 8px;
    font-weight: 600;
}

.page-description {
    color: #6b7280;
    font-size: 16px;
    max-width: 600px;
    margin: 0 auto;
}

.form-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 32px;
    transition: box-shadow 0.3s ease;
}

.form-card:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.form-input,
.form-select {
    width: 100%;
    transition: all 0.2s ease;
}

.form-input:focus-within,
.form-select:focus-within {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

.form-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #8c8c8c;
    line-height: 1.5;
}

.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

.submit-btn {
    width: 140px;
    height: 40px;
    font-size: 16px;
    transition: all 0.2s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    #app-add-page {
        padding: 16px;
    }

    .form-card {
        padding: 24px 16px;
    }

    .page-header h1 {
        font-size: 24px;
    }
}
</style>
