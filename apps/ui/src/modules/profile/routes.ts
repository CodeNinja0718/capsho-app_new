import { RouteRecordRaw } from 'vue-router'

const podcastRoutes: RouteRecordRaw[] = [
  {
    path: '/profile/',
    name: 'ProfileModule',
    component: () => import(/* webpackChunkName: "ProfileModule" */ './ProfileModule.vue'),
    meta: {
      requiresAuth: true,
      showBanner: true
    },
    children: [
      {
        path: '',
        name: 'ProfileDetails',
        component: () => import(/* webpackChunkName: "ProfileDetails" */ './pages/ProfileDetails.vue')
      },
      {
        path: '',
        name: 'ProfileBilling',
        component: () => import(/* webpackChunkName: "ProfileBilling" */ './pages/ProfileBilling.vue')
      },
      {
        path: 'cancel',
        name: 'CancelSubscription',
        component: () => import(/* webpackChunkName: "CancelSubscription" */ './pages/ProfileCancelPlan.vue')
      }
    ]
  }
]

export default podcastRoutes
