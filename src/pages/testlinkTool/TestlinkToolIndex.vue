<template>
    <div style="height: 100%;">
        <iframe :style="{ width: '100%', height: height - 49 + 'px' }" src="http://10.240.203.190:8000/" frameborder="0">
        </iframe>
    </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

const { height } = useWindowSize()
</script>
