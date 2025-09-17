<script setup lang="ts">
import { ref } from 'vue'
import { userLogin } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

const router = useRouter()
const loginUserStore = useLoginUserStore()
const formData = ref<API.UserLoginRequest>({})

const handleSubmit = async () => {
    const res = await userLogin({
        ...formData.value,
    })
    if (!res || !res.data) {
        return
    }
    message.success('登录成功')
    loginUserStore.setLoginUser(res.data)
    await router.push('/')
}
</script>

<template>
    <div class="user-login-page">
        <!-- 登录卡片 -->
        <div class="login-card">
            <!-- 登录标题区 -->
            <div class="login-header">
                <h2 class="login-title">用户登录</h2>
                <p class="login-desc">请输入账号信息以继续访问</p>
            </div>

            <!-- 登录表单区 -->
            <a-form
                :model="formData"
                name="login"
                class="login-form"
                @submit="handleSubmit"
            >
                <!-- 用户名输入项 -->
                <a-form-item
                    label="账号"
                    name="userAccount"
                    :rules="[
                        { required: true, message: '请输入您的账号!' },
                        { min: 3, max: 20, message: '账号长度需在 3-20 个字符之间' },
                    ]"
                    class="form-item"
                >
                    <a-input
                        v-model:value="formData.userAccount"
                        placeholder="请输入账号"
                        class="form-input"
                        prefix-icon="user"
                    />
                </a-form-item>

                <!-- 密码输入项 -->
                <a-form-item
                    label="密码"
                    name="userPassword"
                    :rules="[
                        { required: true, message: '请输入您的密码!' },
                        { min: 6, max: 32, message: '密码长度需在 6-32 个字符之间' },
                    ]"
                    class="form-item"
                >
                    <a-input-password
                        v-model:value="formData.userPassword"
                        placeholder="请输入密码"
                        class="form-input"
                        prefix-icon="lock"
                        visibilityToggle
                    />
                </a-form-item>

                <!-- 记住我 & 忘记密码 -->
                <a-form-item class="form-item remember-item">
                    <div class="remember-wrap">
                        <a-checkbox
                            class="remember-checkbox"
                        >
                            记住我（7天内免登录）
                        </a-checkbox>
                        <a
                            href="/user/forget"
                            class="forgot-link"
                            target="_self"
                        >
                            忘记密码？
                        </a>
                    </div>
                </a-form-item>

                <!-- 登录按钮 -->
                <a-form-item class="form-item submit-item">
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="login-btn"
                        block
                    >
                        登录
                    </a-button>
                </a-form-item>

                <!-- 注册引导 -->
                <div class="register-guide">
                    还没有账号？
                    <a
                        href="/user/register"
                        class="register-link"
                        target="_self"
                    >
                        立即注册
                    </a>
                </div>
            </a-form>
        </div>
    </div>
</template>

<style scoped>
/* 页面容器：全屏居中 + 背景渐变 */
.user-login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}

/* 登录卡片：白色背景 + 阴影 + 圆角 */
.login-card {
    width: 100%;
    max-width: 450px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 40px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

/* 卡片 hover 效果：增强阴影层次感 */
.login-card:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

/* 登录标题区：上下间距控制 */
.login-header {
    margin-bottom: 32px;
    text-align: center;
}

/* 登录标题：字体权重 + 大小 */
.login-title {
    font-size: 24px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 8px;
}

/* 登录描述：浅色小字提示 */
.login-desc {
    font-size: 14px;
    color: #86909c;
    margin: 0;
}

/* 表单容器：统一间距 */
.login-form {
    width: 100%;
}

/* 表单项：统一底部间距 */
.form-item {
    margin-bottom: 20px;
}

/* 输入框：统一样式 + 圆角 */
.form-input {
    border-radius: 6px;
    height: 44px;
    font-size: 14px;
    border-color: #e5e6eb;
    transition: all 0.2s ease;
}

/* 输入框聚焦效果：蓝色边框 + 轻微发光 */
.form-input:focus {
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

/* 记住我选项区：flex布局实现左右对齐 */
.remember-item {
    margin-bottom: 24px;
}

.remember-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

/* 记住我复选框：调整颜色 */
.remember-checkbox {
    font-size: 14px;
    color: #4e5969;
}

.remember-checkbox .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #4361ee;
    border-color: #4361ee;
}

/* 忘记密码链接：蓝色文字 +  hover效果 */
.forgot-link {
    font-size: 14px;
    color: #4361ee;
    text-decoration: none;
    transition: color 0.2s ease;
}

.forgot-link:hover {
    color: #3a0ca3;
    text-decoration: underline;
}

/* 登录按钮：统一高度 + 圆角 + 字体 */
.login-btn {
    height: 46px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    background-color: #4361ee;
    border-color: #4361ee;
    transition: all 0.2s ease;
}

/* 登录按钮 hover 效果：深色背景 */
.login-btn:hover {
    background-color: #3a0ca3;
    border-color: #3a0ca3;
}

/* 注册引导区：居中显示 + 间距 */
.register-guide {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: #86909c;
}

/* 注册链接：蓝色文字 + hover效果 */
.register-link {
    color: #4361ee;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.2s ease;
}

.register-link:hover {
    color: #3a0ca3;
    text-decoration: underline;
}

/* 响应式适配：小屏幕调整内边距 */
@media (max-width: 576px) {
    .login-card {
        padding: 28px 20px;
    }

    .login-header {
        margin-bottom: 24px;
    }

    .login-title {
        font-size: 20px;
    }

    .form-item {
        margin-bottom: 16px;
    }

    .login-btn {
        height: 42px;
        font-size: 14px;
    }
}
</style>
