<template>
    <div class="tag-list bg-light-600 px-20px">
        <el-tabs v-model="activeTab" @tab-remove="removeTab" @tab-change="changeTag">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title"
                :name="item.path" :lazy="true">
            </el-tab-pane>
        </el-tabs>

        <div class="tag-list-right">
            <div class="px-2.5 text-gray-600" @click="toggle">
                <el-icon size="16px">
                    <FullScreen v-if="!isFullscreen" />
                    <Monitor v-else />
                </el-icon>
            </div>
            <div class="px-2.5 text-gray-600" @click="handleRefresh">
                <el-icon size="16px">
                    <Refresh />
                </el-icon>
            </div>
            <el-dropdown trigger="click" @command="handleClose">
                <span class="flex items-center px-2" style="height: 100%; width: 100%;">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="ClearAll">Clear All</el-dropdown-item>
                        <el-dropdown-item command="ClearOthers">Clear Others</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import { useTabList } from "~/hooks/useTabList.js"

const {
    activeTab,
    tabList,
    changeTag,
    removeTab,
    handleClose
} = useTabList()

// Refresh
const handleRefresh = () => location.reload()

// FullScreen
const { isFullscreen, toggle } = useFullscreen()
</script>
<style scoped>
.tag-list {
    @apply flex items-center;
    overflow: visible !important;
    border-bottom: 1px solid #d4d4d8;
}

.tag-list-right {
    @apply ml-auto flex justify-center items-center;
}

.tag-list-right>div {
    @apply flex items-center;
    width: auto;
    height: 30px;
    cursor: pointer;
}

.tag-list-right>div:hover {
    @apply bg-light-800;
}

:deep(.el-tabs__header) {
    margin: 0;
    border: 0 !important;
    overflow: visible;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    height: 30px;
    line-height: 30px;
}

:deep(.el-tabs__nav-wrap::after) {
    height: 0px;
}
</style>
