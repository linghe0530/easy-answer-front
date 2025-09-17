<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { genChartByAIAsync,  } from '@/api/chartController.ts'
import { type FormInstance, message, type UploadFile } from 'ant-design-vue'
import 'echarts'
import type { Rule } from 'ant-design-vue/es/form'

const formData = ref<API.GenChartByAIRequest>({}) //提交表单
const chart = ref<API.BiResponse>({}) //返回结果
const fileList = ref<UploadFile[]>([]) //上传文件列表
const loading = ref(false) //加载效果
const formRef = ref<FormInstance>()

const handleSubmit = async () => {
    // 添加表单验证
    formRef.value?.validate()
    if (!fileList.value[0]) {
        message.warning('请选择上传文件')
        return
    }
    const file = fileList.value[0].originFileObj as File
    if (file.size > 1024 * 1024) {
        message.warning('文件大小不能超过1MB')
        return
    }
    loading.value = true
    const res = await genChartByAIAsync(
        {
            ...formData.value,
        },
        fileList.value[0].originFileObj as File,
    ).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        return
    }
    chart.value = res.data
    formRef.value?.resetFields()
    fileList.value = []
    message.success('图表分析任务提交成功,请稍后查看结果')
}

const handleUpload = () => {
    return false
}

const rules: Record<string, Rule[]> = {
    name: [
        { required: true, message: '请输入名称', trigger: 'change' },
        { min: 2, max: 100, message: '名称长度在2-100之间', trigger: 'blur' },
    ],
    goal: [{ required: true, message: '请输入分析目标', trigger: 'change' }],
    chartType: [{ required: true, message: '请选择图表类型', trigger: 'change' }],
}
</script>

<template>
    <div id="add-chart">
        <main class="main-container">
            <div class="content-wrapper">
                <!-- 表单区域 -->
                <div class="form-card">
                    <h2 class="form-title">图表配置</h2>
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
                        <a-form-item
                            label="分析目标"
                            name="goal"
                            tooltip="请输入你的分析目标"
                            class="form-item"
                        >
                            <a-input
                                v-model:value="formData.goal"
                                placeholder="请输入你的分析目标"
                                class="form-input"
                            />
                        </a-form-item>

                        <a-form-item
                            label="图表名称"
                            name="name"
                            tooltip="请输入图表名称"
                            class="form-item"
                        >
                            <a-input
                                v-model:value="formData.name"
                                placeholder="请输入图表名称"
                                class="form-input"
                            />
                        </a-form-item>

                        <a-form-item
                            label="图表类型"
                            name="chartType"
                            tooltip="请选择图表类型"
                            class="form-item"
                        >
                            <a-select
                                v-model:value="formData.chartType"
                                class="form-select"
                            >
                                <a-select-option value="折线图">折线图</a-select-option>
                                <a-select-option value="柱状图">柱状图</a-select-option>
                                <a-select-option value="堆叠图">堆叠图</a-select-option>
                                <a-select-option value="饼图">饼图</a-select-option>
                                <a-select-option value="雷达图">雷达图</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item
                            label="原始数据"
                            tooltip="请选择文件"
                            class="form-item"
                        >
                            <div class="upload-container">
                                <a-upload
                                    v-model:file-list="fileList"
                                    :before-upload="handleUpload"
                                    :max-count="1"
                                    accept=".xlsx,.xls"
                                    class="upload-component"
                                >
                                    <a-button class="upload-button">
                                        <UploadOutlined></UploadOutlined>
                                        上传分析文件
                                    </a-button>
                                </a-upload>
                            </div>
                        </a-form-item>
                        <div style="text-align: center">
                            <a-button
                                type="primary"
                                html-type="submit"
                                :loading="loading"
                                class="submit-button"
                            >
                                生成图表
                            </a-button>
                        </div>
                    </a-form>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* 基础样式与变量定义 */
#add-chart {
    background-color: #f5f7fa;
    color: #333;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
}

/* 主容器 */
.main-container {
    max-width: 1400px;
    margin: 10px auto;
    padding: 0 1rem 2rem;
}

.content-wrapper {
    width: 100%;
    display: flex;
    gap: 2rem;
    padding-top: 10px;
}

/* 表单卡片 */
.form-card {
    width: 100%;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid #eee;
    font-weight: 600;
}

/* 表单项目样式 */
.form-item {
    margin-bottom: 1.5rem !important;
    transition: all 0.2s ease;
}

.form-item:hover {
    background-color: rgba(74, 144, 226, 0.03);
}

.form-input,
.form-select {
    border-radius: 6px !important;
    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease !important;
}

.form-input:focus,
.form-select:focus {
    border-color: #4a90e2 !important;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2) !important;
}

/* 上传区域样式 */
.upload-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.upload-button {
    transition: all 0.3s ease !important;
}

.upload-button:hover {
    transform: translateY(-2px);
}

/* 提交按钮 */

.submit-button {
    padding: 0 24px !important;
    height: 44px !important;
    font-size: 1rem !important;
    border-radius: 6px !important;
    background-color: #4a90e2 !important;
    border-color: #4a90e2 !important;
    transition: all 0.3s ease !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
    }

    .form-card {
        padding: 1.5rem;
        width: 100%;
    }
}
</style>
