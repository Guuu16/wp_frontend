<template>
    <Card>
        <template #headerLeft>
            <span>{{ title }}</span>
        </template>
        <template #headerRight>
            <el-date-picker style="width: 110px" v-model="yearData" type="month" size="small" placeholder="Pick a month"
                value-format="YYYY-MM" @change="getData" />
            <el-tooltip class="box-item" placement="bottom">
                <template #content>The number of bugs detected per day in Auto
                    <br />and Manual within a certain month</template>
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
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es'
import { useResizeObserver } from '@vueuse/core'

import Card from '~/components/common/Card.vue';

let myChart = null
const chartRef = ref(null)
const yearData = ref(dayjs().format('YYYY-MM'))

const getData = () => {
    var date = yearData.value.split('-')
    var year = date[0]
    var month = date[1]
    myChart.showLoading()
    getBugsByMonth(year, month).then((res) => {
        option.series[0].data = res.auto
        option.series[1].data = res.manual
        myChart.setOption(option)
    }).finally(() => {
        myChart.hideLoading()
    })
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

onBeforeUnmount(() => {
    if (myChart) {
        echarts.dispose(myChart)
    }
})

const option = reactive({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
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
    legend: {
        data: ['AUTO', 'MANUAL'],
        top: 0,
        left: 0

    },
    xAxis: [
        {
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            // name: 'Count',
            min: 0,
            boundaryGap: [0, '10%'],
        },
    ],
    grid: {
        left: '0%',
        top: '20%',
        right: '0%',
        bottom: '5%',
        containLabel: true
    },
    series: [
        {
            name: 'AUTO',
            type: 'bar',
            tooltip: {
                valueFormatter: function (value) {
                    return value;
                }
            },
            data: []
        },
        {
            name: 'MANUAL',
            type: 'bar',
            tooltip: {
                valueFormatter: function (value) {
                    return value;
                }
            },
            data: []
        }
    ]
});

// const option = reactive({
//     tooltip: {
//         trigger: 'axis',
//         position: function (pt) {
//             return [pt[0], '10%'];
//         }
//     },
//     toolbox: {
//         feature: {
//             dataZoom: {
//                 yAxisIndex: 'none'
//             },
//             restore: {},
//             saveAsImage: {}
//         }
//     },
//     grid: {
//         left: '0%',
//         top: '20%',
//         right: '1%',
//         bottom: '5%',
//         containLabel: true
//     },
//     xAxis: {
//         type: 'category',
//         boundaryGap: false,
//     },
//     yAxis: {
//         type: 'value',
//         boundaryGap: [0, '20%']
//     },
//     legend: {
//         data: ['AUTO', 'MANUAL'],
//         top: 0,
//         left: 0
//     },
//     series: [
//         {
//             name: 'MANUAL',
//             type: 'line',
//             symbol: 'none',
//             sampling: 'lttb',
//             smooth: true,
//             itemStyle: {
//                 color: 'rgb(255, 70, 131)'
//             },
//             areaStyle: {
//                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//                     {
//                         offset: 0,
//                         color: 'rgb(255, 158, 68)'
//                     },
//                     {
//                         offset: 1,
//                         color: 'rgb(255, 70, 131)'
//                     }
//                 ])
//             },
//             data: []
//         },
//         {
//             name: 'AUTO',
//             type: 'line',
//             symbol: 'none',
//             sampling: 'lttb',
//             smooth: true,
//             itemStyle: {
//                 color: 'rgb(1, 191, 236)'
//             },
//             areaStyle: {
//                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//                     {
//                         offset: 0,
//                         color: 'rgb(128, 255, 165)'
//                     },
//                     {
//                         offset: 1,
//                         color: 'rgb(1, 191, 236)'
//                     }
//                 ])
//             },
//             data: []
//         }
//     ]
// })

const props = defineProps({
    title: String,
    height: String,
    width: {
        type: String,
        default: '100%'
    }
})
</script>

<style scoped>
.header {
    border-bottom: 1px solid var(--el-card-border-color);
}
</style>