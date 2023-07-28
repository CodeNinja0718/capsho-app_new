import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized
} from 'vue-router'
import routes from './routes'
import { ensureAuthIsInitialized } from 'src/services/firebase/base'
import { useAuthStore } from 'stores/auth-store'
import { Notify } from 'quasar'
import { logtail } from 'boot/logtail'
import { computed } from 'vue'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
  Router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    try {
      const store = useAuthStore()
      await ensureAuthIsInitialized(store)
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      const guestOnly = to.matched.some(record => record.meta.guestOnly)
      const currentUser = computed(() => store.user.isLoggedIn)
      if (requiresAuth) {
        if (currentUser.value) {
          next()
        } else {
          next({ name: 'AuthPage' })
        }
      } else if (guestOnly) {
        if (currentUser.value) {
          if (store.userType === 'host') {
            next({ name: 'UploadPodcast' })
          } else {
            next({ name: 'DefaultPodcastGuest' })
          }
        } else {
          next()
        }
      } else {
        next()
      }
    } catch (err) {
      if (err instanceof Error) {
        Notify.create({
          message: `${err.message}`,
          type: 'negative'
        })
      }
    }
  })
  Router.onError(error => {
    logtail?.error('Router - index.ts', {
      error: {
        ...error
      },
      message: error.message
    })
    if (/ChunkLoadError:.*failed./i.test(error.message)) {
      logtail?.info('Reloading Window 1')
      window.location.reload()
    } else if (/Loading.*chunk.*failed./i.test(error.message)) {
      logtail?.info('Reloading Window 2')
      window.location.reload()
    }
  })

  return Router
})
