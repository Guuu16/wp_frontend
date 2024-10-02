<template>
    <div>
        <Card>
            <template #headerLeft>
                <div>Common Config</div>
            </template>
            <template #headerRight>
                <el-button size="small" @click="drawer = true">Create
                    Config</el-button>
            </template>
            <template #body>
                <Card :header-style="{ padding: '5px 20px' }" :bodyStyle="{ padding: 0 }" shadow="never"
                    :class="{ 'mt-5': index != 0 }" v-for="(item, index) in allConfig" :key="index">
                    <template #headerLeft>
                        <div> {{ item.CommonConfigName }} </div>
                    </template>
                    <template #headerRight>
                        <el-button size="small" type="danger" @click="handleDelete(item.id)">Delete</el-button>
                        <el-button size="small" type="primary" :loading="saveLoading"
                            @click="handleSave(item.id, item.CommonConfigName)">Save</el-button>
                    </template>
                    <template #body>
                        <json-editor-vue @focus="(obj) => editor = obj" style="max-width: none; height: 400px;"
                            v-model="item.CommonConfig_message" />
                    </template>
                </Card>
            </template>
        </Card>

        <el-drawer v-model="drawer" title="Create Common Config">
            <el-form label-position="top" label-width="100px" :model="form">
                <el-form-item label="Config Name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="Config Message">
                    <json-editor-vue @blur="(obj) => editor = obj" style="width: 100%; height: 500px;"
                        v-model="form.message" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button type="primary" @click="handleSubmit">Submit</el-button>
                    <el-button @click="drawer = false">Cancel</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import Card from "~/components/common/Card.vue"
import JsonEditorVue from 'json-editor-vue3'
import { ElMessage, ElMessageBox } from 'element-plus'

// common
const store = useStore()
const allConfig = ref([])
const editor = ref()
const saveLoading = ref(false)
const form = reactive({
    id: '',
    action: '',
    name: '',
    message: {}
})

const getData = async () => {
    allConfig.value = await store.dispatch('getCommonConfig')
}

const clearData = () => {
    form.id = ''
    form.action = ''
    form.name = ''
    form.message = {}
}

getData()

const handleSave = async (id, name) => {
    var res = editor.value ? await editor.value.validate() : []
    if (res.length == 0) {
        form.id = id
        form.action = 'update'
        form.name = name
        form.message = allConfig.value.filter(res => {
            return res.CommonConfigName == name
        })[0].CommonConfig_message
        saveLoading.value = true
        handleCommonConfig(form).then(res => {
            getData()
            clearData()
        }).finally(() => {
            saveLoading.value = false
        })
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

// create config
const drawer = ref(false)

const handleSubmit = async () => {
    var res = editor.value ? await editor.value.validate() : []
    if (res.length == 0) {
        form.action = 'create'
        handleCommonConfig(form).then(res => {
            getData()
            clearData()
        })
        drawer.value = false
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

// delete
const handleDelete = (id) => {
    ElMessageBox.confirm(
        'Are you sure to delete this common config?',
        'Warning',
        {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(() => {
        form.id = id
        form.action = 'delete'
        handleCommonConfig(form).then(res => {
            getData()
            clearData()
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: 'Delete canceled',
        })
    })
}

</script>

<style>
.jsoneditor-poweredBy {
    display: none;
}

.jsoneditor {
    border: none;
}

.jsoneditor-menu {
    color: #000;
    background-color: #059669;
    border-bottom: 0px solid #e0e0e0;
}

.ace_content {
    background-color: #fafafa;
}
</style>