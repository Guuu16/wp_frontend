<template>
    <el-skeleton style="width: 100%;" animated loading v-if="!autoData">
        <template #template>
            <Card>
                <template #headerLeft>
                    <span>Auto Classified Bug</span>
                </template>
                <template #headerRight>
                    <el-icon class="cursor-pointer" size="21px" color="#909399">
                        <QuestionFilled />
                    </el-icon>
                </template>
                <template #body>
                    <el-row>
                        <el-col :span="4" v-for="(item, index) in 6" :key="index">
                            <el-skeleton-item variant="text" style="width: 50%" />
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" v-for="(item, index) in 6" :key="index">
                            <el-skeleton-item variant="text" style="width: 50%" />
                        </el-col>
                    </el-row>
                </template>
            </Card>
            <Card class="mt-4">
                <template #headerLeft>
                    <span>Manual Classified Bug</span>
                </template>
                <template #headerRight>
                    <el-icon class="cursor-pointer" size="21px" color="#909399">
                        <QuestionFilled />
                    </el-icon>
                </template>
                <template #body>
                    <el-row>
                        <el-col :span="4" v-for="(item, index) in 6" :key="index">
                            <el-skeleton-item variant="text" style="width: 50%" />
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" v-for="(item, index) in 6" :key="index">
                            <el-skeleton-item variant="text" style="width: 50%" />
                        </el-col>
                    </el-row>
                </template>
            </Card>
        </template>
    </el-skeleton>
    <div v-else>
        <Card>
            <template #headerLeft>
                <span>Auto Classified Bug</span>
            </template>
            <template #headerRight>
                <el-tooltip class="box-item" effect="dark" placement="bottom">
                    <template #content>Count the number of bugs currently
                        <br />being processed by manual</template>
                    <el-icon class="cursor-pointer" size="21px" color="#909399">
                        <QuestionFilled />
                    </el-icon>
                </el-tooltip>
            </template>
            <template #body>
                <el-row>
                    <el-col :span="4" v-for="(item, index) in autoData" :key="index">
                        <el-statistic :title="item.name" :value="item.value" />
                    </el-col>
                </el-row>
            </template>
        </Card>
        <Card class="mt-4">
            <template #headerLeft>
                <span>Manual Classified Bug</span>
            </template>
            <template #headerRight>
                <el-tooltip class="box-item" effect="dark" placement="bottom">
                    <template #content>Count the number of bugs currently
                        <br />being processed by auto</template>
                    <el-icon class="cursor-pointer" size="21px" color="#909399">
                        <QuestionFilled />
                    </el-icon>
                </el-tooltip>
            </template>
            <template #body>
                <el-row>
                    <el-col :span="4" v-for="(item, index) in manualData" :key="index">
                        <el-statistic :title="item.name" :value="item.value" />
                    </el-col>
                </el-row>
            </template>
        </Card>
    </div>
</template>
  
<script setup>
import Card from '../common/Card.vue';

const store = useStore()

const autoData = computed(() => store.state.bugs.classified?.auto.filter(res => res.name != 'Closed'))
const manualData = computed(() => store.state.bugs.classified?.manual.filter(res => res.name != 'Closed'))

</script>
  
<style scoped>
.el-col {
    text-align: center;
}
</style>
  