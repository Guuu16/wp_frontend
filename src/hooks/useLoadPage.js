import { ElLoading } from 'element-plus'

export function showLoadPage(text = 'BBFV Automation', background = 'rgba(0, 0, 0, 1)') {
    let loading;
    let loadingCount = 0;
    function start() {
        loading = ElLoading.service({
            lock: true,
            text: text,
            background: background,
        })
    }

    function end() {
        loading.close();
    }

    function showLoaing() {
        if (loadingCount == 0) {
            start();
        };
        loadingCount++
    }

    function hideLoading() {
        loadingCount--;
        if (loadingCount == 0) {
            end()
        }
    }

    return {
        showLoaing,
        hideLoading
    }
}