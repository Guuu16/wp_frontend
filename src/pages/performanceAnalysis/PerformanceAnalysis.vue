<template>
    <div>
        <div v-loading="false">
            <Card>
                <template #headerLeft>
                    <span>Performance Analysis</span>
                </template>
                <template #body>
                    <el-form class="flex items-center" :model="form">
                        <el-form-item class="mr-5" label="Platform">
                            <el-select v-model="form.platform" @change="changePlatform">
                                <el-option v-for="(item, index) in platformArray" :key="index" :label="item.platform"
                                    :value="item.platform" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="mr-5" label="Test Case">
                            <el-select v-model="form.testcases">
                                <el-option v-for="(item, index) in testCaseArray" :key="index" :label="item"
                                    :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="mr-5" label="Host MAC">
                            <el-select v-model="form.hostMAC">
                                <el-option v-for="(item, index) in hostMacArray" :key="index" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="mr-5" label="Date Time">
                            <el-date-picker v-model="form.rangedate" type="daterange" unlink-panels range-separator="To"
                                start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts"
                                @change="changeDateTime" value-format="YYYY-MM-DD" />
                        </el-form-item>
                        <el-form-item>
                            <el-button class="mx-auto" type="primary" @click="onQuery" :loading="loading">Query</el-button>
                        </el-form-item>
                    </el-form>
                    <el-card class="my-5" v-for="item in allServerArray" :key="item" shadow="never"
                        :body-style="{ padding: '20px' }">
                        <Echart height="500px" :option="item" />
                    </el-card>
                    <template v-if="allServerArray.length == 0">
                        <el-skeleton animated loading>
                            <template #template>
                                <el-card class="my-5" v-for="item in 5" :key="item" shadow="never"
                                    :body-style="{ padding: '20px' }">
                                    <el-skeleton-item variant="image" style="width: 100%;height: 100%;" />
                                </el-card>
                            </template>
                        </el-skeleton>
                    </template>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import Card from "~/components/common/Card.vue";
import Echart from '~/components/common/Echart.vue'
import dayjs from 'dayjs'

const performanceLineOptions = {
    tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: function (pos, params, el, elRect, size) {
            const obj = { top: 0 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
            return obj
        },
        // 格式化输出hw/sw 的信息
        formatter: (params) => {
            let hw = ''
            Object.keys(params[0].data.hw).forEach((key) => {
                // pcie 的 HW 信息显示
                if (key === 'pcie_info') {
                    let pcie = '<br/>'
                    // pcie_info 有可能是空的，机器上没有卡
                    if (params[0].data.hw['pcie_info']) {
                        // 此处获取出来的pcie_info的信息为一个字符串类型， 先转换为数组
                        const pcie_list = params[0].data.hw['pcie_info'].trim().slice(1, -1).split(',')
                        // console.log(pcie_list)
                        for (const item of pcie_list) {
                            // console.log(item.trim().slice(1, -1))
                            pcie += item.trim().slice(1, -1) + '<br/>'
                        }
                    }
                    hw += key + ': ' + pcie
                } else {
                    // 非pcie 的 HW 信息显示
                    hw += key + ': ' + params[0].data.hw[key] + '<br/>'
                }
            })
            let sw = ''
            Object.keys(params[0].data.sw).forEach((key) => {
                sw += key + ': ' + params[0].data.sw[key] + '<br/>'
            })
            return (
                params[0].name +
                '<br/>' +
                params[0].seriesName +
                ': ' +
                params[0].value +
                '<br/>' +
                params[1].seriesName +
                ': ' +
                params[1].value +
                '<br/>' +
                sw +
                hw
            )
        },
        textStyle: {
            fontSize: 10
        },
        extraCssText: 'width: 250px'
    },
    title: {
        left: 'center',
        text: 'Large Area Chart'
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data3: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} sec'
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            start: 0,
            end: 10
        }
    ],
    grid: {
        left: 60,
        right: 10
    },
    legend: {
        data3: ['FFDC', 'Actual'],
        top: 30,
        left: 10
    },
    series: [
        {
            name: 'FFDC',
            type: 'line',
            sampling: 'lttb',
            smooth: true,
            data: []
        },
        {
            name: 'Actual',
            type: 'line',
            sampling: 'lttb',
            smooth: true,
            data: []
        }
    ]
};

// head
const form = reactive({
    platform: '',
    testcases: '',
    hostMAC: '',
    startdate: '',
    enddate: '',
    rangedate: ''
})

const platformArray = ref([])
const testCaseArray = ref([''])
const hostMacArray = ref([])
const loading = ref(false)

const getData = (platform = null) => {
    loading.value = true
    getPlatform().then(res => {
        platformArray.value = res.results
        form.platform = platform ? platform : res.results[0].platform
        getCaseMacByPlatform(form.platform).then(res => {
            testCaseArray.value = res.case
            hostMacArray.value = res.mac
            form.testcases = res.case[0]
            form.hostMAC = res.mac[0]
            form.rangedate = lastThreemonths.value
            form.startdate = form.rangedate[0]
            form.enddate = form.rangedate[1]
            if (!platform) {
                onQuery()
            }
        })
    }).finally(() => {
        loading.value = false
    })
}

getData()

const changePlatform = (val) => {
    getData(val)
}

const lastThreemonths = computed(() => {
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(365, 'day').format('YYYY-MM-DD')
    return [start, end]
})

const changeDateTime = (val) => {
    form.startdate = val[0]
    form.enddate = val[1]
}

const shortcuts = [
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

const allServerArray = reactive([])
const summarySeverData = reactive([])

function formaterValue(listRes, replaceKey) {
    const newList = []
    let newObj
    listRes.map((item) => {
        if (item[replaceKey]) {
            newObj = {
                date: item.date,
                value: item[replaceKey],
                hw: item.hw,
                sw: item.sw
            }
        } else {
            newObj = {
                date: item.date,
                value: 'NaN',
                hw: item.hw,
                sw: item.sw
            }
        }
        newList.push(newObj)
    })
    return newList
}

function handleItemsData(res) {
    summarySeverData.splice(0, summarySeverData.length)
    const serverItems = res.results
    allServerArray.splice(0, allServerArray.length)
    for (const serverItem in serverItems) {
        // 初始化 lineOptions 里面的数据， 清空一些值， 否则这些数值赋值后会一直存在，导致数据越来越多
        performanceLineOptions.xAxis.data = []
        performanceLineOptions.series[0].data = []
        performanceLineOptions.series[1].data = []
        // 需要按日期排序 Array, 每个元素为 {date: '2022-09-27 19:01:09', ffdc_times: 134, hw: {…}, job_id: '0', perf_category: 'web_server', …}
        const sortRes = serverItems[serverItem].sort(sortData)
        // 分别将ffdc和real数据给图表
        performanceLineOptions.series[0].data = formaterValue(sortRes, 'ffdc_times')
        performanceLineOptions.series[1].data = formaterValue(sortRes, 'real_times')
        // 遍历数组， 数组里面为多个性能数据 [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        for (let index in sortRes) {
            // 图表标题
            performanceLineOptions.title.text = serverItem
            // 图表X轴坐标
            performanceLineOptions.xAxis.data.push(sortRes[index].date)
        }
        // 将一个服务的性能数据深拷贝到另一个对象，否则数据一直是变化的
        let oneServerTemp = deepClone(performanceLineOptions)
        // 将多个服务的性能归总到一个数组
        allServerArray.push(oneServerTemp)

        summarySeverData.push({
            serverName: serverItem,
            ffdc_times: performanceLineOptions.series[0].data,
            real_times: performanceLineOptions.series[1].data
        })
    }
}

function handleSummaryItemsData() {
    // 生成ffdcAllItem数据
    let tmpLineOptions = deepClone(performanceLineOptions)
    tmpLineOptions.title.text = 'summary_time'
    tmpLineOptions.series = []
    const seriesItem = {
        name: '',
        type: 'line',
        smooth: true,
        data: [],
        lineStyle: {
            normal: {
                color: ''
            }
        },
        itemStyle: {
            color: ''
        }
    }

    // 定义数据线条颜色
    const Color = {
        cli: 'rgba(115,192,222)',
        ipmi: 'rgba(145,204,117)',
        redfish: 'rgba(250,200,88)',
        web: 'rgba(240,128,128)'
    }

    const serverNameList = []
    // 获取FFDC数据
    for (let index in summarySeverData) {
        const serverName = summarySeverData[index].serverName.replace('_server', '') + '_ffdc'
        const item = serverName.split('_')[0]
        if (['cli_ffdc', 'flash_uefi_ffdc', 'flash_xcc_ffdc'].indexOf(serverName) !== -1) {
            continue
        }
        serverNameList.push(serverName)
        seriesItem.name = serverName
        seriesItem.data = summarySeverData[index].ffdc_times
        seriesItem.lineStyle.normal.color = Color[item]
        seriesItem.lineStyle.normal.type = 'dashed'
        seriesItem.itemStyle.color = Color[item]
        tmpLineOptions.series.push(deepClone(seriesItem))
    }
    // 获取actual数据
    for (let index in summarySeverData) {
        const serverName = summarySeverData[index].serverName.replace('_server', '') + '_actual'
        const item = serverName.split('_')[0]
        if (['flash_uefi_actual', 'flash_xcc_actual'].indexOf(serverName) !== -1) {
            continue
        }
        serverNameList.push(serverName)
        seriesItem.name = serverName
        seriesItem.data = summarySeverData[index].real_times
        seriesItem.lineStyle.normal.color = Color[item]
        seriesItem.lineStyle.normal.type = ''
        seriesItem.itemStyle.color = Color[item]
        tmpLineOptions.series.push(deepClone(seriesItem))
    }
    tmpLineOptions.legend.data = serverNameList.sort()
    allServerArray.unshift(tmpLineOptions)
    console.log('Get performanceData finish')
}

const onQuery = () => {
    loading.value = true
    getPerformanceData(form).then(res => {
        handleItemsData(res)
        handleSummaryItemsData()
    }).finally(() => {
        loading.value = false
    })
}

</script>