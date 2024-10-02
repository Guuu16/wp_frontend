import { bugzilaApi } from '~/axios'

export function getClassifiedBug(start = '', end = '') {
    // return bugzilaApi.get(`/api/bz/bc?start=${start}&end=${end}`)
    return bugzilaApi.get(`/api/bz/bc/`)
}

export function getBugsByWeek() {
    return bugzilaApi.get(`/api/bz/bugweek/`)
}

export function getBugsByMonth(year, month) {
    return bugzilaApi.get(`/api/bz/bugmonth/${year}/${month}`)
}

export function getBugsAnnual(year) {
    return bugzilaApi.get(`/api/bz/bugdate/${year}`)
}

export function getBugsRank(rangeDate) {
    var start = rangeDate[0]
    var end = rangeDate[1]
    return bugzilaApi.get(`/api/bz/rank/?start=${start}&end=${end}`)
}

export function getBugsEffect(start, end) {
    return bugzilaApi.get(`/api/bz/bugcount/?start=${start}&end=${end}`)
}

export function getBugsEffectDetail(start, end, page, page_size, data) {
    return bugzilaApi.post(`/api/bz/detail/?start=${start}&end=${end}&page=${page}&page_size=${page_size}`, data)
}
