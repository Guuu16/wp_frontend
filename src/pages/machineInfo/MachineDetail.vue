<template>
    <!-- Machine Detail -->
    <div>
        <Card>
            <template #headerLeft>
                Machine Detail
                <div class="ml-4">
                    <el-tag v-if="buildingHost.find((cur) => cur.ip == scope?.IMMIP)" type="warning">
                        {{ buildingHost.find((cur) => cur.ip == scope?.IMMIP)?.user || '--' }} Using
                    </el-tag>
                    <div v-else>
                        <el-tag v-if="scope?.Host_Status == '-1'" type="danger">
                            {{ scope.User }} Repair
                        </el-tag>
                        <el-tag v-else type="success">
                            Machine Ready
                        </el-tag>
                    </div>
                </div>
            </template>
            <template #headerRight>
                <el-button type="primary" size="small" @click="$router.go(-1)">Go Back</el-button>
            </template>
            <template #body>
                <Card shadow="never">
                    <template #headerLeft>
                        Baisc Information
                    </template>
                    <template #headerRight>
                        <el-button type="primary" @click="handleEdit(scope, 'Basic Information')"
                            size="small">Edit</el-button>
                    </template>
                    <template #body>
                        <table width="100%">
                            <tr>
                                <td class="title" width="100px">Tag</td>
                                <td>
                                    <el-tag :type="scope?.Tag == 'auto' ? '' : 'info'" disable-transitions>
                                        {{ scope?.Tag }}
                                    </el-tag>
                                </td>
                                <td class="title" width="150px">Owner</td>
                                <td>{{ scope?.Owner }}</td>
                                <td class="title" width="150px">Create Time</td>
                                <td>{{ scope?.createtime.split('T')[0] }}</td>
                            </tr>
                            <tr>
                                <td class="title" width="100px">BMC ip</td>
                                <td>{{ scope?.IMMIP }}</td>
                                <td class="title" width="150px">BMC Username</td>
                                <td>{{ scope?.IMMUSER }}</td>
                                <td class="title" width="150px">BMC Password</td>
                                <td>{{ scope?.IMMPASSWORD }}</td>
                            </tr>
                            <tr>
                                <td class="title">OS ip</td>
                                <td>{{ scope?.OSIP }}</td>
                                <td class="title">OS username</td>
                                <td>{{ scope?.OSUSER }}</td>
                                <td class="title">OS password</td>
                                <td>{{ scope?.OSPASSWORD }}</td>
                            </tr>
                            <tr>
                                <td class="title">Category</td>
                                <td>{{ scope?.Category }}</td>
                                <td class="title">Name</td>
                                <td>{{ scope?.Name }}</td>
                                <td class="title">Host SN</td>
                                <td>{{ scope?.Host_SN }}</td>
                            </tr>
                            <tr>
                                <td class="title">Location</td>
                                <td>{{ scope?.Location }}</td>
                                <td class="title">PDU Name</td>
                                <td>{{ scope?.PDU }}</td>
                                <td class="title">PDU Port</td>
                                <td>{{ scope?.PDU_Port }}</td>
                            </tr>
                            <tr>
                                <td class="title">Comments</td>
                                <td colspan="5">{{ scope?.Comments }}</td>
                            </tr>
                        </table>
                    </template>
                </Card>

                <Card class="mt-4" shadow="never">
                    <template #headerLeft>
                        Hardware Information
                    </template>
                    <template #headerRight>
                        <el-button type="primary" @click="handleEdit(scope, 'Hardware Information')"
                            size="small">Edit</el-button>
                    </template>
                    <template #body>
                        <el-table :data="hardware" table-layout="auto" border>
                            <el-table-column prop="item" label="Item" width="120px" />
                            <el-table-column prop="name" label="Name" />
                            <el-table-column prop="curNum" label="Cur Num" width="100px" />
                            <el-table-column prop="maxNum" label="Max Num" width="100px" />
                        </el-table>
                    </template>
                </Card>

                <Card class="mt-4" shadow="never" :bodyStyle="{ padding: 0 }">
                    <template #headerLeft>
                        Software Information
                    </template>
                    <template #headerRight>
                        <el-button size="small" @click="handleFormat">Format</el-button>
                        <el-button type="primary" @click="handleSave(scope, 'Hardware Information')" size="small"
                            :loading="loading">Save</el-button>
                    </template>
                    <template #body>
                        <div v-loading="loading" element-loading-text="Waiting for configuration file generation">
                            <json-editor-vue @focus="(obj) => editor = obj" style="max-width: none; height: 800px;"
                                v-model="config_message" />
                        </div>
                    </template>
                </Card>
            </template>
        </Card>
        <MachineAction ref="machineActionRef" title="Edit Machine Information" @success="$store.dispatch('getMachines')">
        </MachineAction>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useCloned } from "@vueuse/core";
import JsonEditorVue from 'json-editor-vue3'
import { ElMessageBox } from 'element-plus'

import Card from '~/components/common/Card.vue';
import MachineAction from '~/components/machineInfo/MachineAction.vue';

const route = useRoute()
const store = useStore()
const scope = computed(() => store.state.machines?.filter(res => res.IMMIP == route.query.ip)[0])
const hardware = computed(() => {
    const origin = scope.value?.hardware
    let res = []
    if (origin) {
        const order = [
            ['CPU', 'CPU_Name', 'CPU_Current_Num', 'CPU_Max_Num'],
            ['DIMM', 'DIMM_Name', 'DIMM_Current_Num', 'DIMM_Max_Num'],
            ['HDD', 'HDD_Capacity', 'HDD_Current_Num', 'HDD_Max_Num'],
            ['PSU', 'PSU_Power', 'PSU_Current_Num', 'PSU_Max_Num'],
            ['RAID', 'RAID_Name', 'RAID_Current_Num', 'N'],
            ['OtherCards', 'OtherCards_Name', 'OtherCards_Current_Num', 'N']
        ]
        for (let index = 0; index < order.length; index++) {
            let format = {
                item: '',
                name: '',
                curNum: '',
                maxNum: ''
            }
            const element = order[index];
            format.item = element[0]
            format.name = origin[element[1]]
            format.curNum = origin[element[2]]
            format.maxNum = element[3] == 'N' ? '--' : origin[element[3]]
            res.push(format)
        }
    }
    return res
})

const buildingHost = ref([])

const getData = async (reload = false) => {
    if (reload || store.state.machines.length == 0) {
        const machines = await store.dispatch('getMachines')
        config_message.value = machines.filter(res => res.IMMIP == route.query.ip)[0]?.config.Config_message
    }
    buildingHost.value = await getBuildingHosts()
}

getData(true)

const timer = setInterval(getData, 5000)

onBeforeUnmount(() => {
    clearInterval(timer)
})

// edit
const machineActionRef = ref(null)
const handleEdit = (val, st) => { machineActionRef.value.open('Edit', st, val) }

// config message
const editor = ref()
const config_message = ref()
const loading = ref(false)

const handleFormat = () => {
    config_message.value = {
        "jenkins_config": store.state.commonConfig['jenkins config template'],
        "test_config": {}
    }
}

const handleSave = async () => {
    var res = editor.value ? await editor.value.validate() : []
    if (res.length == 0) {
        const { cloned } = useCloned(scope.value)
        cloned.value.config.Config_message = JSON.stringify(config_message.value)
        loading.value = true
        await handleMachines('update', cloned.value).finally(() => { loading.value = false })
        getData(true)
    } else {
        ElMessageBox.alert(
            'Please check the JSON format!',
            'Warning',
            {
                confirmButtonText: 'OK',
                type: 'error'
            }
        ).catch(() => { })
    }
}

</script>

<style scoped>
td {
    word-wrap: break-word;
    border: 1px solid #e4e7ed;
    padding: 8px 11px;
    font-size: 14px;
}

.title {
    @apply font-bold;
}

.is-bordered-label {
    font-weight: 0 !important;
}
</style>