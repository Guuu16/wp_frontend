<template>
    <div>
        <Card>
            <template #headerLeft>
                <span>{{ $route.query.project }}</span>
            </template>
            <template #headerRight>
                <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts"
                    value-format="YYYY-MM-DD" @change="getData" />
                <el-button type="primary" class="ml-2" size="small" @click="$router.push('/statistic/diagram')">
                    go back
                </el-button>
            </template>
            <template #body>
                <div ref="chartRef" :style="{ 'height': chartHeight + 'px' }"></div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import { debounce } from 'lodash-es'
import { useResizeObserver, useWindowSize } from '@vueuse/core'

import Card from "~/components/common/Card.vue";
import { useRoute } from 'vue-router';
import { shortcuts } from '~/hooks/useDateTime.js'

// header
const lastMonth = computed(() => {
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
    return [start, end]
})
const rangeDate = ref(lastMonth.value)

// body
let myChart = null
const chartRef = ref(null)
const option = reactive({
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
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
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
    },
    yAxis: {
        inverse: true,
        type: 'category',
    },
    dataset: {
        source: [],
        dimensions: ['owner', 'Closed', 'Fixed', 'Working', 'Open', 'Verify', 'Rejected', 'Limitation']
    },
    series: [
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Closed
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Fixed
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Working
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Open
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Verify
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Rejected
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: '#fff',
                formatter: function (num) {
                    var value = num.value.Limitation
                    if (value > 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
        }
    ]
})

// common
const route = useRoute()
const { height } = useWindowSize()
const chartHeight = computed(() => {
    if (route.query.project == 'Bug Handler') {
        return height.value * 3
    } else {
        return height.value
    }
})

const getData = async () => {
    myChart.showLoading()
    const { creator, assignee } = await getBugsRank(rangeDate.value)
    var dataSet = []
    switch (route.query.project) {
        case 'Bug Reporter BBFV':
            dataSet = creator
            break;
        case 'Bug Owner XCC':
            dataSet = assignee.xcc
            break;
        case 'Bug Owner UEFI':
            dataSet = assignee.uefi
            myChart.hideLoading()
            break;
        default:
            break;
    }
    option.dataset.source = dataSet
    myChart.setOption(option)
    myChart.hideLoading()

    // if (route.query.project == 'Bug Reporter') {
    //     myChart.showLoading()
    //     const { creator } = await getBugsRank(rangeDate.value)
    //     option.dataset.source = creator
    //     myChart.hideLoading()
    // } else {
    //     myChart.showLoading()
    //     const { assignee } = await getBugsRank(rangeDate.value)
    //     option.dataset.source = assignee
    //     myChart.hideLoading()
    // }
    // myChart.setOption(option)
}

onMounted(() => {
    if (unref(chartRef) && option) {
        myChart = echarts.init(unref(chartRef))
        getData()
        myChart.on('finished', () => {
            useResizeObserver(chartRef, debounce(() => { myChart?.resize() }, 100))
            myChart.off('finished')
        })
    }
})
</script>