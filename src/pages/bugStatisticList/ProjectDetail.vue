<template>
    <div>
        <Card>
            <template #headerLeft>
                <div>{{ route.query.item_platform.split('_').join(' ') }}</div>
            </template>
            <template #headerRight>
                <span class="text-xs">
                    Time Range : {{ rangeDate.join(' To ') }}
                </span>
                <el-button class="ml-4" type="primary" size="small" @click="$router.go(-1)">Go Back</el-button>
            </template>
            <template #body>
                <div>
                    <el-table v-loading="loading" element-loading-text="Please wait a moment" :data="bugData" border
                        style="width: 100%" :height="height - 212">
                        <!-- <el-table-column :fixed="index == 0" v-for="(item, index) in items" :key="index" :prop="item"
                            :label="item" header-align="center" align="left" /> -->
                        <el-table-column prop="Id" label="Bug Id" align="center" width="100px" fixed />
                        <el-table-column prop="Product" label="Product" align="center" width="100px" />
                        <el-table-column prop="Summary" header-align="center" label="Bug Title" align="left"
                            width="800px" />
                        <el-table-column prop="Release" label="Release" align="center" width="200px" />
                        <el-table-column prop="Component" label="Component" align="center" width="200px" />
                        <el-table-column prop="Creator" label="Creator" align="center" width="200px" />
                        <el-table-column prop="Assignee" label="handler" align="center" width="200px" />
                        <el-table-column prop="Resolution" label="Resolution" align="center" width="200px" />
                        <el-table-column prop="Status" label="Status" align="center" width="100px" />
                        <el-table-column label="Create Time" align="center" width="200px" fixed="right">
                            <template #default="scope">
                                {{ scope.row.Create_time.slice(0, -1).split('T').join(' ') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template #bottom>
                <div class="flex items-center justify-center">
                    <el-pagination small v-model:page-size="pageSize" :page-sizes="[50, 100, 200, 300]"
                        v-model:current-page="currentPage" layout="sizes, prev, pager, next, jumper" :total="totalPage"
                        @size-change="getData" @current-change="getData" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { useRoute } from "vue-router";
import { useWindowSize } from '@vueuse/core'

import Card from "~/components/common/Card.vue"
import { useStatistic } from '~/hooks/useGlobal.js'

const { height } = useWindowSize()
const { rangeDate } = useStatistic()
const route = useRoute()
const bugData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(50)
const totalPage = ref()
const items = computed(() => {
    if (bugData.value[0]) {
        return Object.keys(bugData.value[0])
    } return []
})

const lastYear = computed(() => {
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(365, 'day').format('YYYY-MM-DD')
    return [start, end]
})

const getData = () => {
    loading.value = true
    if (rangeDate.value.length != 2) {
        rangeDate.value = lastYear.value
    }
    getBugsEffectDetail(
        rangeDate.value[0],
        rangeDate.value[1],
        currentPage.value,
        pageSize.value,
        { item_platform: route.query.item_platform }
    ).then(res => {
        bugData.value = res.list
        totalPage.value = res.pages
    }).finally(() => {
        loading.value = false
    })
}

getData()

</script>

<style scoped>
:deep(.el-table thead) {
    color: #333;
}

:deep(.el-table th.el-table__cell) {
    background-color: #fafafa;
}

:deep(.el-table td.el-table__cell) {
    color: #333;
    font-family: Arial, Helvetica, sans-serif;
}

:deep(.el-table .cell) {
    white-space: nowrap;
}
</style>
