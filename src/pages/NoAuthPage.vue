<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div id="no-auth-page">
        <a-result
            status="403"
            title="403"
            sub-title="暂无权限访问该界面"
        >
            <template #extra>
                <a-button
                    type="primary"
                    @click="() => router.push('/')"
                >
                    返回主页
                </a-button>
            </template>
        </a-result>
    </div>
</template>

<style scoped></style>
