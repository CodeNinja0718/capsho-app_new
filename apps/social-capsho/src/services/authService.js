import {
  getAuth,
  updateProfile
} from 'firebase/auth'
import store from '@/store'
import { getUserByDocId } from './dbService'
import { useNotification } from '@/composables/useNotification'

export async function getUserInfo() {
  const auth = getAuth()
  const authUser = auth.currentUser
  if (authUser) {
    const user = await getUserByDocId(authUser.uid)
    if (user) {
      const obj = {
        stripe_id: user.stripe_id,
        subscription: user.subscription,
        toneOfVoice: user.tone_of_voice,
        type: user.type,
        template: user.template,
        businessName: user.business_name,
        created_profile: user.created_profile
      }
      store.commit('app/setUpdateUser', obj)
    }
  }
}

export async function updateUserInfo({ newName, newPhoto }) {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    const { alertDanger } = useNotification()
    try {
      if (newName === null) {
        newName = user.displayName
      }
      if (newPhoto === null) {
        newPhoto = user.photoURL
      }
      await updateProfile(user, {
        displayName: newName,
        photoURL: newPhoto
      })
      await store.dispatch('app/fetchUser', user)
    } catch (e) {
      alertDanger(e.message)
    }
  }
}




