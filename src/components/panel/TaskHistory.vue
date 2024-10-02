<template>
    <div>
        <Card class="transition-all">
            <template #headerLeft>
                <span>Task History</span>
            </template>
            <template #body>
                <el-space direction="vertical" fill :fill-ratio="100" :size="16" style="width: 100%">
                    <Card shadow="never" :header-style="{ padding: '5px 20px', backgroundColor: '#fafafa' }"
                        :body-style="{ padding: '12px 12px 0px 12px' }" v-for="(item, index) in tasks" :key="index">
                        <template #headerLeft>
                            <el-space :size="10" spacer="|">
                                <span class="font-bold">
                                    {{ item.release }}
                                </span>
                                <!-- <span class="text-xs">
                                    {{ item.tasks[0].jobname }}
                                </span> -->
                            </el-space>
                        </template>

                        <template #headerRight>
                            <el-button type="primary" size="small" @click="handleMore(item.release)">More</el-button>
                        </template>

                        <template #body>
                            <el-row :gutter="15">
                                <el-col v-for="(task, index) in item.tasks" :key="index" :span="6">
                                    <el-card class="bg-light-200 mb-3" shadow="never" :body-style="{ padding: '15px' }">
                                        <div class="flex justify-between items-center">
                                            <div class="flex justify-between items-center">
                                                <span class=" text-sm mr-4 font-bold text-gray-500">IP {{
                                                    task.jobname.split('/')[1].split('_').slice(3).join('') }}</span>
                                            </div>
                                            <el-tag v-if="task.result == 'START'" class="flex justify-center"
                                                type="warning">
                                                RUNNING
                                            </el-tag>
                                            <el-tag v-if="task.result == 'SUCCESS'" class="flex justify-center"
                                                type="success">
                                                {{ task.result }}
                                            </el-tag>
                                            <el-tag v-if="task.result == 'FAILURE'" class="flex justify-center"
                                                type="danger">
                                                {{ task.result }}
                                            </el-tag>
                                            <el-tag v-if="task.result == 'ABORTED'" class="flex justify-center" type="info">
                                                {{ task.result }}
                                            </el-tag>
                                        </div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="truncate">
                                                System : {{ task.jobname.split('/')[1].split('_').slice(2, 3).join('') }}
                                            </span>
                                            <el-button link type="primary">
                                                <router-link
                                                    :to="{ path: $route.path + '/detail', query: { id: task.id } }">
                                                    Details
                                                </router-link>
                                            </el-button>
                                        </div>
                                        <div class="text-xs">
                                            <div>
                                                StartTime : {{ task.createtime.replace('T', ' ').split('.')[0] }}
                                            </div>
                                            <div>
                                                TriggerBy : {{ task.userid }}
                                            </div>
                                            <div>
                                                Duration : {{ formatTime(task.duration) }}
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </template>
                    </Card>
                </el-space>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { useCloned } from "@vueuse/core";
import Card from "../common/Card.vue";
import { formatTime } from "~/hooks/useDateTime.js"

// common
const store = useStore()
const getData = async () => {
    await store.dispatch('getTasks', props.source)
}

getData()

const timer = setInterval(getData, 5000)

onBeforeUnmount(() => {
    clearInterval(timer)
})

const props = defineProps({
    source: Number
})

// header
const mores = ref([])
const tasks = computed(() => {
    const { cloned } = useCloned(store.state.tasks)
    return cloned.value.map(res => {
        if (!mores.value.includes(res.release)) {
            res.tasks = res.tasks.slice(0, 4)
            return res
        } return res
    })
})

const handleMore = (val) => {
    if (mores.value.includes(val)) {
        mores.value.splice(mores.value.indexOf(val), 1)
    } else {
        mores.value.push(val)
    }
}
</script>

<style scoped>
.outer-header {
    @apply flex justify-between items-center bg-light-600 px-20px py-10px;
    border-bottom: 1px solid var(--el-card-border-color);
}
</style>
