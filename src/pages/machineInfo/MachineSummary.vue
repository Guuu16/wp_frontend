<template>
    <div>
        <Card>
            <template #headerLeft>
                Machine Information
            </template>
            <template #headerRight>
                <div>
                    <el-input v-model="value" size="small" placeholder="Please input" style="width: 300px">
                        <template #prepend>
                            <el-select size="small" v-model="mode" placeholder="Select" style="width: 80px">
                                <el-option label="immip" value="immip" />
                                <el-option label="owner" value="owner" />
                                <el-option label="platform" value="platform" />
                            </el-select>
                        </template>
                        <template #suffix>
                            <el-icon class="cursor-pointer" @click="handleReset">
                                <Refresh />
                            </el-icon>
                        </template>
                        <template #append>
                            <el-button size="small" @click="handleSearch" :icon="Search" />
                        </template>
                    </el-input>
                </div>
                <!-- <el-input v-model="search" size="small" placeholder="Enter ip to search" /> -->
                <el-button class="ml-3" size="small" style="width: 100%" @click="handleAdd">Add Machine</el-button>
            </template>
            <template #body>
                <el-table ref="tableRef" v-loading="loading" element-loading-text="please wait a moment "
                    :height="height - 170" :data="tableData" style="width: 100%" border>
                    <el-table-column prop="Category" label="Category" :filters="categorys" :filter-method="filterCategory"
                        align="center" min-width="150px" />
                    <el-table-column prop="Name" label="Platform" align="center" min-width="150px" />
                    <el-table-column label="IMMIP" align="center" min-width="150px">
                        <template #default="scope">
                            <el-button link type="primary" @click="jump(scope.row.IMMIP)">{{ scope.row.IMMIP }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Test state" align="center" min-width="140px" :filters="testStates"
                        :filter-method="filterTestState">
                        <template #default="scope">
                            <el-tag v-if="buildingHost.find((cur) => cur.ip == scope.row.IMMIP)" type="warning"
                                disable-transitions>
                                {{ buildingHost.find((cur) => cur.ip == scope.row.IMMIP)?.user || '--' }} Using
                            </el-tag>
                            <div v-else>
                                <el-tag v-if="scope.row.Host_Status == '-1'" type="danger" disable-transitions>
                                    {{ scope.row.User }} Repair
                                </el-tag>
                                <el-tag v-else type="success" disable-transitions>
                                    Machine Ready
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Power state" align="center" min-width="110px">
                        <template #default="scope">
                            <div v-if="powerState?.hasOwnProperty(scope.row.IMMIP)">
                                <el-tag v-if="powerState[scope.row.IMMIP] == 'off'" type="info" disable-transitions>
                                    Power Off
                                </el-tag>
                                <el-tag v-else type="success" disable-transitions>
                                    Power On
                                </el-tag>
                            </div>
                            <el-tag v-else type="warning" disable-transitions>
                                not tracked
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Owner" label="Owner" align="center" min-width="150px" />
                    <el-table-column prop="Tag" label="Tag" :filters="tags" :filter-method="filterTag"
                        filter-placement="bottom-end" align="center" width="100px">
                        <template #default="scope">
                            <el-tag :type="scope.row.Tag == 'auto' ? '' : 'warning'" disable-transitions>
                                {{ scope.row.Tag }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="Operations" align="center" min-width="150px">
                        <template #default="scope">
                            <div class="flex items-center justify-center">
                                <router-link :to="{ path: '/machine/detail', query: { ip: scope.row.IMMIP } }">
                                    <el-button link type="primary" size="small">
                                        Details
                                    </el-button>
                                </router-link>

                                <el-dropdown class="flex ml-2" trigger="click" size="small">
                                    <span class="el-dropdown-link">
                                        More
                                        <el-icon class="el-icon--right">
                                            <arrow-down />
                                        </el-icon>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="handlePower(scope.row, 'on')">powner
                                                on</el-dropdown-item>
                                            <el-dropdown-item @click="handlePower(scope.row, 'off')">powner
                                                off</el-dropdown-item>
                                            <el-dropdown-item @click="handleOpenBackdoor(scope.row)">open
                                                backdoor</el-dropdown-item>
                                            <el-dropdown-item v-if="scope.row.Host_Status == -1"
                                                @click="handleFixed(scope.row)">fixed</el-dropdown-item>
                                            <el-dropdown-item v-else
                                                @click="handleRepair(scope.row)">broken</el-dropdown-item>
                                            <el-dropdown-item divided @click="handleRemove(scope.row.id)">
                                                remove
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </Card>

        <el-dialog v-model="dialog" title="Apply for repair">
            <el-form :model="form">
                <el-form-item label="Comments">
                    <el-input v-model="form.Comments" type="textarea" placeholder="Please enter warranty reason" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialog = false">Cancel</el-button>
                    <el-button type="primary" @click="repairConfirm">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <MachineAction ref="machineActionRef" @success="getData(true)"></MachineAction>
    </div>
</template>

<script setup>
import { useCloned } from "@vueuse/core";
import Card from '~/components/common/Card.vue';
import MachineAction from '~/components/machineInfo/MachineAction.vue';
import { useWindowSize } from '@vueuse/core'
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()
const { height } = useWindowSize()
const tableRef = ref()
const buildingHost = ref([])
const powerState = ref()
const loading = ref(false)

const getData = async (reload = false) => {
    if (reload || store.state.machines.length == 0) {
        loading.value = true
        await store.dispatch('getMachines').finally(() => {
            loading.value = false
        })
    }
    buildingHost.value = await getBuildingHosts()
    powerState.value = await getPowerStatus()
}

getData()

const timer = setInterval(getData, 5000)

const keyDown = e => {
    if (e.key == 'Enter') {
        handleSearch()
    }
}

onMounted(
    () => document.addEventListener('keydown', keyDown)
)

onBeforeUnmount(() => {
    clearInterval(timer)
    tableRef.value.clearFilter()
    document.removeEventListener("keydown", keyDown)
})

// header
const mode = ref('immip')
const value = ref('')
const searchMode = ref('')
const searchValue = ref('')
const tableData = computed(() => {
    switch (searchMode.value) {
        case 'immip':
            return store.state.machines.filter((data) => {
                return !searchValue.value || data.IMMIP.includes(searchValue.value)
            })
        case 'owner':
            return store.state.machines.filter((data) => {
                return !searchValue.value || data.Owner.includes(searchValue.value)
            })
        case 'platform':
            return store.state.machines.filter((data) => {
                return !searchValue.value || data.Name.includes(searchValue.value)
            })
        default:
            return store.state.machines
    }
})

const tags = [
    { text: 'auto', value: 'auto' },
    { text: 'manual', value: 'manual' },
    { text: 'develop', value: 'develop' },
]
const categorys = computed(() => {
    if (store.state.commonConfig.releases) {
        return Object.keys(store.state.commonConfig.releases).map(res => {
            var obj = {}
            obj.text = res
            obj.value = res
            return obj
        })
    } else return []
})
const testStates = [
    { text: 'ready', value: 'ready' },
    { text: 'using', value: 'using' },
    { text: 'repair', value: 'repair' },
]

const handleSearch = () => {
    searchMode.value = mode.value
    searchValue.value = value.value
}

const handleReset = () => {
    value.value = ''
    searchMode.value = ''
    searchValue.value = ''
}

const jump = (url) => { window.open('http://' + url, '_blank') }

const filterTag = (value, row) => row.Tag === value

const filterCategory = (value, row) => row.Category === value

const filterTestState = (value, row) => {
    switch (value) {
        case 'ready':
            return row.Host_Status == 0
        case 'using':
            return buildingHost.value.find((cur) => cur.ip == row.IMMIP)
        case 'repair':
            return row.Host_Status == -1
        default:
            return true
    }
}

// actions
const dialog = ref(false)
const form = ref()
const machineActionRef = ref()

const handlePower = async (row, action) => {
    loading.value = true
    await powerAction(row.IMMIP, action).finally(() => {
        loading.value = false
    })
}

const handleOpenBackdoor = async (row) => {
    loading.value = true
    await openBackdoor(row.IMMIP).finally(() => {
        loading.value = false
    })
}

const handleRepair = (val) => {
    dialog.value = true
    const { cloned } = useCloned(val)
    cloned.value.config.Config_message = JSON.stringify(cloned.value.config.Config_message)
    cloned.value.User = store.state.user.username
    cloned.value.Host_Status = -1
    form.value = cloned.value
}

const handleFixed = (val) => {
    dialog.value = true
    const { cloned } = useCloned(val)
    cloned.value.config.Config_message = JSON.stringify(cloned.value.config.Config_message)
    cloned.value.User = ''
    cloned.value.Host_Status = 0
    form.value = cloned.value
}

const repairConfirm = () => {
    dialog.value = false
    loading.value = true
    handleMachines('update', form.value).then(res => {
        getData(true)
    }).finally(() => {
        loading.value = false
    })
}

const handleRemove = (id) => {
    ElMessageBox.confirm(
        'Are you sure to delete this machine?',
        'Warning',
        {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(() => {
        loading.value = true
        handleMachines('delete', { id }).then(res => {
            getData(true)
        }).finally(() => {
            loading.value = false
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: 'Delete canceled',
        })
    })
}

const handleAdd = () => {
    const format = {
        "IMMIP": "",
        "IMMUSER": "",
        "IMMPASSWORD": "",
        "OSIP": "",
        "OSUSER": "",
        "OSPASSWORD": "",
        "Category": "",
        "Name": "",
        "Location": "",
        "Host_SN": "",
        "Comments": "",
        "User": "",
        "Owner": store.state.user.username,
        "Host_Status": "0",
        "Tag": "",
        "PDU": "",
        "Sw_Config": "",
        "Hw_Config": "",
        "hardware": {
            "Machine": "",
            "CPU_Name": "",
            "CPU_Current_Num": "",
            "CPU_Max_Num": "",
            "DIMM_Name": "",
            "DIMM_Current_Num": "",
            "DIMM_Max_Num": "",
            "DIMM_Source_enough": "",
            "DIMM_Subcatrgory": "",
            "PSU_Power": "",
            "PSU_Current_Num": "",
            "PSU_Max_Num": "",
            "RAID_Name": "",
            "RAID_Current_Num": "",
            "HDD_Capacity": "",
            "HDD_Current_Num": "",
            "HDD_Max_Num": "",
            "OtherCards_Name": "",
            "OtherCards_Current_Num": "",
            "Comment": ""
        },
        "config": {
            "Config_message": {
                "jenkins_config": store.state.commonConfig['jenkins config template'],
                "test_config": {}
            }
        }
    }
    machineActionRef.value.open('Add', 'Basic Information', format)
}
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

.el-dropdown-link {
    font: 12px Arial;
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.el-dropdown-link:focus {
    outline: none;
}

:deep(.el-input-group__prepend) {
    background-color: var(--el-fill-color-blank);
}

:deep(.el-input-group__append) {
    background-color: var(--el-fill-color-blank);
}
</style>

