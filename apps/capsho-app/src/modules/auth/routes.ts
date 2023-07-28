import { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'AuthModule',
    component: () => import(/* webpackChunkName: "auth-module" */ './AuthModule.vue'),
    meta: {
      hideMainLayout: true,
      hideHeader: true,
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'AuthIndex',
        component: () => import(/* webpackChunkName: "AuthPage" */ './pages/AuthPage.vue'),
        children: [
          {
            path: '',
            name: 'AuthPage',
            redirect: { name: 'AuthSignIn' }
          },
          {
            path: 'sign-in',
            name: 'AuthSignIn',
            component: () => import(/* webpackChunkName: "AuthSignIn" */ 'src/modules/auth/components/desktop/TestDesktopSignInCard.vue'),
            meta: {
              guestOnly: true
            }
          },
          {
            path: 'sign-up',
            name: 'AuthSignUp',
            component: () => import(/* webpackChunkName: "AuthSignUp" */ 'src/modules/auth/components/desktop/TestDesktopSignUpEmailPasswordCard.vue'),
            meta: {
              guestOnly: true
            }
          }
        ]
      },
      {
        path: 'verify-email',
        name: 'AuthEmailVerify',
        component: () => import(/* webpackChunkName: "VerifyEmail" */ './pages/VerifyEmail.vue'),
        meta: {
          guestOnly: true
        }
      },
      {
        path: 'user-details',
        name: 'AuthSignUpUserDetails',
        component: () => import(/* webpackChunkName: "AuthSignUpUserDetails" */ './pages/OnBoardingUserDetails.vue')
      },
      {
        path: 'reset-password',
        name: 'AuthResetPassword',
        component: () => import(/* webpackChunkName: "AuthResetPassword" */ './pages/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/auth/:afterUser(.*)',
    redirect: { name: 'AuthSignIn' }
  }
]

export default authRoutes
