<template>
    <Card>
        <template #headerLeft>
            <span>{{ title }}</span>
        </template>
        <template #headerRight>
            <el-date-picker style="width: 90px" v-model="year" type="year" size="small" placeholder="Pick a month"
                value-format="YYYY" @change="getData" />
            <el-tooltip class="box-item" placement="bottom">
                <template #content>The number of bugs detected per
                    <br />mounth in Auto and Manual within
                    <br /> a certain year</template>
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

import Card from "../common/Card.vue";

let myChart = null
const chartRef = ref(null)
const year = ref(dayjs().subtract(365, 'day').format('YYYY'))

const getData = () => {
    myChart.showLoading()
    getBugsAnnual(year.value).then((res) => {
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
            data: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
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

const props = defineProps({
    title: String,
    height: String
})
</script>