import { boot } from 'quasar/wrappers'
import firebaseServices from 'src/services/firebase/'
import { useAuthStore } from 'stores/auth-store'
import { onAuthStateChanged } from 'firebase/auth'

export default boot(async ({ app }) => {
  const auth = firebaseServices.auth()
  const authStore = useAuthStore()
  // remove previous listener if any
  if (typeof authStore.authStateUnsubscribe === 'function') {
    authStore.authStateUnsubscribe()
  }
  authStore.authStateUnsubscribe = onAuthStateChanged(auth, (user) => {
    firebaseServices.handleOnAuthStateChanged(user)
  })
  app.config.globalProperties.$fb = firebaseServices
})
