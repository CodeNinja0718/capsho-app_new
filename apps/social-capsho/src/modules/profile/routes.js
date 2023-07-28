const ProfileModule = () => import('./ProfileModule.vue')
const EditProfile = () => import('./pages/EditProfile.vue')
const CreateProfile = () => import('./pages/CreateProfile.vue')
import store from '@/store'

const profileRoutes = [
  {
    path: '/',
    name: 'ProfileModule',
    component: ProfileModule,
    meta: { requiresAuth: true, hideFooter: true },
    children: [
      {
        path: '/profile',
        name: 'Profile',
        component: EditProfile,
        meta: { requiresProfile: true, title: 'Edit Profile' },
        beforeEnter: (to, from, next) => {
          const user = store.getters['app/user']
          if (!user.createdProfile) {
            alert('You don\'t have a profile yet. Please create one!')
            next({ name: 'CreateProfile' })
          } else {
            next()
          }
        }
      },
      {
        path: '/create-profile',
        name: 'CreateProfile',
        component: CreateProfile,
        meta: {
          title: 'Create Profile'
        },
        beforeEnter: (to, from, next) => {
          const user = store.getters['app/user']
          if (user.createdProfile) {
            next({ name: 'Dashboard' })
          } else {
            next()
          }
        },
      }
    ]
  },
]

export default profileRoutes
