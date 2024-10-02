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

    title: [{
        text: '年龄分布',
        left: 'center',
        textStyle: {
            color: '#fff',
            fontSize: '16'
        }

    }],
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        position: function (p) {   //其中p为当前鼠标的位置
            return [p[0] + 10, p[1] - 10];
        }
    },
    legend: {

        top: '70%',
        itemWidth: 10,
        itemHeight: 10,
        data: ['0岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上'],
        textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '12',
        }
    },
    series: [
        {
            name: '年龄分布',
            type: 'pie',
            center: ['50%', '42%'],
            radius: ['40%', '60%'],
            color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
            label: { show: false },
            labelLine: { show: false },
            data: [
                { value: 1, name: '0岁以下' },
                { value: 4, name: '20-29岁' },
                { value: 2, name: '30-39岁' },
                { value: 2, name: '40-49岁' },
                { value: 1, name: '50岁以上' },
            ]
        }
    ]
};

</script>