<template>
    <div>
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <keep-alive :exclude="['TaskHistoryDetailMem']">
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>