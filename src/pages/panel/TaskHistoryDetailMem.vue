<template>
    <div>
        <Card>
            <template #headerLeft>
                <div class="font-bold">{{ title }}</div>
            </template>
            <template #headerRight>
                <el-button size="small" @click="$router.push($route.path.split('/detail')[0])">Go Back</el-button>
            </template>
            <template #body>
                <table width="100%">
                    <tr>
                        <td class="title">Job</td>
                        <td>{{ job }}</td>
                        <td class="title">Trigger</td>
                        <td>{{ task.userid }}</td>
                        <td class="title">State</td>
                        <td>
                            <div style="width: 80px;">
                                <el-tag v-if="task.result == 'START'" class="flex justify-center" type="warning">
                                    RUNNING
                                </el-tag>
                                <el-tag v-if="task.result == 'SUCCESS'" class="flex justify-center" type="success">
                                    {{ task.result }}
                                </el-tag>
                                <el-tag v-if="task.result == 'FAILURE'" class="flex justify-center" type="danger">
                                    {{ task.result }}
                                </el-tag>
                                <el-tag v-if="task.result == 'ABORTED'" class="flex justify-center" type="info">
                                    {{ task.result }}
                                </el-tag>
                            </div>
                        </td>
                        <td class="title" rowspan="5" style="width: 80px;">Remote Console</td>
                        <td rowspan="5" align="center" style="width: 300px; height: 1px;">
                            <div class="flex bg-sky-500 cursor-pointer" style="height: 100%;" @click="dialog = true">
                                <img class="m-auto" style="height: 130px;" src="./images/Jenkins_Needs_You-transparent.png"
                                    alt="">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="title">StartTime</td>
                        <td>{{ task.createtime?.replace('T', ' ').split('.')[0] }}</td>
                        <td class="title">Loop</td>
                        <td>{{ task.params?.loop }}</td>
                        <td class="title">Duration</td>
                        <td>{{ formatTime(task.duration) }}</td>
                    </tr>
                    <tr>
                        <td class="title">Sender</td>
                        <td>{{ task.params?.sender.split(',').join(' , ') }}</td>
                        <td class="title">Receiver</td>
                        <td colspan="3">{{ task.params?.receiver.split(',').join(' , ') }}</td>
                    </tr>
                    <tr>
                        <td class="title">Release</td>
                        <td>{{ task.release }}</td>
                        <td class="title">Systems</td>
                        <td colspan="3">{{ task.params?.systems.map(res => res.name).join(' , ') }}</td>
                    </tr>
                    <tr>
                        <td class="title">Items</td>
                        <td colspan="5">{{ task.params?.testItems.join(' , ') }}</td>
                    </tr>
                </table>

                <div v-show="task.emaildetail?.subject">
                    <div class="my-5">Execution Status</div>
                    <el-table :data="tableData" border show-summary :summary-method="getSummaries"
                        :header-cell-style="{ backgroundColor: '#f5f7fa' }">
                        <el-table-column prop="name" label="Test Item">
                            <template #default="scope">
                                <el-button link type="primary" @click="jump(scope.row.link)">{{ scope.row.name
                                }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="passed" label="Pass" align="center" />
                        <el-table-column prop="fe" label="Fail/Error" align="center" />
                        <el-table-column prop="total" label="Total (log)" align="center" />
                        <el-table-column prop="passrate" label="PASS Rate (%)" align="center" />
                    </el-table>

                    <div class="my-5">Software Environment</div>
                    <el-table :data="softwareEnvironment" border :header-cell-style="{ backgroundColor: '#f5f7fa' }">
                        <el-table-column prop="variable" label="Variable" width="300px" />
                        <el-table-column prop="configure" label="Configure" />
                    </el-table>
                </div>

                <div class="my-5">Chart Report</div>
                <Card :class="{ 'mt-5': index != 0 }" v-for="(chartOption, index) in chartOptions" :key="index"
                    shadow="never">
                    <template #body>
                        <Echart :option="chartOption" height="500px"></Echart>
                    </template>
                </Card>
            </template>
        </Card>

        <el-dialog v-model="dialog" title="Jenkins remote console" align-center width="80%">
            <iframe v-show="url" width="100%" :height="height - 300" scrolling="no" :src="url" frameborder="1"></iframe>
        </el-dialog>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useWindowSize, useCloned } from '@vueuse/core'
import { formatTime } from "~/hooks/useDateTime.js"

import Card from '~/components/common/Card.vue';
import Echart from "~/components/common/Echart.vue";


const { height } = useWindowSize()
const route = useRoute()
const loading = ref(false)
const job = ref('')
const task = ref({})
const url = computed(() => {
    if (task.value.urls) {
        return Object.values(task.value.urls)[0]
    } else return null
})
const dialog = ref(false)
const title = computed(() => {
    var release = task.value.release?.toUpperCase()
    var systems = task.value.params?.systems.map(res => res.name).join(' ')
    var product = task.value.params?.source.toUpperCase()
    return `${release} ${systems} ${product} Auto Test Report`
})
const tableData = ref([])
const softwareEnvironment = ref([])
const chartOptions = ref([])
const option = {
    title: {
        text: 'Stacked Line'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: []
};

const getData = async () => {
    let id = route.query.id
    loading.value = true
    await getTaskDetail(id).then(res => {
        task.value = res.task
        var arr = []
        var rawData = task.value.emaildetail.mem_results.all_res
        for (var key in rawData) {
            var element = rawData[key]
            element.name = key
            element.passed = element.Pass
            element.total = element.All_Cases
            element.fe = element.Fail + element.Error
            arr.push(rawData[key])
        }
        tableData.value = arr
        job.value = `${task.value.jobname.split('/')[0]} | ID ${task.value.build_number}`
        var firm = task.value.emaildetail.mem_results.firm
        for (const key in firm) {
            var obj = {}
            obj.variable = key
            obj.configure = firm[key]
            softwareEnvironment.value.push(obj)
        }
    }).finally(() => {
        loading.value = false
    })
    await getStressOptions(id).then(res => {
        var processNameList = res.processNameList.map(res => `processName=${res.id}`)
        getStressChart(id, processNameList.join('&')).then(res => {
            res.watchProcs.forEach(res => {
                const { cloned } = useCloned(option)
                cloned.value.xAxis.data = res.xAxis
                cloned.value.legend.data = res.legend
                cloned.value.title.text = res.name
                const series = res.series
                for (const key in series) {
                    var obj = {
                        name: '',
                        type: 'line',
                        emphasis: {
                            focus: 'series'
                        },
                        data: []
                    }
                    obj.name = key
                    obj.data = series[key]
                    cloned.value.series.push(obj)
                }
                chartOptions.value.push(cloned.value)
            })
        })
    })
}

getData()

const jump = (url) => { window.open(url, '_blank') }

const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        if (index == 0) {
            sums[index] = 'Summary'
            return
        }
        if (index == columns.length - 1) {
            sums[index] = `${(sums[1] / sums[3] * 100).toFixed(2)}%`
            return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => Number.isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!Number.isNaN(value)) {
                    return prev + curr
                } else {
                    return prev
                }
            }, 0)
        } else {
            sums[index] = 'N/A'
        }
    });
    return sums
}

</script>

<style scoped>
:deep(.el-table thead) {
    color: black;
}

td {
    word-wrap: break-word;
    border: 1px solid #e4e7ed;
    padding: 8px 11px;
    font-size: 14px;
}

.title {
    @apply bg-light-600 font-bold;
}

:deep(.el-dialog__body) {
    padding: 0px 20px 30px 20px;
}

.test {
    background-image: url(./images/1681117658935.jpg);
}
</style>
