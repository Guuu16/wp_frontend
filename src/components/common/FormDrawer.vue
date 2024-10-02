<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false"
        :destroy-on-close="destroyOnClose">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions" v-if="needButtom">
                <el-button type="primary" @click="emit('submit')" :loading="loading">{{ confirmText }}</el-button>
                <el-button @click="emit('cancel')">Cancel</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "cancel"])

const props = defineProps({
    title: String,
    size: {
        type: String,
        default: "30%"
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    needButtom: {
        type: Boolean,
        default: true
    },
    confirmText: {
        type: String,
        default: "Submit"
    }
})

const showDrawer = ref(false)
const open = () => showDrawer.value = true
const close = () => showDrawer.value = false

const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

defineExpose({
    open,
    close,
    showLoading,
    hideLoading,
})

</script>

<style scoped>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center;
}
</style>