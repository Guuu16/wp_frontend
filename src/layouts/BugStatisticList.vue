<template>
    <div>
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <keep-alive :exclude="['ProjectDetail']">
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>