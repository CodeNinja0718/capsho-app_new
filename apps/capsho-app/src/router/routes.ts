import { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'
// import MaintenancePage from 'src/pages/MaintenancePage.vue'
import Home from 'pages/IndexPage.vue'
import authRoutes from 'src/modules/auth/routes'
import podcastRoutes from 'src/modules/podcast/routes'
import profileRoutes from 'src/modules/profile/routes'
import paymentRoutes from 'src/modules/payment/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: '/about',
        name: 'AboutPage',
        component: () => import('pages/AboutPage.vue')
      },
      {
        path: '/contact',
        name: 'ContactPage',
        component: () => import('pages/ContactPage.vue')
      },
      {
        path: '/pricing',
        name: 'PricingPage',
        component: () => import('pages/PricingPage.vue')
      },
      {
        path: '/help',
        name: 'HelpPage',
        component: () => import('pages/HelpPage.vue')
      },
      ...authRoutes,
      ...podcastRoutes,
      ...profileRoutes,
      ...paymentRoutes
    ]
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('pages/AppTerms.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
