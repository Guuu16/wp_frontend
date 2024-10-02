import { router, addRoutes } from './router'
import { getToken } from "~/hooks/useCookies.js";
import { toAsk } from "~/hooks/useDialog.js";
import store from './store';
import nprogress from 'nprogress'
import "nprogress/nprogress.css"

router.beforeEach(async (to, from, next) => {
    nprogress.start()
    const token = getToken()

    // 没有登录，强制跳转回登录页
    if (!token && ["/login", "/DataBoard"].findIndex(p => p == to.path) == -1) {
        toAsk("Please login first", "warning")
        return next({
            path: "/login"
        })
    }

    // 防止重复登录
    if (token && to.path == "/login") {
        toAsk("please don't login again", "warning")
        return next({
            path: from.path ? from.path : "/"
        })
    }
    let hasNewRoutes = false
    if (token && !store.state.hasGetInfo) {
        let { menus } = await store.dispatch("getInfo")
        store.dispatch('getCommonConfig')
        hasNewRoutes = addRoutes(menus)
        store.state.hasGetInfo = true
    }

    // const title = (to.meta.title ? to.meta.title : "") + "-Automation-Portal"
    // const title = "Automation-Portal"
    // document.title = title

    hasNewRoutes ? next(to.fullPath) : next()
    // 返回 false 以取消导航
    // return false
})

router.afterEach((to, from) => {
    nprogress.done()
})
