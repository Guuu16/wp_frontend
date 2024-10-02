export function getCurrentTime() {
    function twoDigits(val) {
        if (val < 10) return '0' + val
        return val
    }

    const today = ref(new Date())
    const week = computed(() => { return today.value.getDay() })
    const year = computed(() => { return today.value.getFullYear() })
    const month = computed(() => { return twoDigits(today.value.getMonth() + 1) })
    const day = computed(() => { return twoDigits(today.value.getDate()) })
    const hour = computed(() => { return twoDigits(today.value.getHours()) })
    const minute = computed(() => { return twoDigits(today.value.getMinutes()) })
    const second = computed(() => { return twoDigits(today.value.getSeconds()) })
    const weekCN = computed(() => {
        if (week.value == 0) {
            return "星期日"
        } else if (week.value == 1) {
            return "星期一"
        } else if (week.value == 2) {
            return "星期二"
        } else if (week.value == 3) {
            return "星期三"
        } else if (week.value == 4) {
            return "星期四"
        } else if (week.value == 5) {
            return "星期五"
        } else if (week.value == 6) {
            return "星期六"
        }
    })
    const weekEN = computed(() => {
        if (week.value == 0) {
            return "Sun"
        } else if (week.value == 1) {
            return "Mon"
        } else if (week.value == 2) {
            return "Tues"
        } else if (week.value == 3) {
            return "Wed"
        } else if (week.value == 4) {
            return "Thur"
        } else if (week.value == 5) {
            return "Fri"
        } else if (week.value == 6) {
            return "Sat"
        }
    })

    function updateTime() {
        today.value = new Date()
    }
    updateTime()

    const timer = setInterval(updateTime, 1000)
    onBeforeUnmount(() => {
        clearInterval(timer)
    })

    return {
        week,
        year,
        month,
        day,
        hour,
        minute,
        second,
        weekCN,
        weekEN
    }
}

export function formatTime(time) {
    let h = parseInt(time / 60 / 60 % 24)
    // h = h < 10 ? '0' + h : h
    let m = parseInt(time / 60 % 60)
    // m = m < 10 ? '0' + m : m
    // let s = parseInt(time % 60)
    // s = s < 10 ? '0' + s : s
    return `${h} h ${m} min`
}

export const shortcuts = [
    {
        text: 'Last week',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: 'Last month',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: 'Last 3 months',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
    {
        text: 'Last 6 months',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            return [start, end]
        },
    },
    {
        text: 'Last year',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            return [start, end]
        },
    },
]