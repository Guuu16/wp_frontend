<template>
    <el-upload ref="uploadRef" class="upload-demo" drag :action="action" :multiple="isMultiple"
        :headers="{ 'Authorization': token }" name="file" :data="data" :on-success="uploadSuccess" :on-error="uploadError"
        :auto-upload="false" :limit="limit">
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
</template>

<script setup>
import { ref, computed } from "vue";
import { getToken } from "~/hooks/useCookies.js"
import { toAsk } from "~/hooks/useDialog.js"

const uploadRef = ref(null)
const token = getToken()
const isMultiple = computed(() => {
    return props.limit !== 1 ? true : false
})

const emit = defineEmits(["success"])

const handleSubmit = () => {
    uploadRef.value.submit()
}

const handleCancel = () => {
    uploadRef.value.abort()
    uploadRef.value.clearFiles()
}

const uploadSuccess = (response, uploadFile, uploadFiles) => {
    toAsk("Upload success！")
    emit("success", {
        response, uploadFile, uploadFiles
    })
    uploadRef.value.clearFiles()
}

const uploadError = (error, uploadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg || "图片上传失败"
    toAsk(msg, "error")
}

const props = defineProps({
    action: String,
    limit: {
        type: Number,
        default: 1
    },
    data: {
        type: Object,
        default: {}
    }
})

defineExpose({
    handleSubmit,
    handleCancel
})
</script>
