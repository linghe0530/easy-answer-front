<template>
    <div id="global-header">
        <a-row :wrap="false">
            <a-col flex="200px">
                <router-link to="/">
                    <div class="title-bar">
                        <img
                            class="logo"
                            src="/logo.png"
                            alt="logo"
                        />
                        <div class="title">Easy Answer</div>
                    </div>
                </router-link>
            </a-col>
            <a-col flex="auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="horizontal"
                    :items="items"
                    @click="doMenuClick"
                />
            </a-col>
            <a-col flex="120px">
                <div class="user-login-status">
                    <div v-if="loginUserStore.loginUser.id">
                        <a-dropdown>
                            <a-space>
                                <a-avatar
                                    v-if="loginUserStore.loginUser.userAvatar"
                                    :src="loginUserStore.loginUser.userAvatar"
                                />

                                {{ loginUserStore.loginUser.userName ?? '无名' }}
                            </a-space>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="doLogout">
                                        <LogoutOutlined />
                                        退出登录
                                    </a-menu-item>
                                    <a-menu-item>
                                        <RouterLink to="/space/my">
                                            <UserOutlined />
                                            我的空间
                                        </RouterLink>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                    <div v-else>
                        <a-button
                            type="primary"
                            @click="router.push('/user/login')"
                        >
                            登录
                        </a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import menus from '@/components/layouts/menus.ts'

const router = useRouter()
const loginUserStore = useLoginUserStore()
const current = ref<string[]>([]) //当前选中的菜单

const items = computed(() => {
    return menus.filter((menu) => {
        if (!menu) {
            return
        }
        const loginUser = loginUserStore.loginUser
        //管理员放行所有
        if (loginUser.id && loginUser.userRole === ACCESS_ENUM.ADMIN) {
            return true
        }
        if (menu.access === ACCESS_ENUM.ADMIN) {
            if (!loginUser.id || loginUser.userRole !== ACCESS_ENUM.ADMIN) {
                return false
            }
        }
        if (menu.access === ACCESS_ENUM.USER) {
            if (!loginUser.id || loginUser.userRole !== ACCESS_ENUM.USER) {
                return false
            }
        }
        return true
    })
})
const doMenuClick = ({ key }: any) => {
    router.push({
        path: key,
    })
}
router.afterEach((to) => {
    current.value = [to.path]
})

const doLogout = async () => {
    // const res = await userLogout()
    // if (res.data.code === 20000) {
    //     userLoginStore.setLoginUser({
    //         userName: '未登录',
    //     })
    //     message.success('退出登录成功')
    //     await router.push('/user/login')
    // } else {
    //     message.error('退出登录失败:' + res.data.msg)
    // }
}
</script>

<style scoped>
#global-header .title-bar {
    display: flex;
    align-items: center;
}

.title {
    color: black;
    font-size: 18px;
    margin-left: 16px;
}

.logo {
    height: 48px;
}
</style>
