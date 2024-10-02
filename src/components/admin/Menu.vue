<template>
    <div class="menu" :style="{ width: $store.state.asideWidth }">

        <span class="logo">
            <img src="/logo.png" alt="">
            <span class="text-white font-bold ml-1 truncate" v-show="!isCollapse">BBFV Automation</span>
        </span>

        <el-menu class="border-0" :default-active="route.matched[1].path" :unique-opened="true" :collapse-transition="false"
            :collapse="isCollapse" @select="handleSelect">
            <template v-for="(item, index) in asideMenus" :key="index">
                <el-sub-menu :index="item.name" v-if="item.child && item.child.length > 0">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>
  
<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter()
const route = useRoute()
const store = useStore()
const asideMenus = computed(() => store.state.menus)
const isCollapse = computed(() => !(store.state.asideWidth == '220px'))

const handleSelect = (e) => {
    router.push(e)
}
</script>

<style scoped>
.menu {
    @apply fixed transition-all;
    top: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #202427;
}

.menu::-webkit-scrollbar {
    width: 0px;
}

.logo {
    @apply flex items-center justify-center;
    height: 48px;
    cursor: pointer;
}

.logo>img {
    height: 30px;
}

.el-menu {
    --el-menu-active-color: #fff;
    --el-menu-bg-color: #202427;
    --el-menu-text-color: #fff;
    --el-menu-hover-bg-color: #0284c7;
}

.el-sub-menu .is-active {
    @apply bg-gray-600;
}

.is-active {
    @apply bg-gray-700;
}
</style>