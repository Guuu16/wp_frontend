<template>
    <div>
        <NewTaskPit></NewTaskPit>

        <TaskStage v-show="runningHosts.length" :source="2" class="my-4"></TaskStage>

        <TaskHistory class="mt-4" :source="2"></TaskHistory>
    </div>
</template>

<script setup>
import NewTaskPit from '~/components/panel/NewTaskPit.vue';
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