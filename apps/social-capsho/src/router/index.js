import { createRouter, createWebHistory } from 'vue-router'
import { publicPath } from '../../vue.config'
import routes from './routes'
import { useAuth } from '@/composables/useAuth'
import { trackRouter } from 'vue-gtag-next'

const Router = createRouter({
  history: createWebHistory(publicPath),
  routes
})

Router.beforeEach((to, from, next) => {
  // update title dynamically
  document.title = `Capsho - ${to.meta.title}`

  const { isAuthenticated } = useAuth()

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({
      name: 'SignIn',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

trackRouter(Router)

export default Router
