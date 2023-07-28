const QuestionsModule = () => import('./QuestionsModule')
const Questions = () => import('./pages/DevQuestions')
import store from '@/store'

const questionsRoutes = [
  {
    path: '/questions',
    name: 'QuestionsModule',
    component: QuestionsModule,
    meta: { requiresAuth: true, hideFooter: true },
    beforeEnter: (to, from, next) => {
      const user = store.getters['app/user']
      if (to.name !== 'CreateProfile' && !user.createdProfile) {
        next({ name: 'CreateProfile' })
      } else {
        next()
      }
    },
    children: [
      {
        path: ':tool',
        name: 'Questions',
        component: Questions,
        meta: {
          title: 'Questions'
        }
      }
    ]
  }
]

export default questionsRoutes
