<template>
    <div id="basic-layout">
        <a-layout style="min-height: 100vh">
            <a-layout-header class="header">
                <GlobalHeader />
            </a-layout-header>
            <a-layout-content class="content">
                <router-view />
            </a-layout-content>
            <a-layout-footer class="footer">easy-answer ©2025 Created by crane</a-layout-footer>
        </a-layout>
    </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/layouts/GlobalHeader.vue'
</script>

<style scoped>
#basic-layout .header {
    margin-bottom: 16px;
    box-shadow: #eee 1px 1px 5px;
    background-color: #fff;
}

#basic-layout .content {
    max-width: 1100px;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto 28px;
    padding: 20px;
    background: linear-gradient(to right, #fefefe, #fff);
}

#basic-layout .footer {
    background: #efefef;
    padding: 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
}
</style>
