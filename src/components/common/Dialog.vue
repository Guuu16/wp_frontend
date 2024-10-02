<template>
    <el-dialog append-to-body v-model="dialogFormVisible" :title="title">
        <slot name="body"></slot>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>

const dialogFormVisible = ref(false)

const open = () => dialogFormVisible.value = true
const close = () => dialogFormVisible.value = false

const props = defineProps({
    title: String,
})

defineExpose({
    open,
    close
})
</script>