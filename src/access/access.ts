import router from '@/router'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'
import accessEnum from '@/access/accessEnum.ts'

let firstFetchLoginUser = true

router.beforeEach(async (to, from, next) => {
    const userLoginStore = useLoginUserStore()
    let loginUser = userLoginStore.loginUser
    //所有没有展示的页面都需要登录
    if (firstFetchLoginUser) {
      await  userLoginStore.fetchLoginUser()
        loginUser = userLoginStore.loginUser
        firstFetchLoginUser = false
    }
    if (to.meta.access === accessEnum.ADMIN) {
        if (loginUser.userRole !== accessEnum.ADMIN) {
            next('/no_auth')
            return
        }
    }
    next()
})
