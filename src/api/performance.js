import { bugzilaApi } from '~/axios'

export function getPlatform() {
    return bugzilaApi.get(`/api/performance/perf/platform`)
}

export function getCase() {
    return bugzilaApi.get(`/api/performance/perf/case`)
}

export function getMac() {
    return bugzilaApi.get(`/api/performance/perf/mac`)
}

export function getCaseMacByPlatform(data) {
    return bugzilaApi.post('/api/performance/perf/casemac', { 'platform': data })
}

export function getPerformanceData(data) {
    return bugzilaApi.post('/api/performance/perf/search', data)
}
