<script setup lang="ts">
import { ShareAltOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

interface Props {
    app: API.AppResp
}

const props = defineProps<Props>()
const router = useRouter()
const doCardClick = () => {
    router.push(`/app/detail/${props.app.id}`)
}
</script>

<template>
    <a-card
        id="app-card"
        hoverable
        @click="doCardClick"
        bordered
    >
        <template #cover>
            <div
                :style="{
                    height: '204px',
                    overflow: 'hidden',
                }"
            >
                <img
                    :style="{ width: '100%', transform: 'translateY(-20px)' }"
                    :alt="app.appName"
                    :src="app.appIcon"
                />
            </div>
        </template>
        <a-card-meta
            :title="app.appName"
            :description="app.appDesc"
        />
        <template #actions>
                <div style="display: flex; align-items: center; color: #1d2129">
                    <a-avatar
                        :size="24"
                        :src="app.user?.userAvatar"
                        :style="{ marginLeft: '8px', marginRight: '8px' }"
                    />
                    <a-typography-text>{{ app.user?.userName ?? '无名' }}</a-typography-text>
                </div>
                <span class="icon">
                    <ShareAltOutlined />
                </span>
        </template>
    </a-card>
</template>

<style scoped>
/* 卡片样式 */
#app-card {
    cursor: pointer;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    display: block;
}

#app-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}
</style>
