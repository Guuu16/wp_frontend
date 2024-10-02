<template>
    <div>
        <Card>
            <template #headerLeft>
                <div>
                    Please Select Date Range
                </div>
            </template>
            <template #headerRight>
                <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts"
                    value-format="YYYY-MM-DD" />
                <el-button class="ml-4" type="primary" size="small" @click="getData(false)">Query Data</el-button>
            </template>
        </Card>
        <el-row class="mt-4" :gutter="16">
            <el-col :span="12" :offset="0">
                <ChatTable ref="totalDefectsByReleasesRef" title="Total Defects By Releases"
                    :data="totalDefectsByReleasesData"></ChatTable>
            </el-col>
            <el-col :span="12" :offset="0">
                <ChatTable ref="effectiveDefectsByReleasesRef" title="Effective Defects By Releases Data"
                    :data="effectiveDefectsByReleasesData"></ChatTable>
            </el-col>
        </el-row>
        <el-row class="mt-4" :gutter="16">
            <el-col :span="12" :offset="0">
                <ChatTable ref="categoryByValidityRef" title="Category By Validity" :data="categoryByValidityData">
                </ChatTable>
            </el-col>
            <el-col :span="12" :offset="0">
                <ChatTable ref="invalidDefectsRef" title="Invalid Defects" :data="invalidDefectsData">
                </ChatTable>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'

import ChatTable from '~/components/bugStatistic/ChatTable.vue';
import Card from "~/components/common/Card.vue"
import { useStatistic } from '~/hooks/useGlobal.js'
import { shortcuts } from '~/hooks/useDateTime.js'


// header
const { rangeDate } = useStatistic()

const lastYear = computed(() => {
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(365, 'day').format('YYYY-MM-DD')
    return [start, end]
})


// chart
const categoryByValidityRef = ref(null)
const categoryByValidityData = ref([])
const effectiveDefectsByReleasesRef = ref(null)
const effectiveDefectsByReleasesData = ref([])
const invalidDefectsRef = ref(null)
const invalidDefectsData = ref([])
const totalDefectsByReleasesRef = ref(null)
const totalDefectsByReleasesData = ref([])

// common
const getData = async (init = false) => {
    if (init) {
        rangeDate.value = lastYear.value
    }
    categoryByValidityRef.value.showLoading()
    effectiveDefectsByReleasesRef.value.showLoading()
    invalidDefectsRef.value.showLoading()
    totalDefectsByReleasesRef.value.showLoading()
    await getBugsEffect(rangeDate.value[0], rangeDate.value[1]).then(res => {
        categoryByValidityData.value = res.category_by_validity
        effectiveDefectsByReleasesData.value = res.effective_defects_by_releases
        invalidDefectsData.value = res.invalid_defects
        totalDefectsByReleasesData.value = res.total_defects_by_releases
    })
    categoryByValidityRef.value.hideLoading()
    effectiveDefectsByReleasesRef.value.hideLoading()
    invalidDefectsRef.value.hideLoading()
    totalDefectsByReleasesRef.value.hideLoading()
}

onMounted(() => {
    getData(true)
})
</script>
