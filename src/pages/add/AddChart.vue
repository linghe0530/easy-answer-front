<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { genChartByAi } from '@/api/chartController.ts'
import { message, type UploadFile } from 'ant-design-vue'
import VChart from 'vue-echarts'
import 'echarts'
import type { Rule } from 'ant-design-vue/es/form'

const formData = ref<API.GenChartByAIRequest>({}) //提交表单
const chart = ref<API.BiResponse>({}) //返回结果
const fileList = ref<UploadFile[]>([]) //上传文件列表
const loading = ref(false) //加载效果
const formRef = ref<any>(null)

const option = ref({})

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
    option.value = {}
    chart.value = {}
    try {
        const res = await genChartByAi(
            {
                ...formData.value,
            },
            fileList.value[0].originFileObj as File,
        )
        if (!res?.data) {
            return
        }
        const chartOptions = JSON.parse(res.data.genChart ?? '')
        if (!chartOptions) {
            throw new Error('图表解析失败')
        }
        option.value = chartOptions
        chart.value = res.data
        message.success('图表分析成功')
    } catch (e: any) {
        message.error(e.message || '分析失败，请重试')
    } finally {
        loading.value = false
    }
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
                                    class="upload-component"
                                    accept=".xlsx,.xls"
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
                <div class="result-card">
                    <h2 class="result-title">分析结果</h2>

                    <!-- 分析结论 -->
                    <div class="analysis-result">
                        <h3 class="result-section-title">分析结论</h3>
                        <div class="result-content">
                            <template v-if="chart.genResult">
                                {{ chart.genResult }}
                            </template>
                            <template v-else-if="loading">
                                <div
                                    style="
                                        min-height: 100px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    "
                                >
                                    <a-spin />
                                </div>
                            </template>
                            <template v-else>
                                <div class="empty-state">
                                    请填写表单并点击"生成图表"按钮获取分析结果
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- 生成图表 -->
                    <div class="chart-container">
                        <h3 class="result-section-title">生成图表</h3>
                        <div class="chart-wrapper">
                            <template v-if="Object.keys(option).length > 0">
                                <VChart
                                    :option="option"
                                    class="chart"
                                />
                            </template>
                            <template v-else-if="loading">
                                <div
                                    style="
                                        min-height: 300px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    "
                                >
                                    <a-spin />
                                </div>
                            </template>
                            <template v-else>
                                <div class="empty-chart">
                                    <div class="empty-icon">📊</div>
                                    <div class="empty-text">图表将在这里显示</div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 结果展示区域 -->
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

/* 结果卡片 */
.result-card {
    width: 100%;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.result-title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid #eee;
    font-weight: 600;
}

/* 分析结果区域 */
.analysis-result {
    margin-bottom: 2rem;
}

.result-section-title {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 0.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
}

.result-section-title::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: #4a90e2;
    margin-right: 8px;
    border-radius: 2px;
}

.result-content {
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    min-height: 100px;
    line-height: 1.8;
}

/* 空状态样式 */
.empty-state,
.empty-chart {
    color: #888;
    text-align: center;
    padding: 2rem 1rem;
    border: 1px dashed #ddd;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.01);
}

.empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* 图表容器 */
.chart-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.chart-wrapper {
    flex: 1;
    min-height: 300px;
    position: relative;
}

.chart {
    width: 100%;
    height: 100%;
    min-height: 300px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
    }

    .form-card,
    .result-card {
        padding: 1.5rem;
        width: 100%;
    }
}
</style>
