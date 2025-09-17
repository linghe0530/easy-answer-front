import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginInfo } from '@/api/userController.ts'

const useLoginUserStore = defineStore('useLoginUserStore', () => {
    const loginUser = ref<API.UserResp>({})

    const setLoginUser = (user: API.UserResp) => {
        loginUser.value = user
    }
    const fetchLoginUser = async () => {
        const res = await getLoginInfo()
        if (!res || !res.data) {
            return
        }
        loginUser.value = res.data
    }
    return { loginUser, setLoginUser, fetchLoginUser }
})
export default useLoginUserStore
