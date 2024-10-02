<template>
    <div v-show="!store.state.loading">
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
                        <td colspan="3">{{ task.jobname?.split('_')[2] }}</td>
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

                    <div v-show="task.params?.source != 'stress'">
                        <div class="my-5">Software Environment</div>
                        <el-table :data="softwareEnvironment" border :header-cell-style="{ backgroundColor: '#f5f7fa' }">
                            <el-table-column prop="variable" label="Variable" width="300px" />
                            <el-table-column prop="configure" label="Configure" />
                        </el-table>
                    </div>

                    <div class="my-5">Hardware Environment</div>
                    <el-table :data="hardwareEnvironment" :span-method="spanMethod" border
                        :header-cell-style="{ backgroundColor: '#f5f7fa' }">
                        <el-table-column prop="hardware" label="Hardware" width="150px" />
                        <el-table-column prop="configure" label="Configure" />
                    </el-table>
                </div>
            </template>
        </Card>

        <el-dialog v-model="dialog" title="Jenkins remote console" align-center width="80%">
            <iframe v-show="url" width="100%" :height="height - 300" scrolling="no" :src="url" frameborder="1"></iframe>
        </el-dialog>
    </div>
</template>

<script setup>
import { formatTime } from "~/hooks/useDateTime.js"
import { useRoute } from "vue-router";
import { useCloned } from "@vueuse/core";
import { useWindowSize } from '@vueuse/core'

import Card from '~/components/common/Card.vue';


const { height } = useWindowSize()
const route = useRoute()
const store = useStore()
const job = ref('')
const task = ref({})
const url = computed(() => {
    if (task.value.urls) {
        return task.value.urls.na
    } else return null
})
const dialog = ref(false)
const title = computed(() => {
    var release = task.value.release?.toUpperCase()
    var systems = task.value.jobname?.split('_')[2]
    var product = task.value.params?.source.toUpperCase()
    return `${release} ${systems} ${product} Auto Test Report`
})
const tableData = ref([])
const softwareEnvironment = ref([])
const hardwareEnvironment = ref([])

function format(rawData) {
    var arr = []
    for (var key in rawData) {
        var obj = {}
        obj.hardware = key
        rawData[key][0].forEach((res) => {
            const { cloned } = useCloned(obj)
            cloned.value.configure = res
            arr.push(cloned.value)
        })
    }
    return arr
}

const spanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}) => {
    let data = hardwareEnvironment.value
    let cellValue = row[column.property]
    let noSortArr = ['configure']
    if (cellValue && !noSortArr.includes(column.property)) {
        let prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        if (prevRow && prevRow[column.property] == cellValue) {
            return { rowspan: 0, colspan: 0 }
        } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] == cellValue) {
                nextRow = data[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
                return { rowspan: countRowspan, colspan: 1 }
            }
        }
    }
}


const getData = async () => {
    let id = route.query.id
    store.state.loading = true
    await getTaskDetail(id).then(res => {
        task.value = res.task
        if (task.value.emaildetail.execstatus) {
            tableData.value = res.task.emaildetail.execstatus[0].test_items
            tableData.value.forEach(res => {
                res.link = res.outputs.link
                res.total = Number(res.passed) + Number(res.failed)
                res.fe = Number(res.error) + Number(res.failed)
                res.passrate = `${(Number(res.passed) / Number(res.total) * 100).toFixed(2)}%`
            })
            softwareEnvironment.value = res.task.emaildetail.environment
            softwareEnvironment.value.shift()
            softwareEnvironment.value.forEach((res, index) => {
                var obj = {}
                obj.variable = res[0]
                obj.configure = res[1]
                softwareEnvironment.value[index] = obj
            })
            hardwareEnvironment.value = format(res.task.emaildetail.HwTable)
        }
        job.value = `${task.value.jobname.split('/')[0]} | ID ${task.value.build_number}`
    }).finally(() => {
        store.state.loading = false
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
