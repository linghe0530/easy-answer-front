<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { listPictureRespPage, listPictureTagCategory, searchPictureByColor } from '@/api/pictureController.ts'
import PictureCard from '@/pages/picture/PictureCard.vue'
import PictureSearchForm from '@/components/picture/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

const dataList = ref<API.PictureResp[]>([])

const total = ref<number>(0)
const loading = ref(false)
const hasMore = ref(true)
const searchParams = ref<API.PictureQueryRequest>({
    current : 1,
    pageSize : 12,
    sortField : 'create_time',
    sortOrder : 'descend',
})

//标签和分类列表
const categoryList = ref<string[]>([])
const selectCategory = ref('all')
const tagList = ref<string[]>([])
const selectTagList = ref<string[]>([])

const getTagCategoryList = async () => {
    const res = await listPictureTagCategory()
    if (!res?.data) {
        return
    }
    tagList.value = res.data.tagList ?? []
    categoryList.value = res.data.categoryList ?? []
}
const loadData = async (append = false) => {
    if (loading.value || !hasMore.value) return
    loading.value = true
    const params = {
        ...searchParams.value,
        tags : [] as string[],
    }
    // 如果选择了分类，则添加到查询参数中
    if (selectCategory.value !== 'all') {
        params.category = selectCategory.value
    }
    // 如果选择了标签，则添加到查询参数中
    selectTagList.value.forEach((checked, index) => {
        if (checked) {
            params.tags.push(tagList.value[index])
        }
    })
    const res = await listPictureRespPage({
        ...params,
    }).finally(() => {
        loading.value = false
    })
    if (!res?.data) {
        hasMore.value = false
        return
    }
    total.value = res.data.total ?? 0
    const newItems = res.data.records ?? []

    // 处理数据加载方式：追加或替换
    dataList.value = append ? [ ...dataList.value, ...newItems ] : newItems

    // 检查是否还有更多数据
    hasMore.value = dataList.value.length < total.value
}
// 加载更多
const loadMore = () => {
    if (!loading.value && hasMore.value) {
        searchParams.value = {
            ...searchParams.value,
            current : ( searchParams.value.current ?? 0 ) + 1,
        }
        loadData(true)
    }
}
const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    // 当滚动到页面底部附近时加载更多
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        console.log('scrollTop + clientHeight', scrollTop + clientHeight)
        console.log('scrollHeight', scrollHeight)
        loadMore()
    }
}
// 滚动监听实现无限加载
onMounted(() => {
    getTagCategoryList()
    loadData()
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
// 搜索功能
const onSearch = () => {
    // 重置到第一页并重新加载
    searchParams.value = {
        ...searchParams.value,
        current : 1,
    }
    hasMore.value = true
    loadData()
}

const onColorChange = async (color: string) => {
    const res = await searchPictureByColor({
        picColor : color,
    })
    if (!res?.data) {
        return
    }

    dataList.value = res.data
    total.value = res.data.length
}

const onSearchFormReload = (newSearchParams: API.PictureQueryRequest) => {
    searchParams.value = {
        ...newSearchParams,
        current : 1,
    }
    hasMore.value = true
    loadData()
}
</script>

<template>
    <div id="picture-home-page">
        <!-- 页面头部：新增标题区、优化筛选布局 -->
        <header class="page-header">
            <div class="header-content">

                <!-- 搜索框 -->
                <div class="searchBar">
                    <a-input-search
                        v-model:value="searchParams.searchText"
                        placeholder="搜索答题应用..."
                        enter-button="搜索"
                        size="large"
                        @search="onSearch"
                        class="search-input"
                    />
                </div>
                <!-- 筛选区域：分块布局，提升可读性 -->
                <div class="page-header__filter-group">
                    <!-- 分类切换 -->
                    <div class="filter-group__item" >
                        <a-tabs
                            v-model:active-key="selectCategory"
                            @change="onSearch"
                            size="middle"
                            class="category-tabs"
                        >
                            <a-tab-pane
                                tab="全部"
                                key="all"
                            />
                            <a-tab-pane
                                v-for="category in categoryList"
                                :key="category"
                                :tab="category"
                            />
                        </a-tabs>
                        <div class="filter-group__item tag-filter-container">
                            <span class="tag-filter__label">标签:</span>
                            <div class="tag-filter__scroll">
                                <a-space
                                    wrap
                                    class="tag-group"
                                >
                                    <a-checkable-tag
                                        v-for="(tag, index) in tagList"
                                        :key="tag"
                                        v-model:checked="selectTagList[index]"
                                        @change="onSearch"
                                        class="custom-checkable-tag"
                                    >
                                        {{ tag }}
                                    </a-checkable-tag>
                                </a-space>
                            </div>
                        </div>
                        <!-- 搜索与颜色筛选：横向排列 -->
                        <div class="filter-group__item search-color-container">
                            <div class="search-container">
                                <PictureSearchForm
                                    class="search-form"
                                    :on-search="onSearchFormReload"
                                />
                            </div>
                            <div class="color-search-container">
                                <a-form-item
                                    label="按颜色搜索"
                                    class="color-form-item"
                                >
                                    <color-picker
                                        format="hex"
                                        @pureColorChange="onColorChange"
                                        class="custom-color-picker"
                                    />
                                </a-form-item>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>

        <!-- 瀑布流内容区：优化加载状态和空状态展示 -->
        <main class="waterfall-container">
            <!-- 瀑布流网格：增强卡片立体感 -->
            <div class="waterfall-grid">
                <div
                    v-for="(item, index) in dataList"
                    :key="item.id || index"
                    class="waterfall-item"
                    :style="{ animationDelay: `${(index % 6) * 0.1}s` }"
                >
                    <PictureCard
                        :picture="item"
                    />
                </div>
            </div>

            <!-- 状态提示区：统一样式，增强视觉反馈 -->
            <div class="state-indicators">
                <!-- 加载状态：优化动画和文字 -->
                <div
                    v-if="loading"
                    class="loading-indicator"
                >
                    <div class="spinner" />
                    <p class="loading-text">正在加载图片...</p>
                </div>

                <!-- 没有更多数据：新增图标 -->
                <div
                    v-else-if="!hasMore && !loading && dataList.length > 0"
                    class="end-message"
                >
                    <p class="end-text">已经到底啦～</p>
                </div>

                <!-- 空状态：场景化提示，优化按钮样式 -->
                <div
                    v-else-if="!loading && dataList.length === 0"
                    class="empty-state"
                >
                    <h3 class="empty-title">暂无更多图片</h3>
                    <p class="empty-desc">尝试使用不同的搜索关键词，或者浏览推荐的热门图片</p>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* 全局容器：优化背景质感和基础样式 */
#picture-home-page {
    background-color: #f8fafc;
    color: #334155;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
}

#picture-home-page .header-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

/* 搜索框样式 */
.searchBar {
    margin-bottom: 1rem;
}

.search-input {
    width: 100%;
    max-width: 400px;
    border-radius: 30px !important;
}
/* 页面头部：渐变背景 + 分层阴影 */
.page-header {
    background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);
    margin-bottom: 2rem;
}

/* 筛选组：分块布局，适配响应式 */
.page-header__filter-group {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.filter-group__item {
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 1rem 1.2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 分类标签：优化选中态 */
.category-tabs {
    --ant-tabs-tab-active-color: #3b82f6;
    --ant-tabs-ink-bar-color: #3b82f6;
    --ant-tabs-tab-font-size: 0.95rem;
}

:deep(.ant-tabs-tab) {
    padding: 0.5rem 1.2rem !important;
    margin: 0 0.3rem !important;
}

:deep(.ant-tabs-content-holder) {
    padding-top: 0.8rem;
}

/* 标签筛选：滚动容器 + 自定义标签样式 */
.tag-filter-container {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.tag-filter__label {
    color: #64748b;
    font-size: 0.95rem;
}

.tag-filter__scroll {
    overflow-x: auto;
    padding-bottom: 0.3rem;
}

.tag-filter__scroll::-webkit-scrollbar {
    height: 6px;
}

.tag-filter__scroll::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 3px;
}

.tag-filter__scroll::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1;
}

/* 自定义可勾选标签 */
.custom-checkable-tag {
    border-radius: 18px !important;
    padding: 0.3rem 1rem !important;
    font-size: 0.9rem !important;
    --ant-tag-color: #64748b;
    --ant-tag-bg: #f1f5f9;
    --ant-tag-active-color: #3b82f6;
    --ant-tag-active-bg: #dbeafe;
    transition: all 0.2s ease;
}

:deep(.ant-tag-checkable-checked.custom-checkable-tag) {
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

:deep(.ant-tag-checkable:not(.ant-tag-checkable-checked):hover.custom-checkable-tag) {
    background-color: #e0e7ff !important;
    color: #3b82f6 !important;
}

/* 搜索与颜色筛选：横向排列 */
.search-color-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.search-container {
    flex: 1;
    min-width: 280px;
}

.search-form {
    width: 100%;
}

:deep(.ant-input-search) {
    width: 100% !important;
    border-radius: 8px !important;
}

:deep(.ant-input-search-input) {
    height: 42px !important;
    border-radius: 8px 0 0 8px !important;
    font-size: 0.95rem;
}

:deep(.ant-input-search-button) {
    height: 42px !important;
    border-radius: 0 8px 8px 0 !important;
    background-color: #3b82f6;
    border-color: #3b82f6;
}

:deep(.ant-input-search-button:hover) {
    background-color: #2563eb;
    border-color: #2563eb;
}

/* 颜色筛选：优化布局 */
.color-search-container {
    display: flex;
    align-items: center;
}

.color-form-item {
    margin-bottom: 0 !important;
}

:deep(.ant-form-item-label) {
    padding-right: 0.8rem !important;
}

:deep(.ant-form-item-label > label) {
    font-size: 0.95rem !important;
    color: #64748b !important;
}

.custom-color-picker {
    width: 180px !important;
}

:deep(.vc-popup) {
    border-radius: 8px !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

/* 瀑布流容器：优化响应式和间距 */
.waterfall-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem 3rem;
}

/* 瀑布流网格：4321响应式，增强列间距 */
.waterfall-grid {
    column-count: 1;
    column-gap: 24px;
    orphans: 1;
    widows: 1;
}

/* 响应式列数调整 */
@media (min-width: 576px) {
    .waterfall-grid {
        column-count: 2;
    }
}

@media (min-width: 768px) {
    .waterfall-grid {
        column-count: 3;
    }
}

@media (min-width: 1200px) {
    .waterfall-grid {
        column-count: 4;
    }
}

/* 瀑布流项：优化动画和卡片容器 */
.waterfall-item {
    break-inside: avoid;
    margin-bottom: 24px;
    animation: fadeIn 0.5s ease forwards;
    opacity: 0;
    transform: translateY(15px);
}



/* 状态指示器：统一样式，增强视觉层次 */
.state-indicators {
    margin-top: 2rem;
    text-align: center;
}

/* 加载状态：优化动画和文字颜色 */
.loading-indicator {
    padding: 3.5rem 0;
    color: #64748b;
}

.spinner {
    width: 42px;
    height: 42px;
    margin: 0 auto 1rem;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 0.95rem;
    color: #64748b;
}

/* 结束信息：新增图标和颜色 */
.end-message {
    padding: 3.5rem 0;
    color: #64748b;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
}


.end-text {
    font-size: 0.95rem;
}

/* 空状态：场景化设计，增强引导性 */
.empty-state {
    max-width: 520px;
    margin: 0 auto;
    padding: 4rem 2rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}


.empty-title {
    font-size: 1.3rem;
    color: #1e293b;
    margin-bottom: 0.8rem;
    text-align: center;
}

.empty-desc {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 1.5rem;
    text-align: center;
    line-height: 1.6;
}



/* 动画定义：优化过渡效果 */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 适配小屏幕：优化筛选布局 */
@media (max-width: 575px) {
    .page-header {
        padding: 1.8rem 0.8rem;
    }

    .filter-group__item {
        padding: 0.8rem 1rem;
    }

    .tag-filter-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>
