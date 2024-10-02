import dayjs from 'dayjs'

const store = createStore({
    state() {
        return {
            loading: false,
            hasGetInfo: false,
            user: {},
            asideWidth: "220px",
            menus: [],
            ruleNames: [],
            releaseOptions: [],
            bugs: {},
            tasks: [],
            machines: [],
            commonConfig: {}
        }
    },
    mutations: {
        SET_USERINFO(state, user) {
            state.user = user
        },
        handleAsideWidth(state) {
            state.asideWidth = state.asideWidth == "220px" ? "64px" : "220px"
        },
        SET_MENUS(state, menus) {
            state.menus = menus
        },
        SET_RULENAME(state, ruleNames) {
            state.ruleNames = ruleNames
        },
        SET_RELEASEOPTIONS(state, releaseOptions) {
            state.releaseOptions = releaseOptions
        },
        SET_BUGS(state, bugs) {
            function format(obj) {
                const order = ['Rejected', 'Open', 'Working', 'Fixed', 'Verify', 'Limitation', 'Closed']
                let diff = order.filter(res => obj.map(res => res.name).indexOf(res) === -1)
                if (diff) {
                    for (let index = 0; index < diff.length; index++) {
                        const element = diff[index];
                        obj.push({ name: element, value: 0 })
                    }
                }
                obj.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
            }
            format(bugs.classified.auto)
            format(bugs.classified.manual)
            state.bugs = bugs
        },
        SET_TASKS(state, tasks) {
            state.tasks = tasks
        },
        SET_MACHINES(state, machines) {
            machines.forEach(res => {
                res.config.Config_message = JSON.parse(res.config.Config_message)
            })
            state.machines = machines.sort((a, b) => {
                return dayjs(b.createtime).unix() - dayjs(a.createtime).unix()
            })
        },
        SET_COMMON_CONFIG(state, commonConfig) {
            var obj = {}
            for (let index = 0; index < commonConfig.length; index++) {
                const element = commonConfig[index];
                obj[element.CommonConfigName] = element.CommonConfig_message
            }
            state.commonConfig = obj
        }
    },
    actions: {
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken("JWT " + res.token)
                    resolve(res)
                    // store.dispatch("getInfo")
                }).catch(err => reject(err))
            })
        },
        getInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    res.menus = [
                        {
                            "name": "Home",
                            "frontpath": "/",
                            "icon": "home-filled",
                            "child": []
                        },
                        {
                            "name": "Test Items",
                            "frontpath": null,
                            "icon": "Menu",
                            "child": [
                                {
                                    "name": "MRT",
                                    "frontpath": "/panel/mrt",
                                    "icon": "Watermelon",
                                    "child": []
                                },
                                {
                                    "name": "XPIT",
                                    "frontpath": "/panel/xpit",
                                    "icon": "help",
                                    "child": []
                                },
                                {
                                    "name": "DAILY",
                                    "frontpath": "/panel/daily",
                                    "icon": "ShoppingBag",
                                    "child": []
                                },
                                {
                                    "name": "MEMSTRESS",
                                    "frontpath": "/panel/memstress",
                                    "icon": "PieChart",
                                    "child": []
                                },
                                {
                                    "name": "PERFORMANCE",
                                    "frontpath": "/panel/performance",
                                    "icon": "TrophyBase",
                                    "child": []
                                }
                            ]
                        },
                        {
                            "name": "Bug Statistic",
                            "frontpath": "null",
                            "icon": "Histogram",
                            "child": [
                                {
                                    "name": "Summary",
                                    "frontpath": "/statistic/diagram",
                                    "icon": "Notification",
                                    "child": []
                                },
                                {
                                    "name": "Project Data",
                                    "frontpath": "/statistic/list",
                                    "icon": "ChatLineSquare",
                                    "child": []
                                }
                            ]
                        },
                        {
                            "name": "Testlink Tool",
                            "frontpath": "/testlinktool",
                            "icon": "Tools",
                            "child": []
                        },
                        {
                            "name": "Machine Info",
                            "frontpath": "/machine",
                            "icon": "VideoCameraFilled",
                            "child": []
                        },
                        {
                            "name": "Performance Analysis",
                            "frontpath": "/performance",
                            "icon": "TrendCharts",
                            "child": []
                        },
                        {
                            "name": "Common Config",
                            "frontpath": "/config",
                            "icon": "List",
                            "child": []
                        }
                    ]
                    commit("SET_USERINFO", res)
                    commit("SET_MENUS", res.menus)
                    commit("SET_RULENAME", res.ruleNames)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        logout({ commit }) {
            removeToken()
            commit("SET_USERINFO", {})
        },
        getJobs({ commit }, project) {
            return new Promise((resolve, reject) => {
                getJobs(project).then(res => {
                    commit('SET_RELEASEOPTIONS', res.releaseOptions)
                    resolve(res.releaseOptions[0].id)
                }).catch(err => reject(err))
            })
        },
        getBugs({ commit }) {
            return new Promise((resolve, reject) => {
                getClassifiedBug().then(res => {
                    commit('SET_BUGS', res)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        getTasks({ commit }, source) {
            return new Promise((resolve, reject) => {
                getTasks(source).then(res => {
                    commit('SET_TASKS', res)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        getMachines({ commit }) {
            return new Promise((resolve, reject) => {
                getMachines().then(res => {
                    commit('SET_MACHINES', res.machine)
                    resolve(res.machine)
                }).catch(err => reject(err))
            })
        },
        getCommonConfig({ commit }) {
            return new Promise((resolve, reject) => {
                getCommonConfig().then(res => {
                    res.allconfig.forEach(res => {
                        res.CommonConfig_message = JSON.parse(res.CommonConfig_message)
                    })
                    commit('SET_COMMON_CONFIG', res.allconfig)
                    resolve(res.allconfig)
                }).catch(err => reject(err))
            })
        }
    }
})

export default store
