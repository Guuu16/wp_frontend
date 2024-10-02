<template>
    <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="Select Group" name="selectGroup">
            <el-table ref="singleTableRef" :data="tableData" style="width: 100%" @current-change="handleCurrentChange"
                table-layout="auto" highlight-current-row>
                <el-table-column width="50">
                    <template #default="scope">
                        <input type="radio" name="option" :checked="currentRow ? scope.row.name == currentRow.name : false">
                    </template>
                </el-table-column>
                <el-table-column property="name" label="Name" width="100" align="center" />
                <el-table-column class="truncate" property="members" label="Members" align="center"
                    :show-overflow-tooltip="true" />
                <el-table-column label="Operations" width="150" align="center">
                    <template #default="scope">
                        <el-button size="small" @click.stop="onEdit(scope.row)">Edit</el-button>
                        <span class="ml-3" @click.stop="">
                            <el-popconfirm title="Delete group？" confirm-button-text="confirm" cancel-button-text="cancel"
                                @confirm="onDelete(scope.row)">
                                <template #reference>
                                    <el-button size="small" type="danger">
                                        Delete
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-between items-center mt-5">
                <div class="ml-auto">
                    <el-button type="primary" @click="saveSelectReceiver">Save</el-button>
                    <el-button @click="closeFormDrawer">Cancel</el-button>
                </div>
            </div>
        </el-tab-pane>

        <el-tab-pane label="Add Group" name="addGroup">
            <el-form ref="addFormRef" label-position="top" :rules="rules" label-width="100px" :model="addFormData">
                <el-form-item label="Group Name" prop="name">
                    <el-input v-model="addFormData.name" placeholder="Please enter the group name" />
                </el-form-item>
                <el-form-item label="Select Members" prop="members">
                    <el-input type="textarea" v-model="addFormData.members" placeholder="Please enter the receviers"
                        :rows="10" />
                </el-form-item>
            </el-form>
            <div class="flex mt-5">
                <div class=" ml-auto">
                    <el-button type="primary" size="default" @click="saveAddReceiver">
                        Save
                    </el-button>
                    <el-button @click="cancelAddReceiver">Cancel</el-button>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
// switch tab
const activeName = ref('selectGroup')

const handleClickTab = (tab, event) => {
    if (tab.props.name == 'addGroup') {
        editId.value = 0
    }
    resetForm()
}

// select group
const currentRow = ref()
const singleTableRef = ref(null)

const handleCurrentChange = (val) => {
    currentRow.value = val
}

const tableData = ref([])

function updateGroup(id, formData) {
    const formFormat = {
        id,
        ...formData,
        action: 'update'
    }
    handleGroups(formFormat)
        .then(res => {
            resetForm()
            activeName.value = 'selectGroup'
            getData()
        })
}

const onEdit = (row) => {
    activeName.value = 'addGroup'
    resetForm(row)
    editId.value = row.id
}

const onDelete = (row) => {
    handleGroups({ ...row, ...{ action: 'delete' } })
        .then(res => {
            getData()
        })
}

function getData() {
    getGroups().then(res => {
        tableData.value = res.group
    })
}

getData()

const saveSelectReceiver = () => {
    singleTableRef.value.setCurrentRow(currentRow.value)
    activeName.value = 'selectGroup'
    emit('saveSelectReceiver', currentRow.value)
}

// add group
const editId = ref(0)
const addFormRef = ref(null)
const addFormData = reactive({
    name: '',
    members: '',
})

const rules = reactive({
    name: [
        { required: true, message: 'Please input Activity notice title', trigger: 'blur' },
    ],
    members: [
        { required: true, message: 'Please input Activity notice content', trigger: 'blur' },
    ],
})

function resetForm(row = false) {
    if (row) {
        addFormRef.value.clearValidate()
        for (const key in addFormData) {
            addFormData[key] = row[key]
        }
    } else {
        addFormData.name = ''
        addFormData.members = ''
    }
}

function createGroup() {
    addFormRef.value.validate((valid) => {
        if (!valid) {
            return
        }
        handleGroups({ ...addFormData, ...{ action: 'create' } })
            .then(res => {
                resetForm()
                activeName.value = 'selectGroup'
                getData()
            })
    })
}

const saveAddReceiver = () => {
    editId.value ? updateGroup(editId.value, addFormData) : createGroup()
}

const cancelAddReceiver = () => {
    if (editId.value) {
        activeName.value = 'selectGroup'
    } else {
        closeFormDrawer()
    }
}

// common
const closeFormDrawer = () => {
    activeName.value = 'selectGroup'
    emit('closeFormDrawer')
}

const emit = defineEmits(['saveSelectReceiver', 'closeFormDrawer'])

</script>

<style scoped>
:deep(.el-table__row) {
    cursor: pointer;
}
</style>