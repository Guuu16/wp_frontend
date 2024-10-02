<template>
    <div>
        <el-card :class="{ card: $attrs.shadow != 'never' }" shadow="hover" v-bind="$attrs" :body-style="{ padding: '0px' }"
            :style="{ height: height + 'px' }">
            <div class="flex justify-between items-center header px-20px py-10px bg-light-200" v-bind:style="headerStyle"
                v-if="$slots.headerLeft || $slots.headerRight">
                <div class="flex justify-between items-center">
                    <slot name="headerLeft"></slot>
                </div>
                <div class="flex justify-between items-center">
                    <slot name="headerRight"></slot>
                </div>
            </div>
            <div class="p-20px" v-bind:style="bodyStyle" v-if="$slots.body">
                <slot name="body"></slot>
            </div>
            <div class="flex bottom justify-between px-20px py-10px" v-if="$slots.bottomLeft || $slots.bottomRight">
                <div class="flex justify-between items-center">
                    <slot name="bottomLeft"></slot>
                </div>
                <div class="flex justify-between items-center">
                    <slot name="bottomRight"></slot>
                </div>
            </div>
            <div class="bottom px-20px py-10px" v-if="$slots.bottom">
                <slot name="bottom"></slot>
            </div>
        </el-card>
    </div>
</template>

<script setup>
const props = defineProps({
    height: Number,
    headerStyle: Object,
    bodyStyle: Object
})
</script>

<style scoped>
.card {
    box-shadow: 0 0 6px -1px rgb(0 0 0/0.1);
}

.header {
    border-bottom: 1px solid var(--el-card-border-color);
}

.bottom {
    border-top: 1px solid var(--el-card-border-color);
}
</style>