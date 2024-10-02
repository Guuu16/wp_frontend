<template>
    <Card>
        <template #headerLeft>
            <span>{{ title }}</span>
        </template>
        <template #headerRight>
            <el-tooltip class="box-item" effect="dark" placement="bottom">
                <template #content>Count the number of bugs currently
                    <br />being processed</template>
                <el-icon class="cursor-pointer" size="21px" color="#909399">
                    <QuestionFilled />
                </el-icon>
            </el-tooltip>
        </template>
        <template #body>
            <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                    <Echart ref="autoRef" :option="autoOption" :height="height"></Echart>
                </el-col>
                <el-col :span="12" :offset="0">
                    <Echart ref="manualRef" :option="manualOption" :height="height"></Echart>
                </el-col>
            </el-row>
        </template>
    </Card>
</template>

<script setup>
import { computed } from "vue";
import { useCloned } from "@vueuse/core";
import Card from "../common/Card.vue";
import Echart from "../common/Echart.vue";

// common
const store = useStore()
const props = defineProps({
    title: String,
    height: String
})

// auto
const autoRef = ref()

const autoOption = computed(() => {
    const { cloned } = useCloned(option)
    cloned.value.title.text = 'AUTO'
    cloned.value.series[0].data = store.state.bugs.classified?.auto.filter(res => res.name != 'Closed')
    return cloned.value
})

// manual
const manualRef = ref()
const manualOption = computed(() => {
    const { cloned } = useCloned(option)
    cloned.value.title.text = 'MANUAL'
    cloned.value.series[0].data = store.state.bugs.classified?.manual.filter(res => res.name != 'Closed')
    return cloned.value
})

const option = reactive({
    title: {
        left: 'center',
        text: 'Large Area Chart'
    },
    grid: {
        top: 'bottom'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 20,
                }
            },
            labelLine: {
                show: true
            },
            data: [
            ]
        }
    ]
});
</script>