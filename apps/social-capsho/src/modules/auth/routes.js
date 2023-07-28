const AuthModule = () => import('./AuthModule.vue')
const SignIn = () => import('./pages/SignIn.vue')
const PostSignIn = () => import('./pages/PostSignIn.vue')
const Register = () => import('./pages/Register.vue')
const ForgotPassword = () => import('./pages/ForgotPassword.vue')
const VerifyEmail = () => import('./components/VerifyEmail.vue')
import store from '@/store'

const authRoutes = [
  {
    path: '/account',
    name: 'AuthModule',
    component: AuthModule,
    meta: {
      hideNavBar: true,
      hideFooter: true
    },
    beforeEnter: (to, from, next) => {
      const user = store.getters['app/user']
      if (!user.loggedIn) {
        next()
      } else {
        next({ name: 'Dashboard' })
      }
    },
    children: [
      {
        path: '/sign-in',
        name: 'SignIn',
        component: SignIn,
        meta: {
          title: 'SignIn'
        }
      },
      {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
          title: 'Register'
        }
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {
          title: 'Forgot Password'
        }
      },
      {
        path: '/verify-email',
        name: 'VerifyEmail',
        component: VerifyEmail,
        meta: {
          title: 'Verify Email'
        }
      }
    ]
  },
  {
    path: '/post-sign-in',
    name: 'PostSignIn',
    component: PostSignIn,
    meta: {
      hideNavBar: true,
      hideFooter: true,
      title: 'SignOut'
    }
  }
]

export default authRoutes
