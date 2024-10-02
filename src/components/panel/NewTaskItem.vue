<template>
    <el-card style="height: 100%;" shadow="never" :body-style="{ padding: '0px' }">
        <div class="flex justify-between items-center header px-20px py-5px bg-light-200">
            <el-checkbox class="text-sm mr-4 font-bold text-black" v-model="checkAll" :indeterminate="isIndeterminate"
                @change="handleCheckAllChange">
                {{ title }}
            </el-checkbox>
            <div class="flex items-center justify-center">
                <slot name="headerRight"></slot>
            </div>
        </div>
        <el-checkbox-group v-model="checkItem" @change="handleItemChange">
            <div class="px-20px" v-for="(item, index) in items" :key="index">
                <el-checkbox :label="item" :name="item" />
            </div>
        </el-checkbox-group>
        <template v-if="loading">
            <el-skeleton animated loading>
                <template #template>
                    <el-checkbox-group v-model="checkItem" @change="handleItemChange">
                        <div class="px-20px py-2" v-for="index in 10" :key="index">
                            <el-skeleton-item variant="h3" style="width: 50%" />
                        </div>
                    </el-checkbox-group>
                </template>
            </el-skeleton>
        </template>
    </el-card>
</template>

<script setup>
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkItem = ref([])

const handleCheckAllChange = (val) => {
    checkItem.value = val ? props.items : []
    isIndeterminate.value = false
    emit('change', checkItem.value)
}

const handleItemChange = (value) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === props.items.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < props.items.length
    emit('change', value)
}

const reset = () => {
    checkItem.value = []
    isIndeterminate.value = false
    checkAll.value = false
    emit('change', [])
}

watchEffect(() => {
    props.items
})

const emit = defineEmits(['change'])

const props = defineProps({
    title: String,
    items: Array,
    loading: {
        type: Boolean,
        default: true
    },
    isUpload: {
        type: Boolean,
        default: true
    }
})

defineExpose({
    reset
})

</script>

<style scoped>
.header {
    border-bottom: 1px solid var(--el-card-border-color);
}
</style>
