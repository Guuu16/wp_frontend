<template>
    <div>
        <NewTaskPerformance></NewTaskPerformance>

        <TaskStage v-show="runningHosts.length" :source="5" class="my-4"></TaskStage>

        <TaskHistory class="mt-4" :source="5"></TaskHistory>
    </div>
</template>

<script setup>
import NewTaskPerformance from '~/components/panel/NewTaskPerformance.vue';
import TaskHistory from '../../components/panel/TaskHistory.vue';
import TaskStage from '~/components/panel/TaskStage.vue';

const store = useStore()
const runningHosts = computed(() => {
    var arr = []
    store.state.tasks.forEach(element => {
        element.tasks.forEach(element => {
            if (element.result == 'START') {
                arr.push(element)
            }
        })
    });
    return arr
})
</script>
