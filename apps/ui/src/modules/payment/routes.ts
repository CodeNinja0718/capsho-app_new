import { RouteRecordRaw } from 'vue-router'

const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment/',
    name: 'PaymentModule',
    component: () => import(/* webpackChunkName: "PaymentModule" */ './PaymentModule.vue'),
    meta: {
      hideMainLayout: true,
      showBanner: true
    },
    children: [
      {
        path: '',
        name: 'PickAPlan',
        component: () => import(/* webpackChunkName: "PickAPlan" */ './pages/PickPlanPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'pick-a-plan',
        name: 'PickAPlanProOffer',
        component: () => import(/* webpackChunkName: "PickAPlanProOffer" */ './pages/PickPlanPageProOffer.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'collective',
        name: 'CollectiveLanding',
        component: () => import(/* webpackChunkName: "Collective" */ './pages/CollectivePlan.vue')
      },
      {
        path: 'checkout-collective',
        name: 'CheckoutCollective',
        component: () => import(/* webpackChunkName: "CheckoutCollective" */ './pages/CheckoutCollective.vue'),
        meta: {
          requiresAuth: false
        }
      }
    ]
  }
]

export default paymentRoutes
