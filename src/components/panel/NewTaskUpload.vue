<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div class="flex justify-between items-center px-20px py-10px bg-light-200">
                <div>
                    <span class="text-sm font-bold">
                        Upload Build Mode
                    </span>
                    <el-select class="ml-2" v-model="uploadModeValue" size="small">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="uploadModeValue == 'download from drum'">
                    <el-form ref="formRef" :model="uploadUserForm" :rules="rules" label-width="80px" :inline="true"
                        size="small">
                        <el-form-item class="mb-0" label="Username" prop="username">
                            <el-input v-model="uploadUserForm.username" placeholder="Please Input Username"></el-input>
                        </el-form-item>
                        <el-form-item class="mb-0 ml-2" label="Password" prop="password">
                            <el-input v-model="uploadUserForm.password" type="password"
                                placeholder="Please Input Password"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="flex" v-if="uploadModeValue == 'upload file'">
                    <div v-show="isXccBuild" class="flex items-center ml-10">
                        <div class="text-xs font-bold mr-2">
                            XCC Build :
                        </div>
                        <div class="text-xs text-gray-500" v-if="xccFileName">
                            {{ xccFileName }}
                        </div>
                        <div class="text-xs text-gray-500" v-else>
                            No Build Sekected
                        </div>
                        <el-button class="ml-3" type="primary" plain size="small"
                            @click="handleSelect('xcc')">Select</el-button>
                    </div>
                    <div v-show="isUefiBuild" class="flex items-center ml-10">
                        <div class="text-xs font-bold mr-2">
                            UEFI Build :
                        </div>
                        <div class="text-xs text-gray-500" v-if="uefiFileName">
                            {{ uefiFileName }}
                        </div>
                        <div class="text-xs text-gray-500" v-else>
                            No Build Sekected
                        </div>
                        <el-button class="ml-3" type="primary" plain size="small"
                            @click="handleSelect('uefi')">Select</el-button>
                    </div>
                </div>
            </div>
        </el-card>
        <FormDrawer ref="formDrawerRef" title="Upload Build" @submit="handleSubmit" @cancel="handleCancel">
            <el-upload ref="uploadRef" class="upload-demo" drag :action="uploadBuildUrl"
                :headers="{ 'Authorization': token }" name="file" :before-upload="formDrawerRef?.showLoading"
                :on-success="handleSuccess" :on-error="handleError" :on-exceed="handleExceed" :auto-upload="false"
                :limit="2">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        There is no upload file has been selected!
                    </div>
                </template>
            </el-upload>
        </FormDrawer>
    </div>
</template>

<script setup>
import FormDrawer from '~/components/common/FormDrawer.vue'
import { genFileId } from 'element-plus'
import { usePanel } from '~/hooks/useGlobal.js'

// common
const { uploadModeValue } = usePanel()
uploadModeValue.value = 'upload file'
const options = ['upload file', 'download from drum']

// download from drum
const formRef = ref(null)
const { uploadUserForm } = usePanel()
const rules = reactive({
    username: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
    ]
})

const validate = async () => {
    if (!formRef.value) return
    var res = await formRef.value.validate(valid => {
        if (!valid) {
            return false
        } else return true
    })
    return res
}

// upload file
const token = getToken()
const formDrawerRef = ref(null)
const uploadRef = ref(null)
const productData = ref('')
const xccFileName = ref('')
const uefiFileName = ref('')
const uploadBuildUrl = computed(() => uploadBuild(props.data.releaseValue, productData.value, props.data.systemsValue[0]))

const handleSelect = (val) => {
    productData.value = val
    formDrawerRef.value.open()
}

async function handleSubmit() {
    await uploadRef.value.submit()
}

const handleCancel = () => {
    uploadRef.value.abort()
    uploadRef.value.clearFiles()
    formDrawerRef.value.hideLoading()
    formDrawerRef.value.close()
}

const handleSuccess = (response, uploadFile, uploadFiles) => {
    const buildsFormat = {
        buildtype: "files",
        product: "",
        files: []
    }
    console.log(uploadFiles);
    console.log(uploadFiles.map(res => res.response.data.url));
    switch (productData.value) {
        case 'xcc':
            xccFileName.value = uploadFiles[0].name
            buildsFormat.product = 'xcc'
            buildsFormat.files = uploadFiles.map(res => res.response.data.url)
            break;
        case 'uefi':
            uefiFileName.value = uploadFiles[0].name
            buildsFormat.product = 'uefi'
            buildsFormat.files = uploadFiles.map(res => res.response.data.url)
            break;
        default:
            break;
    }
    emit('success', buildsFormat)
    toAsk("Upload success！")
    uploadRef.value.clearFiles()
    formDrawerRef.value.hideLoading()
    formDrawerRef.value.close()
}

const handleError = (error, uploadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg || "文件上传失败"
    uploadRef.value.clearFiles()
    formDrawerRef.value.hideLoading()
    toAsk(msg, "error")
}

const handleExceed = (files) => {
    uploadRef.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value.handleStart(file)
}

const reset = () => {
    xccFileName.value = ''
    uefiFileName.value = ''
}

watchEffect(() => props.data)

defineExpose({
    reset,
    validate
})

const props = defineProps({
    data: Object,
    isXccBuild: {
        type: Boolean,
        default: true
    },
    isUefiBuild: {
        type: Boolean,
        default: true
    },
})

const emit = defineEmits(['success'])
</script>

<style scoped>
:deep(.el-form--inline .el-form-item) {
    margin-right: 0px;
}

:deep(.el-form-item__label) {
    @apply text-black font-bold;
}

:deep(.el-form-item__error) {
    display: none;
}
</style>
