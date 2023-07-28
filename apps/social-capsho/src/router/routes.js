import MainLayout from '@/layouts/MainLayout.vue'
import Home from '@/pages/Home.vue'
import authRoutes from '../modules/auth/routes'
import dashboardRoutes from '../modules/dashboard/routes'
import profileRoutes from '../modules/profile/routes'
import questionsRoutes from '../modules/questions/routes'
import podcastRoutes from '../modules/podcast/routes'
const Pricing = () => import('@/pages/Pricing.vue')
const ContactUs = () => import('@/pages/ContactUs.vue')
const TermsAndConditions = () => import('@/pages/TermsAndConditions.vue')
const PrivacyPolicy = () => import('@/pages/PrivacyPolicy.vue')
const NotFoundPage = () => import( '@/components/404.vue')

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Home'
        }
      },
      {
        path: 'contact',
        name: 'ContactUs',
        component: ContactUs,
        meta: {
          title: 'Contact Us'
        }
      },
      {
        path: 'terms-and-conditions',
        name: 'TermsAndConditions',
        component: TermsAndConditions,
        meta: {
          title: 'Terms & Conditions'
        }
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
        meta: {
          title: 'Privacy Policy'
        }
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: Pricing,
        meta: {
          title: 'Pricing'
        }
      },
      ...authRoutes,
      ...dashboardRoutes,
      ...profileRoutes,
      ...questionsRoutes,
      ...podcastRoutes
    ]
  },
  {
    path: '/:pathMatch(.*)',
    component: NotFoundPage
  }
]

export default routes
