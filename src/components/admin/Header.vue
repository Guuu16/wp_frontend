<template>
    <div class="shadow-sm">
        <div class="header">
            <div class="header-left">
                <div class="header-button px-2" @click="$store.commit('handleAsideWidth')">
                    <el-icon class="mx-1" size="20px">
                        <Fold />
                    </el-icon>
                </div>
                <div class="mx-1">
                    {{ weekEN }} {{ hour }}:{{ minute }}
                </div>
            </div>
            <div class="flex mx-auto justify-center items-center">

            </div>
            <div class="header-right">
                <div class="header-button px-2" @click="$router.push('/DataBoard')">
                    <el-icon class="mr-1.5" size="20px">
                        <DataAnalysis />
                    </el-icon>
                    DataBoard
                </div>
                <div class="header-button px-2" @click="$router.push('/Introduction')">
                    <el-icon class="mr-1.5" size="20px">
                        <Service />
                    </el-icon>
                    Help
                </div>
                <el-dropdown class="header-button" trigger="click" @command="handleCommand">
                    <span class="flex items-center text-white px-2" style="height: 100%; width: 100%;">
                        <el-icon class="mr-1.5" size="20px">
                            <User />
                        </el-icon>
                        {{ $store.state.user.username }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="Logout">Logout</el-dropdown-item>
                            <!-- <el-dropdown-item command="rePassword">Change Password</el-dropdown-item> -->
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <FormDrawerVue ref="formDrawerRef" @submit="onSubmit" title="Change user password" :destroyOnClose="true">
                    <el-form ref="formRef" label-position="top" label-width="100px" :model="form" :rules="rules">
                        <el-form-item label="Old Password" prop="oldpassword">
                            <el-input v-model="form.oldpassword" placeholder="Please enter the old password" />
                        </el-form-item>
                        <el-form-item label="New Password" prop="password">
                            <el-input v-model="form.password" placeholder="Please enter a new password" />
                        </el-form-item>
                        <el-form-item label="Confirm New Password" prop="repassword">
                            <el-input v-model="form.repassword" placeholder="Please enter the new password again" />
                        </el-form-item>
                    </el-form>
                </FormDrawerVue>
            </div>
        </div>
        <!-- <TagList></TagList> -->
    </div>
</template>

<script setup>
import { useLogout, useRePassword } from "~/hooks/useManager.js";
import { getCurrentTime } from "~/hooks/useDateTime.js"
import FormDrawerVue from '~/components/common/FormDrawer.vue';
// import TagList from '~/components/admin/TagList.vue';

// CurrentTime
const {
    hour,
    minute,
    weekEN
} = getCurrentTime()

// Change Password
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    onSubmit,
    openRePasswordForm
} = useRePassword()

// logout
const {
    handleLogout
} = useLogout()

// handle dropdown
function handleCommand(c) {
    switch (c) {
        case "Logout":
            handleLogout()
            break;
        case "rePassword":
            openRePasswordForm()
            break;
    }
}

</script>

<style scoped>
.header {
    @apply flex items-center p-0;
    font-family: Arial, Helvetica;
    color: #fff;
    font-size: 14px;
    height: auto;
    background: repeating-linear-gradient(125deg, #3287dd, #9f17da, #e74c3c);
    background-size: 300%;
    animation: bgAnimation 15s linear infinite;
}

@keyframes bgAnimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.header-left {
    @apply flex items-center mr-auto;
}

.header-right {
    @apply flex items-center justify-center ml-auto;
    margin: 0;
}

.header-button {
    @apply flex items-center;
    width: auto;
    height: 48px;
    cursor: pointer;
}

.header-button:hover {
    background-color: rgb(0, 121, 186);
}

.icon-btn {
    @apply flex items-center;
    width: 36px;
    height: 48px;
    cursor: pointer;
}

.icon-btn:hover {
    background-color: rgb(0, 121, 186);
}
</style>