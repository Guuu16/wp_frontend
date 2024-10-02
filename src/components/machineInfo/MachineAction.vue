<template>
    <el-drawer v-model="drawer" :destroy-on-close="true" size="40%">
        <template #header>
            <h4>{{ action }} {{ step }}</h4>
        </template>
        <template #default>
            <el-form ref="basicFormRef" v-show="step == 'Basic Information'" :model="formData" label-width="auto"
                label-position="left" :rules="rules">
                <!-- <el-form-item label="Owner" :prop="['Owner', 'Tag']">
                    <el-input v-model="formData.Owner" placeholder="machine owner" class="input-with-select">
                        <template #prepend>
                            <el-select v-model="formData.Tag" placeholder="select tag" style="width: 120px;" prop="Owner">
                                <el-option v-for="(tag, index) in tags" :key="index" :label="tag.text" :value="tag.value" />
                            </el-select>
                        </template>
                    </el-input>
                    <el-select v-model="formData.Tag" placeholder="select tag" style="width: 120px;" prop="Owner">
                        <el-option v-for="(tag, index) in tags" :key="index" :label="tag.text" :value="tag.value" />
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="Release">
                    <el-input v-model="formData.Name" placeholder="e.g Kauai" class="input-with-select">
                        <template #prepend>
                            <el-select v-model="formData.Category" placeholder="select category" style="width: 150px;">
                                <el-option v-for="(release, index) in releases" :key="index" :label="release"
                                    :value="release" />
                            </el-select>
                        </template>
                    </el-input>
                </el-form-item> -->

                <el-form-item label="Tag" prop="Tag">
                    <el-select v-model="formData.Tag" placeholder="select tag">
                        <el-option v-for="(tag, index) in tags" :key="index" :label="tag.text" :value="tag.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Owner" prop="Owner">
                    <el-input v-model="formData.Owner" placeholder="machine owner" />
                </el-form-item>

                <el-form-item label="Category" prop="Category">
                    <el-select v-model="formData.Category" placeholder="select category">
                        <el-option v-for="(release, index) in releases" :key="index" :label="release" :value="release" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Platform" prop="Name">
                    <el-input v-model="formData.Name" placeholder="e.g Kauai" />
                </el-form-item>

                <el-form-item label="BMC Ip" prop="IMMIP">
                    <el-input v-model="formData.IMMIP" placeholder="BMC ip" />
                </el-form-item>
                <el-form-item label="BMC User" prop="IMMUSER">
                    <el-input v-model="formData.IMMUSER" placeholder="BMC username" />
                </el-form-item>
                <el-form-item label="BMC Pwd" prop="IMMPASSWORD">
                    <el-input v-model="formData.IMMPASSWORD" placeholder="BMC password" />
                </el-form-item>

                <el-form-item label="OS">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-input v-model="formData.OSIP" placeholder="OS ip" />
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="formData.OSUSER" placeholder="username" />
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="formData.OSPASSWORD" placeholder="password" />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="PDU">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-input v-model="formData.PDU" placeholder="e.g PDU1" />
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="formData.PDU_Port" placeholder="port e.g 11" />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="Location">
                    <el-input v-model="formData.Location" placeholder="e.g  LX11-05A" />
                </el-form-item>
                <el-form-item label="SN">
                    <el-input v-model="formData.Host_SN" placeholder="e.g  BBFV_R115" />
                </el-form-item>
                <el-form-item label="Comments">
                    <el-input v-model="formData.Comments" type="textarea" placeholder="e.g  JPMT test" />
                </el-form-item>
            </el-form>

            <el-form v-if="step == 'Hardware Information'" :model="formData" label-width="auto" label-position="left">
                <div v-for="(item, index) in order" :key="index">
                    <el-form-item :label="item[0] + ' Name'">
                        <el-input v-model="formData.hardware[item[1]]" :placeholder="item[0] + ' Name'" />
                    </el-form-item>
                    <el-form-item label="Cur Num" v-if="item[3] == 'N'">
                        <el-input v-model="formData.hardware[item[2]]" placeholder="Cur Number" />
                    </el-form-item>
                    <el-form-item label="Cur / Max" v-else>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-input v-model="formData.hardware[item[2]]" placeholder="Cur Number" />
                            </el-col>
                            <el-col :span="12">
                                <el-input v-model="formData.hardware[item[3]]" placeholder="Max Number" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-divider v-if="index + 1 !== order.length" />
                </div>
            </el-form>

            <el-form v-if="step == 'Software Information'" label-position="top" label-width="100px" :model="formData">
                <el-form-item label="Config Message">
                    <json-editor-vue @blur="(obj) => editor = obj" style="width: 100%; height: 500px;"
                        v-model="formData.config.Config_message" />
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">cancel</el-button>
                <el-button v-if="$route.path == '/machine' && step != 'Basic Information'" type="primary"
                    @click="handleBack(step)">back</el-button>
                <el-button v-if="$route.path == '/machine' && step != 'Software Information'" type="primary"
                    @click="handleNext(step)">next</el-button>
                <el-button v-else type="primary" @click="handleConfirm" :loading="loading">confirm</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup>
import { useCloned } from "@vueuse/core";
import JsonEditorVue from "json-editor-vue3"

const store = useStore()
const drawer = ref(false)
const basicFormRef = ref()
const formData = ref()
const step = ref('')
const action = ref('')
const loading = ref(false)
const order = [
    ['CPU', 'CPU_Name', 'CPU_Current_Num', 'CPU_Max_Num'],
    ['DIMM', 'DIMM_Name', 'DIMM_Current_Num', 'DIMM_Max_Num'],
    ['HDD', 'HDD_Capacity', 'HDD_Current_Num', 'HDD_Max_Num'],
    ['PSU', 'PSU_Power', 'PSU_Current_Num', 'PSU_Max_Num'],
    ['RAID', 'RAID_Name', 'RAID_Current_Num', 'N'],
    ['OtherCards', 'OtherCards_Name', 'OtherCards_Current_Num', 'N']
]
const rules = reactive({
    Owner: [
        { required: true, message: 'Please input Activity owner', trigger: 'change' },
    ],
    Tag: [
        { required: true, message: 'Please input Activity tag', trigger: 'change' },
    ],
    Category: [
        { required: true, message: 'Please input Activity category', trigger: 'change' },
    ],
    Name: [
        { required: true, message: 'Please input Activity name', trigger: 'change' },
    ],
    IMMIP: [
        { required: true, message: 'Please input Activity BMC ip', trigger: 'change' },
    ],
    IMMUSER: [
        { required: true, message: 'Please input Activity BMC username', trigger: 'change' },
    ],
    IMMPASSWORD: [
        { required: true, message: 'Please input Activity BMC password', trigger: 'change' },
    ],
})
const tags = [
    { text: 'auto', value: 'auto' },
    { text: 'manual', value: 'manual' },
    { text: 'develop', value: 'develop' },
]

const releases = computed(() => Object.keys(store.state.commonConfig.releases))

const open = (act, stp, val) => {
    const { cloned } = useCloned(val)
    formData.value = cloned.value
    drawer.value = true
    step.value = stp
    action.value = act
}

const handleNext = async (stp) => {
    if (!basicFormRef.value) return
    await basicFormRef.value.validate((valid, fields) => {
        if (valid) {
            switch (stp) {
                case 'Basic Information':
                    step.value = 'Hardware Information'
                    break;
                case 'Hardware Information':
                    step.value = 'Software Information'
                    break;
                default:
                    break;
            }
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}

const handleBack = (stp) => {
    switch (stp) {
        case 'Hardware Information':
            step.value = 'Basic Information'
            break;
        case 'Software Information':
            step.value = 'Hardware Information'
            break;
        default:
            break;
    }
}

const handleConfirm = async () => {
    if (!basicFormRef.value) return
    loading.value = true
    await basicFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            const { cloned } = useCloned(formData.value)
            cloned.value.config.Config_message = JSON.stringify(formData.value.config.Config_message)
            await handleMachines(action.value, cloned.value)
            loading.value = false
            drawer.value = false
            emit('success')
            console.log('submit!')
        } else {
            loading.value = false
            console.log('error submit!', fields)
        }
    })
}

const emit = defineEmits(['success'])

defineExpose({
    open
})
</script>

<style scoped>
:deep(.el-form-item__content) {
    display: block;
}

:deep(.input-with-select .el-input-group__prepend) {
    background-color: var(--el-fill-color-blank);
}
</style>