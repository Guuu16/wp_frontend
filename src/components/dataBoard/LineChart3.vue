<template>
    <div ref="elRef" :style="{ 'width': width, 'height': height }"></div>
</template>

<script setup>
import { ref, unref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core'

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    width: {
        type: String,
        default: "100%"
    },
    height: {
        type: String,
        default: "100%"
    }
})

const elRef = ref(null)
let myChart = null

const initChart = () => {
    if (unref(elRef)) {
        myChart = echarts.init(unref(elRef))
        temp().then(() => {
            setTimeout(handleData, 100)
        })
    }
}

onMounted(() => {
    initChart()
})

onBeforeUnmount(() => {
    if (myChart) {
        echarts.dispose(myChart)
    }
})

async function temp() {
    return true
}

function handleData() {


    // myChart.showLoading()
    // getStatistics3(current.value).then((res) => {
    //     option.xAxis.data = res.x
    //     option.series[0].data = res.y
    //     myChart.setOption(option)
    // }).finally(() => {
    //     myChart.hideLoading()
    // })

    myChart.setOption(option)
}

useResizeObserver(elRef, (entries) => myChart.resize())

const option = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            label: {
                show: true,
                position: 'top'
            },
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};

</script>