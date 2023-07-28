import { computed, readonly, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from 'stores/auth-store'

/**
 *  Firebase auth composable with an observer
 *
 * @returns {{resetPassword: function, isAuthenticated: ComputedRef<boolean>, authUser: ref, logOut: logOut}}
 */
const auth = getAuth()
export function useAuth () {
  const store = useAuthStore()
  const authUser = ref(auth.currentUser)
  const isAuthenticated = computed(() => !!authUser.value)

  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      authUser.value = user
      store.user = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        id: user.uid
      }
    }
  })

  return {
    isAuthenticated,
    authUser: readonly(authUser)
  }
}
