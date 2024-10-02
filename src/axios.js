import axios from 'axios'
import { toAsk } from "~/hooks/useDialog.js"
import { getToken, getSessionId } from "~/hooks/useCookies.js"
import store from '~/store'

function getShopAdminApi() {
    const instance = axios.create({
        baseURL: '/api',
        timeout: 1000,
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response.data.data;
    });

    return instance
}

function getBugzilaApi() {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_APP_BUGZILA_API,
        // timeout: 10000,
        // headers: {'X-Custom-Header': 'foobar'}
    });

    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
        // 将token添加到header中
        const token = getToken()
        const sessionid = getSessionId()

        if (token) {
            config.headers['Authorization'] = token
            config.headers['Cookie'] = sessionid
        }

        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        if (response.config.method != 'get') {
            toAsk(response.data.msg)
        }
        return response.data.data;
    }, function (error) {
        let msg = ''
        const token_failure = "非法token，请先登录！"

        if ('response' in error) {
            msg = error.response.data.msg || "request failure"
        } else {
            msg = error.message
        }

        if (msg == token_failure) {
            store.dispatch("logout").finally(() => location.reload())
        }

        toAsk(msg, 'error')
        // 对响应错误做点什么
        return Promise.reject(error);
    });

    return instance
}

export const shopAdminApi = getShopAdminApi()
export const bugzilaApi = getBugzilaApi()
