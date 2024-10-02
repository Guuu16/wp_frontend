<template>
    <div>
        <Card>
            <template #headerLeft>
                <span>New Task</span>
            </template>

            <template #headerRight>
                <span class="mr-4">Release</span>
                <el-select v-model="releaseValue" filterable placeholder="select releases" @change="changeRelease">
                    <el-option v-for="item in releases" :key="item" :label="item" :value="item" />
                </el-select>
                <span class="mr-4 ml-8">Models</span>
                <el-radio-group v-model="modeValue">
                    <el-tooltip v-for="item in modes" :key="item" :content="item.tip">
                        <el-radio-button :label="item.name">
                            {{ item.name }}
                        </el-radio-button>
                    </el-tooltip>
                </el-radio-group>
            </template>

            <template #body>
                <el-row :gutter="20" v-loading="loading" :element-loading-text="loadingValue">
                    <el-col :span="8" :offset="0">
                        <NewTaskItem ref="systemsRef" :loading="itemsLoading" title="SYSTEMS" :items="systems"
                            @change="changeSystems">
                        </NewTaskItem>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <NewTaskItem ref="xccItemsRef" :loading="itemsLoading" title="XCC TEST" :items="xccItems"
                            @change="changeXccItems">
                        </NewTaskItem>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <NewTaskItem ref="uefiItemsRef" :loading="itemsLoading" title="UEFI TEST" :items="uefiItems"
                            @change="changeUefiItems">
                        </NewTaskItem>
                    </el-col>
                </el-row>

                <NewTaskUpload ref="newTaskUploadRef" v-show="isUpload" class="mt-20px"
                    :data="{ releaseValue, systemsValue }" :isXccBuild="isUploadXccBuild" :isUefiBuild="isUploadUefiBuild"
                    @success="uploadSuccess">
                </NewTaskUpload>
            </template>

            <template #bottomRight>
                <el-icon class="mr-1">
                    <Promotion />
                </el-icon>
                <span class="mr-4 text-gray-500" v-if="receiverValue">
                    Selected : {{ receiverValue.name }}
                </span>
                <span class="mr-4 text-gray-500" v-else>
                    No Group Selected
                </span>
                <el-button @click="formDrawerRef.open()">Select Receiver</el-button>
                <el-button type="primary" @click="onSubmit" :disabled="!isStart" :loading="loading">
                    Start Task
                </el-button>
            </template>
        </Card>

        <FormDrawer ref="formDrawerRef" title="Select Receiver Group" :needButtom="false">
            <NewTaskSelectReceiver @saveSelectReceiver="saveSelectReceiver" @closeFormDrawer="formDrawerRef.close()">
            </NewTaskSelectReceiver>
        </FormDrawer>
    </div>
</template>

<script setup>
import Card from '../common/Card.vue';
import NewTaskItem from '~/components/panel/NewTaskItem.vue';
import FormDrawer from '~/components/common/FormDrawer.vue';
import NewTaskUpload from './NewTaskUpload.vue';
import NewTaskSelectReceiver from './NewTaskReceiver.vue';
import { useCloned } from "@vueuse/core";
import { ElMessageBox } from 'element-plus'

// common
const store = useStore()
const loading = ref(false)
const loadingValue = ref('')
const itemsLoading = ref(false)

const getData = async (release = null) => {
    loading.value = true
    itemsLoading.value = true
    await store.dispatch('getJobs', 'daily').then(res => {
        releaseValue.value = release ? release : res
    }).finally(() => {
        loading.value = false
        itemsLoading.value = false
    })
}

function reset() {
    modeValue.value = 'UPDATE'
    systemsRef.value.reset()
    xccItemsRef.value.reset()
    uefiItemsRef.value.reset()
    newTaskUploadRef.value.reset()
    buildsValue.value = []
    receiverValue.value = ''
}

getData()

// header
const releases = computed(() => store.state.releaseOptions.map(res => res.id))
const releaseValue = ref()
const modes = ref([
    { name: 'FAST', tip: "Don't build docker image" },
    { name: 'UPDATE', tip: "Build docker image" },
    { name: 'DRAFT', tip: "Use draft case" },
])
const modeValue = ref("UPDATE")

const changeRelease = (val) => {
    releaseValue.value = val
    reset()
}

// systems
const systemsRef = ref()
const systemsValue = ref([])
const systems = computed(() => {
    if (releaseValue.value) {
        return store.state.releaseOptions.filter(res => res.id == releaseValue.value)[0].systemOptions
    } else return []
})

const changeSystems = (val) => {
    systemsValue.value = val
}

// xcc items
const xccItemsRef = ref()
const xccItemsValue = ref([])
const xccItems = computed(() => {
    if (releaseValue.value) {
        const items = store.state.releaseOptions.filter(res => res.id == releaseValue.value)[0].testItems.xcc
        return items.filter(res => !['BUILD_DOCKER', 'DRAFT'].includes(res))
    } else return []
})

const changeXccItems = (val) => {
    xccItemsValue.value = val
}

// uefi items
const uefiItemsRef = ref()
const uefiItemsValue = ref([])
const uefiItems = computed(() => {
    if (releaseValue.value) {
        return store.state.releaseOptions.filter(res => res.id == releaseValue.value)[0].testItems.uefi
    } else return []
})

const changeUefiItems = (val) => {
    uefiItemsValue.value = val
}

// upload file
const newTaskUploadRef = ref(null)
const isUpload = computed(() => isUploadXccBuild.value || isUploadUefiBuild.value)
const isUploadXccBuild = computed(() => {
    if (systemsValue.value.length != 0) {
        return xccItemsValue.value.includes('FlashXCC')
    } return false
})
const isUploadUefiBuild = computed(() => {
    if (systemsValue.value.length != 0) {
        return uefiItemsValue.value.includes('FlashUEFI')
    } return false
})
const buildsValue = ref([])

const uploadSuccess = (val) => {
    buildsValue.value.push(val)
}

// bottom
const { uploadModeValue, uploadUserForm } = usePanel()
const formDrawerRef = ref(null)
const receiverValue = ref()
const isStart = computed(() => {
    if (systemsValue.value.length != 0 && [...xccItemsValue.value, ...uefiItemsValue.value].length != 0) {
        if (releaseValue.value && modeValue.value && receiverValue.value) {
            if (uploadModeValue.value == 'upload file') {
                if (isUploadXccBuild.value && buildsValue.value.findIndex(p => p.product == 'xcc') == -1) {
                    return false
                }
                if (isUploadUefiBuild.value && buildsValue.value.findIndex(p => p.product == 'uefi') == -1) {
                    return false
                }
            }
            return true
        }
        return false
    } else return false
})

const saveSelectReceiver = (val) => {
    receiverValue.value = val
    formDrawerRef.value.close()
}

const onSubmit = async () => {
    const formFormat = reactive({
        source: 1,
        release: '',
        p: 'daily',
        groupId: 0,
        params: {
            systems: [],
            loops: {
                RedfishLoops: 1
            },
            testItems: {
                xcc: [],
                uefi: []
            }
        }
    })
    formFormat.release = releaseValue.value
    formFormat.groupId = receiverValue.value.id
    formFormat.params.testItems.xcc = xccItemsValue.value
    formFormat.params.testItems.uefi = uefiItemsValue.value
    switch (modeValue.value) {
        case 'UPDATE':
            formFormat.params.testItems.xcc.push('BUILD_DOCKER')
            break;
        case 'DRAFT':
            formFormat.params.testItems.xcc.push('DRAFT')
            break;
        default:
            break;
    }

    switch (uploadModeValue.value) {
        case 'upload file':
            systemsValue.value.forEach(system => {
                const systemsFormat = {
                    name: '',
                    builds: [],
                    "flag": true
                }
                systemsFormat.name = system
                systemsFormat.builds = buildsValue.value
                formFormat.params.systems.push(systemsFormat)
            })
            break;
        case 'download from drum':
            if (await newTaskUploadRef.value.validate()) {
                var builds = []
                const buildsFormat = {
                    buildtype: "drum",
                    product: "",
                    drum: [
                        uploadUserForm.username,
                        uploadUserForm.password
                    ]
                }
                if (isUploadXccBuild.value) {
                    const { cloned } = useCloned(buildsFormat)
                    cloned.value.product = 'xcc'
                    builds.push(cloned.value)
                }
                if (isUploadUefiBuild.value) {
                    const { cloned } = useCloned(buildsFormat)
                    cloned.value.product = 'uefi'
                    builds.push(cloned.value)
                }
                systemsValue.value.forEach(system => {
                    const systemsFormat = {
                        name: '',
                        builds: [],
                        "flag": true
                    }
                    systemsFormat.name = system
                    systemsFormat.builds = builds
                    formFormat.params.systems.push(systemsFormat)
                })
            }
            else {
                ElMessageBox.alert(
                    'The username and password is required!',
                    'Warning',
                    {
                        confirmButtonText: 'OK',
                        type: 'error'
                    }
                ).catch(() => { })
                return
            }
            break;
        default:
            break;
    }
    loading.value = true
    loadingValue.value = 'Task Trigger, Please Wait!'
    runTask(formFormat).then(res => {
        reset()
        getData(releaseValue.value)
    }).finally(() => {
        loading.value = false
    })
}

</script>

<style scoped>
.header {
    border-bottom: 1px solid var(--el-card-border-color);
}

.bottom {
    border-top: 1px solid var(--el-card-border-color);
}
</style>
