<template>
    <div>
        <el-card class="shadow-card" shadow="never" :body-style="{ padding: '0px' }">
            <div class="body">
                <div class="px-150px py-100px" style="background-color: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px);">
                    <el-row :gutter="0">
                        <el-col class="test flex justify-center items-center" :style="{ height: (height / 6) + 'px', }"
                            :span="6" v-for="item in tags" :key="item" @click="jump(item.url)">
                            <div>
                                <div class="flex items-center justify-center bg-light-600 p-2 rounded-lg">
                                    <el-image :style="{ width: height * 0.06 + 'px', height: height * 0.06 + 'px' }"
                                        :src="item.avatar" fit="contain" />
                                </div>
                                <div class="text-center mt-4 text-white">
                                    {{ item.title }}
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- <div>
                <el-calendar />
            </div> -->
                </div>
            </div>
        </el-card>

        <!-- <TestSchedule></TestSchedule> -->
    </div>
</template>
  
<script setup>
import { useWindowSize } from '@vueuse/core'
import TestSchedule from '~/components/index/TestSchedule.vue'

import gitLag from '~/assets/tags/gitLab.svg'
import jenkins from '~/assets/tags/jenkins.svg'
import apollo from '~/assets/tags/apollo.png'
import nexus from '~/assets/tags/nexus.svg'
import jira from '~/assets/tags/jira.png'
import bugZila from '~/assets/tags/bugZila.png'
import armory from '~/assets/tags/armory.ico'
import drum from '~/assets/tags/drum.ico'
import testLink from '~/assets/tags/testLink.png'
import outlook from '~/assets/tags/outlook.svg'
import wiki from '~/assets/tags/wiki.png'
import docker from '~/assets/tags/docker.ico'

const { height } = useWindowSize()

const jump = (url) => { window.open(url, '_blank') }

const tags = [
    { title: 'GitLab', avatar: gitLag, url: 'https://gitlab.bbfv.lenovo.com/users/sign_in' },
    { title: 'Jenkins', avatar: jenkins, url: 'http://10.240.203.173:8080/' },
    { title: 'Apollo', avatar: apollo, url: 'http://10.240.203.18:8070/signin' },
    { title: 'Nexus', avatar: nexus, url: 'http://10.240.203.121:8081/' },
    { title: 'Jira', avatar: jira, url: 'https://jira1.labs.lenovo.com/secure/Dashboard.jspa' },
    { title: 'BugZila', avatar: bugZila, url: 'https://bz.labs.lenovo.com/' },
    { title: 'Armory', avatar: armory, url: 'https://armory.labs.lenovo.com/orders/borrow/66306/' },
    { title: 'Drum', avatar: drum, url: 'https://drum.labs.lenovo.com/users/login' },
    { title: 'TestLink', avatar: testLink, url: 'http://10.240.203.102:8080/index.php' },
    { title: 'Outlook', avatar: outlook, url: 'https://outlook.office365.com/mail/' },
    // { title: 'Wiki', avatar: wiki, url: 'http://fw.core.lenovo.com:8085/doku.php?id=start' },
    { title: 'Harbor', avatar: docker, url: 'https://fw.bbfv.lenovo.com:8443/account/sign-in?redirect_url=%2Fharbor%2Fprojects' },
]
</script>

<style scoped>
.shadow-card {
    box-shadow: 0 0 6px -1px rgb(0 0 0/0.1);
}

.body {
    background-image: url(~/assets/background/bg-5.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    backdrop-filter: blur(20px);
}

.test {
    cursor: pointer;
}

.test:hover {
    background: rgba(0, 0, 0, 0.2);
}
</style>
