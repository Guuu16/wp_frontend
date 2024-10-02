// store.js
import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const usePanel = createGlobalState(
    () => {
        const releaseValue = ref('')
        const uploadModeValue = ref('')
        const uploadUserForm = reactive({
            username: '',
            password: ''
        })
        return { releaseValue, uploadModeValue, uploadUserForm }
    }
)

export const useStatistic = createGlobalState(
    () => {
        const taskId = ref('')
        const rangeDate = ref([])
        return { taskId, rangeDate }
    }
)
