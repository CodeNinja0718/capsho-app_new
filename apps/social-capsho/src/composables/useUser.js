import { computed, watch, ref } from 'vue'
import store from '@/store'
import { updateUserProfile } from '@/services/dbService'
import { getAuth } from 'firebase/auth'
import { getUserInfo } from '@/services/authService'

export function useUser() {
  const auth = getAuth()
  const authUser = ref(auth.currentUser)
  const user = computed(() => store.getters['app/user'])
  const isSubscribed = computed(() => !!(user.value.subscription === 'platinum' || user.value.subscription === 'diamond'))
  const isFirstLogin = computed(() => !!user.value.firstLogin)
  const userData = computed(() => user.value.data)
  const userPhotoUrl = computed(() => userData.value.photoURL)
  const updateBusinessName = (value) => store.commit('app/updateUserBusinessName', value)
  const updateToneIfVoice = (value) => store.commit('app/updateUserToneOfVoice', value)
  const updateUserName = (value) => store.commit('app/changeUserName', value)
  const updateUser = async () => {
    updateUserProfile(user.value)
    await getUserInfo()
  }

  watch(authUser, async (newAuthUser) => {
    if (newAuthUser !== null) {
      await getUserInfo()
    }
  })
  return {
    user,
    isSubscribed,
    isFirstLogin,
    updateBusinessName,
    updateToneIfVoice,
    updateUserName,
    updateUser,
    userData,
    userPhotoUrl
  }
}
