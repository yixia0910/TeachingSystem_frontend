import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
const router = new Router({
  routes: [
    /* security view */
    {
      path: '/',
      redirect: '/security/login'
    },
    {
      path: '/security/login',
      name: 'login',
      component: () => import('../views/security/login.vue')
    },
    // {
    //   path: '/security/index',
    //   name: 'index',
    //   component: () => import('../views/security/index')
    // },
    {
      path: '/security/findPwd',
      name: 'findPwd',
      component: () => import('../views/security/findPwd.vue')
    },
    {
      path: '/security/activateAccount',
      name: 'activateAccount',
      component: () => import('../views/security/activateAccount.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/help/Help')
    },
    /* student view */
    {
      path: '/student/table',
      name: 'table',
      component: () => import('../views/student/testTable.vue')
    },
    {
      path: '/student/experiments',
      name: 'expInfo',
      component: () => import('../views/student/expInfo.vue')
    },
    {
      path: '/course/experiments',
      name: 'courseExp',
      component: () => import('../views/student/courseExp.vue')
    },
    {
      path: '/student/expVM',
      name: 'expVM',
      component: () => import('../views/student/expVM.vue')
    },
    {
      path: '/student/vmManagement',
      name: 'stuVMManagement',
      component: () => import('../views/student/vmManagement.vue')
    },
    {
      path: '/all/skydrive',
      name: 'skydrive',
      component: () => import('../views/netdisk/index.vue')
    },
    {
      path: '/assistant/courseManagement',
      name: 'astCourseManagement',
      component: () => import('../views/assistant/courseManagement.vue')
    },
    {
      path: '/assistant/courseDetails',
      name: 'astCourseDetails',
      component: () => import('../views/assistant/courseDetails.vue')
    },
    // {
    //   path: '/assistant/expDetails',
    //   name: 'astExpDetails',
    //   component: () => import('../views/assistant/expDetails.vue')
    // },
    {
      path: '/assistant/homework',
      name: 'astHomework',
      component: () => import('../views/assistant/checkHomework.vue')
    },
    {
      path: '/assistant/experimentVM',
      name: 'astExpVM',
      component: () => import('../views/assistant/experimentVM.vue')
    },
    {
      path: '/assistant/peerDetails',
      name: 'astPeerDetails',
      component: () => import('../views/assistant/peerDetails.vue')
    },
    {
      path: '/experiment/details',
      name: 'expDetails',
      component: () => import('../views/student/expDetails.vue')
    },
    {
      path: '/experiment/peer',
      name: 'expPeer',
      component: () => import('../views/student/expPeer.vue')
    },
    {
      path: '/student/info',
      name: 'stuInfo',
      component: () => import('../views/student/stuInfo.vue')
    },
    {
      path: '/student/applicationInfo',
      name: 'stuApplicationInfo',
      component: () => import('../views/student/applicationInfo.vue')
    },
    {
      path: '/peer/details',
      name: 'peerDetails',
      component: () => import('../views/student/peerDetails')
    },
    /* teacher view */
    {
      path: '/teacher/course',
      name: 'course',
      component: () => import('../views/teacher/courseManagement.vue')
    },
    {
      path: '/teacher/courseDetail',
      name: 'courseDetail',
      component: () => import('../views/teacher/courseDetail.vue')
    },
    {
      path: '/teacher/expDetail',
      name: 'expDetail',
      component: () => import('../views/teacher/expDetails.vue')
    },
    {
      path: '/teacher/stuDetail',
      name: 'expDetail',
      component: () => import('../views/teacher/stuDetails.vue')
    },
    {
      path: '/teacher/homework',
      name: 'homework',
      component: () => import('../views/teacher/checkHomework.vue')
    },
    {
      path: '/teacher/vm',
      name: 'vm',
      component: () => import('../views/teacher/vmManagement.vue')
    },
    {
      path: '/teacher/snapshot',
      name: 'snapshot',
      component: () => import('../views/teacher/snapshotManagement.vue')
    },
    {
      path: '/teacher/experimentalVM',
      name: 'experimentalVM',
      component: () => import('../views/teacher/experimentalVMManagement.vue')
    },
    {
      path: '/teacher/template',
      name: 'template',
      component: () => import('../views/teacher/templateManagement.vue')
    },
    {
      path: '/teacher/application',
      name: 'application',
      component: () => import('../views/teacher/applicationManagement.vue')
    },
    {
      path: '/teacher/assistant',
      name: 'assistant',
      component: () => import('../views/teacher/assistantManagement.vue')
    },
    {
      path: '/teacher/userGuide',
      name: 'userGuide',
      component: () => import('../views/teacher/userGuide.vue')
    },
    {
      path: '/teacher/info',
      name: 'teacherInfo',
      component: () => import('../views/teacher/teacherInfo.vue')
    },
    {
      path: '/teacher/applicationInfo',
      name: 'teacherApplicationInfo',
      component: () => import('../views/teacher/teacherApplicationInfo.vue')
    },
    {
      path: '/teacher/peerDetail',
      name: 'peerDetail',
      component: () => import('../views/teacher/peerDetail.vue')
    },
    {
      path: '/teacher/preview',
      name: 'previewFile',
      component: () => import('../views/teacher/previewFile.vue')
    },
    {
      path: '/teacher/score',
      name: 'score',
      component: () => import('../views/teacher/score.vue')
    },
    {
      path: '/teacher/scoreList',
      name: 'scoreList',
      component: () => import('../views/teacher/scoreList.vue')
    },
    /* admin view */
    {
      path: '/admin/member',
      name: 'memberManagement',
      component: () => import('../views/admin/memberManagement')
    },
    {
      path: '/admin/student',
      name: 'stuManagement',
      component: () => import('../views/admin/stuManagement')
    },
    {
      path: '/admin/info',
      name: 'adminInfo',
      component: () => import('../views/admin/adminInfo')
    },
    {
      path: '/admin/semester',
      name: 'semManagement',
      component: () => import('../views/admin/semManagement')
    },
    {
      path: '/admin/data',
      name: 'dataManagement',
      component: () => import('../views/admin/dataManagement')
    },
    {
      path: '/admin/teacher',
      name: 'teacherManagement',
      component: () => import('../views/admin/teacherManagement')
    },
    {
      path: '/admin/admin',
      name: 'adminManagement',
      component: () => import('../views/admin/adminManagement')
    },
    {
      path: '/admin/template',
      name: 'templateManagement',
      component: () => import('../views/admin/templateManagement')
    },
    {
      path: '/machine/admin',
      name: 'machineManagement',
      component: () => import('../views/admin/machineManagement')
    },
    {
      path: '/application/records',
      name: 'applicationRecords',
      component: () => import('../views/admin/applicationRecords')
    },
    {
      path: '/operation/log',
      name: 'operationLog',
      component: () => import('../views/admin/operationLog')
    },
    {
      path: '/admin/vm',
      name: 'vmManagement',
      component: () => import('../views/admin/vmManagement')
    },
    {
      path: '/vm/analysis',
      name: 'vmAnalysis',
      component: () => import('../views/admin/vmAnalysis')
    },
    {
      path: '/admin/experiment',
      name: 'expManagement',
      component: () => import('../views/admin/expManagement')
    },
    // netdisk
    {
      path: '/netdisk/file',
      name: 'netdiskFile',
      component: () => import('../views/netdisk/file')
    },
    {
      path: '/netdisk/share',
      name: 'netdiskShare',
      component: () => import('../views/netdisk/share')
    }
  ]
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/security/login' || to.path === '/help' || to.path === '/security/findPwd') {
    next()
  } else {
    let Authorization = localStorage.getItem('Authorization')
    if (Authorization === 'null' || Authorization === '') {
      next('/security/login')
    } else {
      next()
    }
  }
})

export default router
