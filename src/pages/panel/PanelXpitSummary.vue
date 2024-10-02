<template>
    <div>
        <NewTaskXpit></NewTaskXpit>

        <TaskStage v-show="runningHosts.length" :source="0" class="my-4"></TaskStage>

        <TaskHistory class="mt-4" :source="0"></TaskHistory>
    </div>
</template>

<script setup>
import NewTaskXpit from '~/components/panel/NewTaskXpit.vue';
import TaskStage from '~/components/panel/TaskStage.vue';
import TaskHistory from '../../components/panel/TaskHistory.vue';

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
