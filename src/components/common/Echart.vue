<template>
    <div ref="elRef" :style="{ 'width': width, 'height': height }"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { debounce } from 'lodash-es'
import { useResizeObserver } from '@vueuse/core'

const elRef = ref(null)
let myChart = null

const showLoading = () => { myChart?.showLoading() }
const hideLoading = () => { myChart?.hideLoading() }

onMounted(() => {
    if (unref(elRef) && props.option) {
        myChart = echarts.init(unref(elRef))
        myChart?.setOption(unref(props.option))
        myChart.on('finished', () => {
            useResizeObserver(elRef, debounce(() => { myChart?.resize() }, 100))
            myChart.off('finished')
        })
    }
})

watchEffect(() => {
    props.option
    myChart?.setOption(props.option)
})

const props = defineProps({
    option: {
        type: Object,
        required: true
    },
    width: {
        type: String,
        default: "100%"
    },
    height: {
        type: String,
        default: "100px"
    }
})

defineExpose({
    showLoading,
    hideLoading
})
</script>
