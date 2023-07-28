/**
 * composable for managing profile creation
 */
import store from '@/store'
import { computed } from 'vue'
import { updateUserInfo } from '@/services/authService'
import { addUserToCollection } from '@/services/dbService'


export function useCreateProfile() {

  const newUserProfile = computed(() => store.state.profile.newUserProfile)

  const saveProfile = async () => {
    let selectedThemeIDs = []
    const selectedThemes = computed(() => store.state.profile.selectedThemes)

    selectedThemes.value.forEach((theme) => {
      selectedThemeIDs.push(theme.id)
    })

    const { name, business, expectation } = newUserProfile.value
    const type = computed(() => store.state.profile.newUserProfile.type)
    const tone = computed(() => store.state.profile.newUserProfile.tone)

    await updateUserInfo({
      newName: name
    })
    await addUserToCollection({
      tone: tone.value,
      type: type.value,
      business,
      holidays: [],
      themes: selectedThemeIDs,
      expectation
    })
  }

  const profileCreatorsName = computed({
    get() {
      return newUserProfile.value.name
    },
    set(value) {
      store.commit('profile/setProfileCreatorsName', value)
    }
  })

  const profileBusinessName = computed({
    get() {
      return newUserProfile.value.business
    },
    set(value) {
      store.commit('profile/setProfileBusinessName', value)
    }
  })

  const profileCreatorsExpectation = computed({
    get() {
      return newUserProfile.value.expectation
    },
    set(value) {
      store.commit('profile/setProfileCreatorsExpectation', value)
    }
  })

  return {
    saveProfile,
    profileCreatorsName,
    profileBusinessName,
    profileCreatorsExpectation,
    newUserProfile
  }
}
