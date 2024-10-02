import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies(['locale'])
const TokenKey = 'authorization'
const SessionId = 'sessionid'

export function getToken() {
    return cookies.get(TokenKey)
}

export function getSessionId() {
    return cookies.get(SessionId)
}

export function setToken(token) {
    return cookies.set(TokenKey, token)
}

export function removeToken() {
    return cookies.remove(TokenKey)
}
