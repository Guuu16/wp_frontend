import { bugzilaApi } from '~/axios'

export function getMachines() {
    return bugzilaApi.get(`/api/mach/info/`)
}

export function handleMachines(action, form) {
    switch (action) {
        case 'Add':
            action = 'create'
            break;
        case 'Edit':
            action = 'update'
            break;
        default:
            break;
    }
    return bugzilaApi.post(`/api/mach/info/`, { action, machine: form })
}

export function getCommonConfig() {
    return bugzilaApi.get(`/api/mach/commonconfig/`)
}

export function handleCommonConfig(form) {
    var { id, action, name, message } = form
    message = JSON.stringify(message)
    return bugzilaApi.post(`/api/mach/commonconfig/`, { id: id, action: action, CommonConfigName: name, CommonConfig_message: message })
}

export function powerAction(immip, action) {
    return bugzilaApi.post(`/api/mach/powerAction/`, { immip, action })
}

export function getPowerStatus() {
    return bugzilaApi.get(`/api/mach/powerAction/`)
}

export function openBackdoor(immip) {
    return bugzilaApi.post(`/api/mach/openBackdoor/`, { immip })
}
