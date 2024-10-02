import { shopAdminApi, bugzilaApi } from '~/axios'
import qs from 'qs';

export function login(username, password) {
    const data = { 'username': username, 'password': password };
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: '/login/',
    };
    return bugzilaApi(options);
    
}


export function getInfo() {
    return bugzilaApi.get("/user/")
}

export function logout() {
    return bugzilaApi.get("/logout/")
}

export function updatePassword(data) {
    return shopAdminApi.post("/admin/updatepassword", data)
}

export function getManagerList(page, query = {
    limit: 10, keyword: "ceshi"
}) {
    let q = []
    for (const key in query) {
        if (query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join("&")
    r = r ? ("?" + r) : ""
    return shopAdminApi.get(`/admin/manager/${page}${r}`)
}
