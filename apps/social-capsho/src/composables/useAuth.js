import { computed, ref, readonly } from 'vue'
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import store from '@/store'
import router from '@/router'
import { getUserInfo } from '@/services/authService'
import { logOut } from '@/modules/auth/services/authService'
import { useNotification } from './useNotification'

/**
 *  Firebase auth composable with an observer
 *
 * @returns {{resetPassword: function, isAuthenticated: ComputedRef<boolean>, authUser: ref, logOut: logOut}}
 */
const auth = getAuth()
export function useAuth() {
  const authUser = ref(auth.currentUser)
  const isAuthenticated = computed(() => !!authUser.value)
  const { alertDanger, alertSuccess } = useNotification()

  const resetPassword = () => {
    sendPasswordResetEmail(auth, authUser.value.email)
      .then(() => {
        alertSuccess('Reset password link was sent to your email!')
        if (authUser.value) {
          logOut()
        } else {
          router.push({ name: 'SignIn' })
        }
      }).catch((err) => {
      alertDanger(err)
    })
  }

  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      authUser.value = user
      getUserInfo()
        .then(() => {
          store.commit('app/logIn', true)
          store.commit('app/setUserData', {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            id: user.uid
          })
      })
    } else {
      store.commit('app/setUserData', null)
    }
  })

  return {
    isAuthenticated,
    authUser: readonly(authUser),
    logOut,
    resetPassword
  }
}
