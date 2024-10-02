<template>
    <Card>
        <template #headerLeft>
            <span>{{ title }}</span>
        </template>
        <template #headerRight>
            <router-link :to="{ path: '/statistic/diagram/individual/detail', query: { project: title } }">
                <el-button type="primary" class="ml-2" size="small" plain round>
                    Details
                </el-button>
            </router-link>
            <el-tooltip class="box-item" placement="bottom">
                <template #content>The total number of bugs discovered<br />
                    or handled by individuals in the past<br />
                    30 days</template>
                <el-icon class="cursor-pointer ml-2" size="21px" color="#909399">
                    <QuestionFilled />
                </el-icon>
            </el-tooltip>
        </template>
        <template #body>
            <div ref="chartRef" :style="{ 'height': height }"></div>
        </template>
    </Card>
</template>

<script setup>
import * as echarts from 'echarts';
import { debounce } from 'lodash-es'
import { useResizeObserver } from '@vueuse/core'

import Card from "../common/Card.vue";


let myChart = null
const chartRef = ref(null)

const option = reactive({
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
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
        max: 9
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

// const option = reactive({
//     grid: {
//         left: '0%',
//         top: '0%',
//         right: '2%',
//         bottom: '5%',
//         containLabel: true
//     },
//     xAxis: {
//         max: 'dataMax'
//     },
//     yAxis: {
//         type: 'category',
//         inverse: true,
//         animationDuration: 300,
//         animationDurationUpdate: 300,
//         max: 9 // only the largest 3 bars will be displayed
//     },
//     dataset: {
//         source: [],
//         dimensions: ['owner', 'count']
//     },
//     series: [
//         {
//             realtimeSort: true,
//             name: 'count',
//             type: 'bar',
//             label: {
//                 show: true,
//                 align: 'right',
//                 position: 'insideRight',
//                 color: '#fff'
//             },
//             itemStyle: {
//                 color: function (param) {
//                     switch (props.title) {
//                         case 'Bug Reporter':
//                             if (param.value.count >= 10) {
//                                 if (param.value.count >= 15) {
//                                     return '#F56C6C'
//                                 }
//                                 return '#67C23A'
//                             } else {
//                                 return '#409EFF'
//                             }
//                         case 'Bug Handler':
//                             if (param.value.count >= 5) {
//                                 if (param.value.count >= 10) {
//                                     return '#F56C6C'
//                                 }
//                                 return '#67C23A'
//                             } else {
//                                 return '#409EFF'
//                             }
//                         default:
//                             return '#409EFF'
//                     }

//                 }
//             },
//         }
//     ],
//     animationDurationUpdate: 3000,
//     animationEasing: 'linear',
//     animationEasingUpdate: 'linear'
// })

watchEffect(() => {
    option.dataset.source = props.dataSet
    myChart?.setOption(option)
})

onMounted(() => {
    if (unref(chartRef) && option) {
        myChart = echarts.init(unref(chartRef))
        myChart.on('finished', () => {
            useResizeObserver(chartRef, debounce(() => { myChart?.resize() }, 100))
            myChart.off('finished')
        })
    }
})

const showLoading = () => myChart.showLoading()
const hideLoading = () => myChart.hideLoading()

const props = defineProps({
    title: String,
    height: String,
    dataSet: Array
})

defineExpose({
    showLoading,
    hideLoading
})
</script>

<style scoped>
.header {
    border-bottom: 1px solid var(--el-card-border-color);
}
</style>