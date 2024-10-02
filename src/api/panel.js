import { bugzilaApi } from '~/axios'

export function getJobs(project) {
    return bugzilaApi.get(`/api/jk/p/${project}/jobs`)
}

export function getGroups() {
    return bugzilaApi.get('/receiver/group/')
}

export function runTask(data) {
    return bugzilaApi.post('/api/jk/p/task/trigger', data)
}

export function stopTask(id) {
    return bugzilaApi.post(`/api/jk/p/task/${id}`, { action: "stop" })
}

export function handleGroups(data) {
    return bugzilaApi.post('/receiver/group/', data)
}

export function uploadBuild(release, product, system) {
    return `/bugzila/api/jk/p/upload?release=${release}&product=${product}&system=${system}`
}

export function getTasks(source) {
    return bugzilaApi.get(`/api/jk/p/task?source=${source}`)
}

export function getTaskDetail(id) {
    return bugzilaApi.get(`/api/jk/p/task/${id}`)
}

export function getStressOptions(id) {
    return bugzilaApi.get(`/api/jk/p/stress/chart/options?id=${id}`)
}

export function getStressChart(id, options) {
    return bugzilaApi.get(`/api/jk/p/stress/chart?id=${id}&${options}`)
}

export function getBuildingHosts() {
    return bugzilaApi.get(`/api/jk/p/building`)
}

export function getStages(buildno, jobname, source) {
    return bugzilaApi.get(`/api/jk/p/task/stages?buildno=${buildno}&jobname=${jobname}&source=${source}`)
}
