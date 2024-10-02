import { useCookies } from '@vueuse/integrations/useCookies'

export function useTabList() {
    const route = useRoute()
    const router = useRouter()
    const cookies = useCookies()
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: 'Home',
            path: '/',
        }
    ])

    function addTab(tab) {
        let noTag = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTag) {
            tabList.value.push(tab)
        }
        cookies.set("tabList", tabList.value)
    }

    function initTabList() {
        let tabs = cookies.get("tabList")
        if (tabs) {
            tabList.value = tabs
        }
    }

    initTabList()

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const changeTag = (t) => {
        activeTab.value = t
        router.push(t)
    }

    const removeTab = (t) => {
        let tabs = tabList.value
        let a = activeTab.value
        if (a == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })
        }
        activeTab.value = a
        tabList.value = tabList.value.filter(tab => tab.path != t)
        cookies.set("tabList", tabList.value)
    }

    const handleClose = (c) => {
        if (c == "ClearAll") {
            activeTab.value = "/"
            tabList.value = [{
                title: 'Home',
                path: '/',
            }]
        } else if (c == "ClearOthers") {
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
        }
        cookies.set("tabList", tabList.value)
    }

    return {
        activeTab,
        tabList,
        changeTag,
        removeTab,
        handleClose
    }
}