<template>
    <div v-show="show">
        <el-row class="login-container" :style="backgroundStyle">
            <el-col :lg="14" :md="12" :sm="12" class="left">
                <div class="left-logo">
                    <img src="../assets/common/Lenovo-logo-1.png" alt="">
                </div>
                <div class="left-time">
                    <div class="text-9xl">
                        {{ hour }}:{{ minute }}
                    </div>
                    <div class="text-4xl flex justify-between">
                        <span class="tracking-wider">
                            {{ month }}月{{ day }}日
                        </span>
                        <span class="tracking-widest">
                            {{ weekCN }}
                        </span>
                    </div>
                </div>
            </el-col>
            <el-col :lg="10" :md="12" :sm="12" class="right">
                <div class="top flex justify-between items-center">
                    <div class="flex items-center" @click="$router.push('/DataBoard')">
                        <el-icon class="mr-2" size="20px">
                            <DataAnalysis />
                        </el-icon>
                        DataBoard
                    </div>
                    <div class="flex items-center">
                        <el-icon class="mr-2" size="20px">
                            <Microphone />
                        </el-icon>
                        Language
                    </div>
                </div>
                <div class="right-middle">
                    <div class="flex justify-center items-center h-100px">
                        <!-- <img src="../assets/common/XCC-logo.png" alt=""> -->
                        <img class="h-60px" src="/logo.png" alt="">
                        <span class="font-bold text-3xl ml-3">BBFV AUTOMATION</span>
                    </div>
                    <el-form ref="formRef" :model="form" class="login-form" :rules="rules">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="User name" class="el-input-wrapper">
                                <template #prefix>
                                    <el-icon class="el-input__icon">
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" placeholder="Password" class="el-input-wrapper"
                                type="password" show-password>
                                <template #prefix>
                                    <el-icon class="el-input__icon">
                                        <Unlock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit" class="el-button"
                                :loading="loading">Login</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="login_right_bottom">
                    <img src="../assets/common/ThinkSystem-logo.png" alt="">
                    <span>© 2023 Lenovo. All rights reserved.</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useLogin } from "~/hooks/useManager.js";
import { getCurrentTime } from "~/hooks/useDateTime.js"
import { showLoadPage } from '~/hooks/useLoadPage.js'

// 获取当前时间
const {
    week,
    month,
    day,
    hour,
    minute,
    weekCN
} = getCurrentTime()

// 按时间生成背景
function getImageUrl(name) {
    return new URL(`../assets/background/${name}`, import.meta.url).href
}

const backgroundImgUrl = computed(() => {
    let imgUrl = ""
    if (week.value == 0) {
        imgUrl = getImageUrl('bg-6.png')
    } else if (week.value == 1) {
        imgUrl = getImageUrl('bg-1.jpg')
    } else if (week.value == 2) {
        imgUrl = getImageUrl('bg-2.png')
    } else if (week.value == 3) {
        imgUrl = getImageUrl('bg-3.png')
    } else if (week.value == 4) {
        imgUrl = getImageUrl('bg-4.jpg')
    } else if (week.value == 5) {
        imgUrl = getImageUrl('bg-5.jpg')
    } else if (week.value == 6) {
        imgUrl = getImageUrl('bg-6.png')
    }
    return imgUrl
})

const backgroundStyle = computed(() => {
    let style = "background-image:url('" + backgroundImgUrl.value + " ')"
    return style
})

// 随机背景
// const backgroundStyle = computed(() => {
//     let imgs = [
//         getImageUrl('bg-1.png'),
//         getImageUrl('bg-2.png'),
//     ];
//     let imgName = imgs[Math.floor(Math.random() * imgs.length)]; //进行计算随机
//     let style = "background-image:url('" + imgName + " ')"
//     return style
// })


// 处理登录操作
const {
    form,
    formRef,
    loading,
    rules,
    onSubmit
} = useLogin()

const keyDown = e => {
    if (e.keyCode == 13) {
        onSubmit()
    }
}

const show = ref(false)
const { showLoaing, hideLoading } = showLoadPage()
onBeforeMount(() => {
    showLoaing()
})

onMounted(
    () => {
        document.addEventListener('keydown', keyDown)
        let bgImg = new Image()
        bgImg.src = backgroundImgUrl.value
        bgImg.onload = () => {
            hideLoading()
            show.value = true
        }
    }
)

onBeforeUnmount(
    () => {
        document.removeEventListener("keydown", keyDown)
    }
)

</script>

<style scoped>
.login-container {
    @apply min-h-screen;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.left {
    position: relative;
}

.left-logo {
    width: 50px;
    height: 150px;
    position: absolute;
    left: 0;
}

.left-time {
    @apply text-light-50 font-light text-shadow-xl;
    position: absolute;
    bottom: 100px;
    left: 100px;
}

.right {
    @apply flex items-center flex-col;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px;
    color: #fff;
    font-family: Arial, Helvetica;
    line-height: 2;
    position: relative;
}

.top {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    box-sizing: border-box;
    height: 30px;
    width: 100%;
}

.top>div {
    @apply px-3;
    position: relative;
    float: right;
    line-height: 30px;
    cursor: pointer;
    text-align: right;
}

.top>div:hover {
    background-color: #0284c7;
}

.right-middle {
    width: 100%;
    margin-top: 70px;
}

.login-form {
    @apply flex items-center flex-col;
    width: 300px;
    margin: 25px auto;
}

.el-input-wrapper {
    width: 300px;
    height: 50px;
    font-size: 15px;
    line-height: 32px;
}

.el-button {
    @apply font-bold;
    margin-top: 50px;
    font-size: 18px;
    height: 50px;
    width: 300px;
    background-color: #333f4b;
    border: transparent;
}

.el-button:hover {
    background-color: #0284c7;
}

.login_right_bottom {
    width: 100%;
    bottom: 10px;
    text-align: center;
    position: absolute;
}

.login_right_bottom>img {
    margin-bottom: 100px;
    height: 50px;
    margin: auto;
}

.login_right_bottom>span {
    height: 50px;
    font-size: 12px;
    line-height: 50px;
}
</style>