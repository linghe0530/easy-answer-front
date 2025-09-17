<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AppCard from '@/components/app/AppCard.vue'
import { listAppRespPage } from '@/api/appController.ts'

const searchParams = ref<API.AppQueryRequest>({
    current: 1,
    pageSize: 12, // 增加每页数量以适应瀑布流
})
const dataList = ref<API.AppResp[]>([])
const total = ref(0)
const isLoading = ref(false)
const hasMore = ref(true)

const loadData = async (append = false) => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    const params = {
        ...searchParams.value,
    }
    const res = await listAppRespPage(params).finally(() => {
        isLoading.value = false
    })

    if (!res || !res.data) {
        hasMore.value = false
        return
    }

    total.value = res.data.total ?? 0
    const newItems = res.data.records ?? []

    // 处理数据加载方式：追加或替换
    dataList.value = append ? [...dataList.value, ...newItems] : newItems

    // 检查是否还有更多数据
    hasMore.value = dataList.value.length < total.value
}

// 搜索功能
const onSearch = () => {
    // 重置到第一页并重新加载
    searchParams.value = {
        ...searchParams.value,
        current: 1,
    }
    hasMore.value = true
    loadData()
}

// 加载更多
const loadMore = () => {
    if (!isLoading.value && hasMore.value) {
        searchParams.value = {
            ...searchParams.value,
            current: (searchParams.value.current ?? 0) + 1,
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
    loadData()
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div id="home-page">
        <!-- 页面头部 -->
        <header class="page-header">
            <div class="header-content">
                <h1>发现优质答题应用</h1>
                <p>探索精选的互动答题应用，挑战你的知识边界</p>

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
            </div>
        </header>

        <!-- 瀑布流内容区 -->
        <main class="waterfall-container">
            <!-- 使用原生CSS columns实现瀑布流 -->
            <div class="waterfall-grid">
                <div
                    v-for="item in dataList"
                    :key="item.id"
                    class="waterfall-item"
                >
                    <AppCard
                        :app="item"
                        class="app-card"
                    />
                </div>
            </div>

            <!-- 加载状态 -->
            <div
                v-if="isLoading"
                class="loading-indicator"
            >
                <div class="spinner" />
                <p>加载中...</p>
            </div>

            <!-- 没有更多数据 -->
            <div
                v-if="!hasMore && !isLoading && dataList.length > 0"
                class="end-message"
            >
                已经到底啦～
            </div>

            <!-- 空状态 -->
            <div
                v-if="!isLoading && dataList.length === 0"
                class="empty-state"
            >
                <h3>未找到相关应用</h3>
                <p>尝试使用不同的搜索关键词，或者浏览推荐的热门应用</p>
                <button class="reset-button">查看全部应用</button>
            </div>
        </main>
    </div>
</template>

<style scoped>
#home-page {
    background-color: #f9fafb;
    color: #333;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
#home-page .header-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}
/* 页面头部样式 */
.page-header {
    background-color: #ffffff;
    padding: 2rem 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}


.header-content h1 {
    font-size: 2.2rem;
    margin-bottom: 0.8rem;
    color: #1a1a1a;
    font-weight: 700;
}

.header-content p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* 搜索框样式 */
.searchBar {
    text-align: center;
    margin-bottom: 1rem;
}

.search-input {
    width: 100%;
    max-width: 400px;
    border-radius: 30px !important;
}

:deep(.ant-input-search-button) {
    border-radius: 0 30px 30px 0 !important;
}

/* 瀑布流布局 - 使用原生CSS columns实现4321响应式布局 */
.waterfall-container {
    max-width: 1400px; /* 适当增加最大宽度以适应4列布局 */
    margin: 0 auto;
    padding: 2rem 1rem;
}

.waterfall-grid {
    /* 基础设置为1列，响应式调整 */
    column-count: 1;
    column-gap: 24px;
}

/* 响应式列数调整为4321模式 */
/* 小屏幕 (≥ 576px) - 2列 */
@media (min-width: 576px) {
    .waterfall-grid {
        column-count: 2;
    }
}

/* 中等屏幕 (≥ 768px) - 3列 */
@media (min-width: 768px) {
    .waterfall-grid {
        column-count: 3;
    }
}

/* 大屏幕 (≥ 992px) - 4列 */
@media (min-width: 992px) {
    .waterfall-grid {
        column-count: 4;
    }
}

/* 瀑布流项目样式 */
.waterfall-item {
    break-inside: avoid; /* 防止卡片被分割到不同列 */
    margin-bottom: 24px;
    /* 渐入动画 */
    animation: fadeIn 0.5s ease forwards;
    opacity: 0;
}

/* 错开动画延迟，创造流动感 */
.waterfall-item:nth-child(2n) {
    animation-delay: 0.1s;
}

.waterfall-item:nth-child(3n) {
    animation-delay: 0.2s;
}

.waterfall-item:nth-child(4n) {
    animation-delay: 0.3s;
}

.waterfall-item:nth-child(5n) {
    animation-delay: 0.4s;
}

.waterfall-item:nth-child(6n) {
    animation-delay: 0.5s;
}



/* 加载指示器样式 */
.loading-indicator {
    text-align: center;
    padding: 3rem 0;
    color: #666;
}

/* 自定义加载动画 */
.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* 渐入动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 空状态和结束信息样式 */
.end-message,
.empty-state {
    text-align: center;
    padding: 3rem 0;
    color: #666;
}

.empty-state {
    max-width: 500px;
    margin: 0 auto;
}

.empty-state h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: #333;
}

.empty-state p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.reset-button {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.reset-button:hover {
    background-color: #096dd9;
}
</style>
