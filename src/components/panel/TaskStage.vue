<template>
    <div>
        <Card>
            <template #headerLeft>
                <span>Task Stage</span>
            </template>
            <template #body>
                <Card v-for="(item, index) in stages" :key="index" :class="{ 'mt-3': index != 0 }" shadow="never"
                    :header-style="{ padding: '5px 20px', backgroundColor: '#fafafa' }">
                    <template #headerLeft>
                        <span class=" text-sm mr-2 font-bold">{{ runningHosts[index]?.release }}</span>
                        | {{ runningHosts[index]?.jobname.split('/')[1].split('_').slice(2).join(' ') }}
                        <el-tag class="flex justify-center ml-2" type="success">
                            {{ runningHosts[index]?.userid }} Running
                        </el-tag>
                    </template>
                    <template #headerRight>
                        <el-button v-show="item?.childjob" type="primary" size="small"
                            @click="openRemoteConsole(item?.childjob)">Jenkins
                            Console</el-button>
                        <el-button type="danger" size="small" @click="handleStop(runningHosts[index].id)">Stop</el-button>
                    </template>
                    <template #body>
                        <div v-show="!item || item.nodes?.length == 0">
                            Please wait for the task to start
                        </div>
                        <el-steps :active="item?.nodes.filter(res => res.state == 'FINISHED').length"
                            finish-status="success"
                            :process-status="item?.nodes.filter(res => res.state == 'FAILURE').length == 0 ? 'process' : 'error'"
                            align-center>
                            <el-step v-for="(node, index) in item?.nodes" :key="index" :title="node.displayName" />
                        </el-steps>
                    </template>
                </Card>
            </template>
        </Card>
        <div v-show="false">
            {{ runningHosts }}
        </div>

        <el-dialog v-model="dialog" title="Jenkins remote console" align-center width="80%">
            <iframe v-show="url" width="100%" :height="height - 300" scrolling="no" :src="url" frameborder="1"></iframe>
        </el-dialog>
    </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'

import Card from "../common/Card.vue";

const store = useStore()
const stages = ref([])
const dialog = ref(false)
const url = ref()
const { height } = useWindowSize()
const runningHosts = computed(() => {
    var arr = []
    store.state.tasks.forEach(element => {
        element.tasks.forEach(element => {
            if (element.result == 'START') {
                arr.push(element)
            }
        })
    });
    getData(arr)
    return arr
})

const getData = async (runningHosts) => {
    let arr = []
    for (let index = 0; index < runningHosts?.length; index++) {
        const element = runningHosts[index];
        await getStages(element.build_number, element.jobname, props.source).then(res => {
            arr.push(res[0])
        })
    }
    stages.value = arr
}

const openRemoteConsole = (val) => {
    dialog.value = true
    url.value = val
}

const handleStop = (id) => {
    ElMessageBox.confirm(
        'Are you sure to stop this job?',
        'Warning',
        {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(async () => {
        await stopTask(id).then(res => {
            store.dispatch('getTasks', props.source)
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: 'Operation canceled',
        })
    })

}

const props = defineProps({
    source: Number
})
</script>

<style scoped>
.outer-header {
    @apply flex justify-between items-center px-20px py-12px;
    border-bottom: 1px solid var(--el-card-border-color);
}

.inner-header {
    @apply flex justify-between items-center px-20px py-10px bg-light-200;
    border-bottom: 1px solid var(--el-card-border-color);
}

:deep(.el-step__title) {
    font-size: 12px;
    line-height: 18px;
}

:deep(.el-dialog__body) {
    padding: 0px 20px 30px 20px;
}
</style>
