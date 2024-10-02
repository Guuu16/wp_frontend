<template>
    <div>
        <el-row :gutter="16">
            <el-col :span="12" :offset="0">
                <!-- <ChartMonth title="Bug Statistics Monthly" height="350px"></ChartMonth> -->
                <ChartWeek title="Bug Statistics Weekly" height="350px"></ChartWeek>
            </el-col>
            <el-col :span="12" :offset="0">
                <ChartYear title="Bug Statistics Annual" height="350px"></ChartYear>
            </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-4">
            <el-col :span="8" :offset="0">
                <ClassifyProportion title="Bug Proportion" height="210px"></ClassifyProportion>
            </el-col>
            <el-col :span="16" :offset="0">
                <ClassifyStatistic></ClassifyStatistic>
            </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-4">
            <el-col :span="8" :offset="0">
                <Individual ref="bugReporterRef" title="Bug Reporter BBFV" height="360px" :dataSet="bugReporterData">
                </Individual>
            </el-col>
            <el-col :span="8" :offset="0">
                <Individual ref="bugOwnerXCCRef" title="Bug Owner XCC" height="360px" :dataSet="bugOwnerXCCData">
                </Individual>
            </el-col>
            <el-col :span="8" :offset="0">
                <Individual ref="bugOwnerUEFIRef" title="Bug Owner UEFI" height="360px" :dataSet="bugOwnerUEFIData">
                </Individual>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import dayjs from 'dayjs'

import ChartWeek from "~/components/bugStatistic/ChartWeek.vue";
import ChartMonth from "~/components/bugStatistic/ChartMonth.vue";
import ChartYear from "~/components/bugStatistic/ChartYear.vue";
import ClassifyStatistic from "~/components/bugStatistic/ClassifyStatistic.vue";
import ClassifyProportion from "~/components/bugStatistic/ClassifyProportion.vue";
import Individual from "~/components/bugStatistic/Individual.vue";

const store = useStore()
const bugReporterRef = ref(null)
const bugOwnerXCCRef = ref(null)
const bugOwnerUEFIRef = ref(null)
const bugReporterData = ref([])
const bugOwnerXCCData = ref([])
const bugOwnerUEFIData = ref([])
const lastMonth = computed(() => {
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
    return [start, end]
})

const getProportionData = async () => {
    await store.dispatch('getBugs')
}

const getIndividualData = async (reload = true) => {
    if (reload) {
        bugReporterRef.value.showLoading()
        bugOwnerXCCRef.value.showLoading()
        bugOwnerUEFIRef.value.showLoading()
        const { creator, assignee } = await getBugsRank(lastMonth.value)
        bugReporterData.value = creator
        bugOwnerXCCData.value = assignee.xcc
        bugOwnerUEFIData.value = assignee.uefi
        bugReporterRef.value.hideLoading()
        bugOwnerXCCRef.value.hideLoading()
        bugOwnerUEFIRef.value.hideLoading()
    } else {
        const { creator, assignee } = await getBugsRank(lastMonth.value)
        bugReporterData.value = creator
        bugOwnerXCCData.value = assignee.xcc
        bugOwnerUEFIData.value = assignee.uefi
    }
}

onMounted(() => {
    getProportionData()
    getIndividualData()
})

const timer = setInterval(function () {
    getProportionData()
    getIndividualData(false)
}, 5000);

onBeforeUnmount(() => {
    clearInterval(timer)
})

</script>
