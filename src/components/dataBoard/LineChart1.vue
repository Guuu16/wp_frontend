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
            setTimeout(getData, 100)
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

function getData() {


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



let option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
    legend: {
        top: '0%',
        data: ['安卓', 'IOS'],
        textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '12',
        }
    },
    grid: {
        left: '10',
        top: '30',
        right: '10',
        bottom: '10',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.2)'
            }

        },

        data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

    }, {

        axisPointer: { show: false },
        axisLine: { show: false },
        position: 'bottom',
        offset: 20,
    }],

    yAxis: [{
        type: 'value',
        axisTick: { show: false },
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
        axisLabel: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
        },

        splitLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
        {
            name: '安卓',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                color: '#0184d5',
                width: 2
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            },
            itemStyle: {
                color: '#0184d5',
                borderColor: 'rgba(221, 220, 107, .1)',
                borderWidth: 12
            },
            data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4, 3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]

        },
        {
            name: 'IOS',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                color: '#00d887',
                width: 2
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            },
            itemStyle: {
                color: '#00d887',
                borderColor: 'rgba(221, 220, 107, .1)',
                borderWidth: 12
            },
            data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]

        },

    ]

};

</script>