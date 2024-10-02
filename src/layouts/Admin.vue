<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <Menu></Menu>
            </el-aside>
            <el-container :style="{ left: $store.state.asideWidth }">
                <el-header id="header" class="p-0">
                    <Header></Header>
                </el-header>
                <el-main id="main" :class="mainStyle" v-loading="$store.state.loading"
                    element-loading-text="BBFV Automation" element-loading-background="rgba(255, 255, 255, 1)">
                    <router-view v-slot="{ Component }">
                        <transition name="fade">
                            <!-- <keep-alive :max="10"> -->
                            <component :is="Component" />
                            <!-- </keep-alive> -->
                        </transition>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from '~/components/admin/Header.vue';
import Menu from '~/components/admin/Menu.vue';

const route = useRoute()
const mainStyle = computed(() => {
    var whiteList = ['/testlinktool', '/Introduction']
    if (whiteList.includes(route.matched[1].path)) {
        return 'p-0'
    } return 'p-16px'
})
</script>

<style scoped>
.common-layout {
    @apply min-h-screen;
    background-color: #efefef;
}

.el-container {
    top: 0;
    right: 0;
    bottom: 0;
    @apply fixed transition-all;
}

.el-header {
    height: auto;
}

.el-divider--horizontal {
    margin: 5px 0 15px 0;
}

:deep(.el-loading-spinner .el-loading-text) {
    color: black !important;
}
</style>