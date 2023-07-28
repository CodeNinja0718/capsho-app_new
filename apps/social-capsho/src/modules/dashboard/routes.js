const DashboardModule = () => import('./DashboardModule')
const Dashboard = () => import('./pages/DevDashboard')
const HoneyTrapTools = () => import('./components/HoneyTrapTools')
const GetTheRightHoneyTrap = () => import('./components/GetTheRightHoneyTrap')
import store from '@/store'

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'DashboardModule',
    component: DashboardModule,
    meta: { requiresAuth: true, requiresProfile: true, hideFooter: true },
    beforeEnter: (to, from, next) => {
      const user = store.getters['app/user']
      if (!user.createdProfile) {
        next({ name: 'CreateProfile' })
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: '/get-the-right-honey-trap',
        name: 'GetTheRightHoneyTrap',
        component: GetTheRightHoneyTrap,
        meta: {
          title: 'Get The Right Honey Trap',
          hideFooter: true
        }
      },
      {
        path: '/honey-trap-tools',
        name: 'HoneyTrapTools',
        component: HoneyTrapTools,
        meta: {
          title: 'Honey Trap Tools',
          hideFooter: true
        }
      }
    ]
  }
]

export default dashboardRoutes
