<template>
    <div>
        <Card>
            <template #headerLeft>
                <div>{{ title }}</div>
            </template>
            <template #body>
                <div>
                    <div ref="chartRef" :style="{ height: height + 'px' }"></div>
                    <el-table :data="props.data" border show-summary style="width: 100%">
                        <el-table-column v-if="props.title == 'Total Defects By Releases'" v-for="(item, index) in items"
                            :prop="item" :label="item" align="center">
                            <template #default="scope">
                                <div v-if="item == 'Team'">
                                    {{ scope.row[item] }}
                                </div>
                                <router-link v-else
                                    :to="{ path: '/statistic/list/detail', query: { 'item_platform': `${scope.row.Team.toLowerCase()}_${item}` } }">
                                    <el-button link type="primary">{{ scope.row[item] }}</el-button>
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column v-else v-for="(item, index) in items" :prop="item" :label="item" align="center" />
                    </el-table>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { debounce } from 'lodash-es'
import { useResizeObserver } from '@vueuse/core'

import Card from "~/components/common/Card.vue"


let myChart = null
const chartRef = ref(null)
const items = computed(() => {
    if (props.data[0]) {
        return Object.keys(props.data[0])
    } return []
})

function format(data) {
    var serie = {
        type: 'bar',
        barGap: 0,
        label: {
            show: true,
            color: '#fff'
        },
        emphasis: {
            focus: 'series'
        },
    }
    var series = []
    if (data[0]) {
        for (let index = 0; index < Object.keys(data[0]).length - 2; index++) {
            series.push(serie)
        }
    }
    return series
}

onMounted(() => {
    if (unref(chartRef)) {
        myChart = echarts.init(unref(chartRef))
        option.series = format(props.data)
        option.dataset.source = props.data
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

const props = defineProps({
    title: String,
    data: Array,
    height: {
        type: Number,
        default: 300
    }
})

const option = reactive({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    xAxis: [
        {
            type: 'category',
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    dataset: {
        source: props.data,
        dimensions: items
    },
    series: []
})

watchEffect(() => {
    option.series = format(props.data)
    option.dataset.source = props.data
    myChart?.setOption(option)
})

const showLoading = () => { myChart?.showLoading() }
const hideLoading = () => { myChart?.hideLoading() }

defineExpose({
    showLoading,
    hideLoading
})
</script>

<style scoped>
:deep(.el-table thead) {
    @apply truncate;
    font-size: 13px;
    color: #333;
}

:deep(.el-table th.el-table__cell) {
    background-color: #fafafa;
}

:deep(.el-table td.el-table__cell) {
    color: #333;
    font-family: Arial, Helvetica, sans-serif;
}
</style>