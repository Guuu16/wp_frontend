import { createRouter, createWebHashHistory } from "vue-router";
import DataBoard from '~/layouts/DataBoard.vue'
import Login from '~/layouts/Login.vue'
import NotFound from '~/layouts/NotFound.vue'
import Admin from '~/layouts/Admin.vue'
import Introduction from '~/layouts/Introduction.vue'

import Index from '~/pages/home/Index.vue'

import TestlinkTook from '~/layouts/TestlinkTook.vue'
import TestlinkTookIndex from '~/pages/testlinkTool/TestlinkToolIndex.vue'

import bugStatisticSummary from '~/layouts/BugStatisticSummary.vue'
import bugStatisticSummaryIndex from '~/pages/bugStatisticSummary/BugStatisticSummaryIndex.vue'
import IndiividualDetail from '~/pages/bugStatisticSummary/IndiividualDetail.vue'
import BugStatisticList from '~/layouts/BugStatisticList.vue'
import BugStatisticListIndex from '~/pages/bugStatisticList/BugStatisticListIndex.vue'
import ProjectDetail from '~/pages/bugStatisticList/ProjectDetail.vue'

import PanelPit from '~/layouts/PanelPit.vue'
import PanelPitSummary from '~/pages/panel/PanelPitSummary.vue'
import PanelXpit from '~/layouts/PanelXpit.vue'
import PanelXpitSummary from '~/pages/panel/PanelXpitSummary.vue'
import PanelDaily from '~/layouts/PanelDaily.vue'
import PanelDailySummary from '~/pages/panel/PanelDailySummary.vue'
import PanelMemstress from '~/layouts/PanelMemstress.vue'
import PanelMemstressSummary from '~/pages/panel/PanelMemstressSummary.vue'
import PanelPerformance from '~/layouts/PanelPerformance.vue'
import PanelPerformanceSummary from '~/pages/panel/PanelPerformanceSummary.vue'
import TaskHistoryDetail from "~/pages/panel/TaskHistoryDetail.vue";
import TaskHistoryDetailMem from "~/pages/panel/TaskHistoryDetailMem.vue";

import PerformanceAnalysis from '~/pages/performanceAnalysis/PerformanceAnalysis.vue'

import CommonConfig from '~/pages/commonConfig/CommonConfig.vue'

import MachineInfo from '~/layouts/MachineInfo.vue'
import MachineSummary from "~/pages/machineInfo/MachineSummary.vue";
import MachineDetail from "~/pages/machineInfo/MachineDetail.vue";

const routes = [
    {
        path: '/',
        name: "Admin",
        component: Admin,
        children: [
            {
                path: '/Introduction',
                name: 'Introduction',
                component: Introduction
            }
        ]
    },
    {
        path: '/Login',
        name: '/Login',
        component: Login
    },
    {
        path: '/DataBoard',
        name: '/DataBoard',
        component: DataBoard
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: Index,
        meta: {
            title: "Home"
        }
    },
    {
        path: '/testlinktool',
        component: TestlinkTook,
        children: [
            {
                path: '',
                component: TestlinkTookIndex
            }
        ],
        meta: {
            title: "Machine Info"
        }
    },
    {
        path: '/machine',
        component: MachineInfo,
        children: [
            {
                path: '',
                component: MachineSummary
            },
            {
                path: 'detail',
                component: MachineDetail
            },
        ],
        meta: {
            title: "Machine Info"
        }
    },
    {
        path: '/statistic/diagram',
        component: bugStatisticSummary,
        meta: {
            title: "Bug Diagram"
        },
        children: [
            {
                path: '',
                component: bugStatisticSummaryIndex
            },
            {
                path: 'individual/detail',
                component: IndiividualDetail
            },
        ],
    },
    {
        path: '/statistic/list',
        component: BugStatisticList,
        meta: {
            title: "Bug List"
        },
        children: [
            {
                path: '',
                component: BugStatisticListIndex
            },
            {
                path: 'detail',
                component: ProjectDetail
            },
        ],
    },

    {
        path: '/panel/mrt',
        component: PanelPit,
        children: [
            {
                path: '',
                component: PanelPitSummary
            },
            {
                path: 'detail',
                component: TaskHistoryDetail
            },
        ],
        meta: {
            title: "MRT"
        }
    },
    {
        path: '/panel/xpit',
        component: PanelXpit,
        children: [
            {
                path: '',
                component: PanelXpitSummary
            },
            {
                path: 'detail',
                component: TaskHistoryDetail
            },
        ],
        meta: {
            title: "XPIT"
        }
    },
    {
        path: '/panel/daily',
        component: PanelDaily,
        children: [
            {
                path: '',
                component: PanelDailySummary
            },
            {
                path: 'detail',
                component: TaskHistoryDetail
            },
        ],
        meta: {
            title: "DAILY"
        }
    },
    {
        path: '/panel/memstress',
        component: PanelMemstress,
        children: [
            {
                path: '',
                component: PanelMemstressSummary
            },
            {
                path: 'detail',
                component: TaskHistoryDetailMem
            },
        ],
        meta: {
            title: "MEMSTRESS"
        }
    },
    {
        path: '/panel/performance',
        component: PanelPerformance,
        children: [
            {
                path: '',
                component: PanelPerformanceSummary
            },
            {
                path: 'detail',
                component: TaskHistoryDetail
            },
        ],
        meta: {
            title: "PERFORMANCE"
        }
    },
    {
        path: '/performance',
        name: '/performance',
        component: PerformanceAnalysis,
        meta: {
            title: "Performance Analysis"
        }
    },
    {
        path: '/config',
        name: '/config',
        component: CommonConfig,
        meta: {
            title: "Common Config"
        }
    },
]

export const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
    scrollBehavior(to, from, savedPosition) {
        document.getElementById('main').scrollTop = 0
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                el: document.getElementById('main'),
                top: 0,
                left: 0
            }
        }
    },
})

export function addRoutes(menus) {
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("Admin", item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndAddRoutesByMenus(e.child)
            }
        });
    }
    findAndAddRoutesByMenus(menus)
    return hasNewRoutes
}
