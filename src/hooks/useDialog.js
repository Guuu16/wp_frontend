import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'

// export function toAsk(message, type = "success", dangerouslyUseHTMLString = false) {
//     return ElNotification({
//         title: type,
//         message,
//         type,
//         offset: 75,
//         dangerouslyUseHTMLString,
//         duration: 3000
//     })
// }

export function toAsk(message, type = "success", dangerouslyUseHTMLString = true) {
    return ElMessage({
        type,
        message,
        dangerouslyUseHTMLString
    })
}

export function showModal(content, title = null, type = "warning") {
    return ElMessageBox.confirm(
        content,
        title = title ? title : type,
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: type,
        }
    )
}

export function showPrompt(title, tip = "Please input your info", value = '') {
    return ElMessageBox.prompt(tip, title, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputValue: value
    })
}

export function showConfirm(title, tip = 'Are you sure continue?', type = "warning") {
    return ElMessageBox.confirm(
        tip,
        title,
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: type,
        }
    )
}